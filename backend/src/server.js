const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");
const path = require("path");
const fs = require("fs");
const {
  updatePresence,
  initializeRPC,
  clearPresence,
  getConnectionStatus,
} = require("./discord-rpc");

const app = express();
const PORT = process.env.PORT || 7832;
const WS_PORT = process.env.WS_PORT || 7833;
const IS_SERVICE = process.env.NODE_ENV === "production";

// Setup logging for service mode
const logDir = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Store original console methods to avoid circular reference
const originalLog = console.log;
const originalError = console.error;

// Custom logger that works in service mode
function serviceLog(level, message, ...args) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

  // Use original console methods to avoid circular reference
  originalLog(logMessage, ...args);

  // Also log to file for debugging
  if (IS_SERVICE) {
    try {
      const logFile = path.join(logDir, "discord-rpc.log");
      const fullMessage =
        logMessage + (args.length > 0 ? " " + args.join(" ") : "") + "\n";
      fs.appendFileSync(logFile, fullMessage);
    } catch (error) {
      originalError("Failed to write to log file:", error);
    }
  }
}

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

// Enhanced logging middleware
app.use((req, res, next) => {
  serviceLog("info", `📡 ${req.method} ${req.path}`);
  next();
});

// Service info endpoint
app.get("/service-info", (req, res) => {
  res.json({
    serviceName: "Discord Web RPC Service",
    version: require("../package.json").version,
    isService: IS_SERVICE,
    uptime: process.uptime(),
    pid: process.pid,
    ports: {
      http: PORT,
      websocket: WS_PORT,
    },
    logLocation: IS_SERVICE ? path.join(logDir, "discord-rpc.log") : "console",
    timestamp: new Date().toISOString(),
  });
});

// Initialize Discord RPC with retry logic
serviceLog("info", "🚀 Initializing Discord RPC...");
initializeRPC();

// REST endpoint for updating status
app.post("/update-status", (req, res) => {
  serviceLog("info", "📨 Received update-status request");

  const { activity } = req.body;

  if (!activity) {
    serviceLog("error", "❌ No activity provided in request");
    return res.status(400).json({ error: "Activity is required" });
  }

  serviceLog("info", "🎯 Processing activity:", JSON.stringify(activity));
  const success = updatePresence(activity);

  if (success) {
    serviceLog("info", "✅ Activity update successful");
    res.status(200).json({
      message: "Status updated successfully",
      activity: activity,
    });
  } else {
    serviceLog("error", "❌ Activity update failed");
    res.status(500).json({ error: "Failed to update Discord status" });
  }
});

// REST endpoint for clearing status
app.post("/clear-status", (req, res) => {
  serviceLog("info", "🗑️ Received clear-status request");

  try {
    const success = clearPresence();
    if (success) {
      serviceLog("info", "✅ Status cleared successfully");
      res.status(200).json({ message: "Status cleared successfully" });
    } else {
      serviceLog("error", "❌ Failed to clear status");
      res.status(500).json({ error: "Failed to clear Discord status" });
    }
  } catch (error) {
    serviceLog("error", "💥 Error in clear-status endpoint:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// REST endpoint for status check
app.get("/status", (req, res) => {
  const status = getConnectionStatus();
  res.status(200).json({
    ...status,
    message: "Discord Web RPC is running",
    service: {
      isService: IS_SERVICE,
      uptime: process.uptime(),
      port: PORT,
      wsPort: WS_PORT,
      timestamp: new Date().toISOString(),
      version: require("../package.json").version,
    },
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  const status = getConnectionStatus();
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    discord: status,
    service: {
      isService: IS_SERVICE,
      uptime: process.uptime(),
    },
  });
});

// Service control endpoints (for future tray app)
app.post("/service/stop", (req, res) => {
  if (IS_SERVICE) {
    serviceLog("info", "🛑 Service stop requested");
    res.json({ message: "Service stopping..." });
    setTimeout(() => process.exit(0), 1000);
  } else {
    res.status(400).json({ error: "Not running as service" });
  }
});

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ port: WS_PORT });

wss.on("connection", (ws) => {
  serviceLog("info", "🔗 Chrome extension connected via WebSocket");

  // Send connection status immediately
  const status = getConnectionStatus();
  ws.send(
    JSON.stringify({
      type: "status",
      ...status,
    })
  );

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      serviceLog("info", `📨 WebSocket message: ${data.type}`);

      if (data.type === "activity") {
        serviceLog("info", "🎯 Processing WebSocket activity");
        const success = updatePresence(data.activity);

        const response = {
          type: "response",
          status: success ? "success" : "error",
          message: success ? "Activity updated" : "Failed to update activity",
          timestamp: new Date().toISOString(),
        };

        serviceLog("info", `📤 Sending WebSocket response: ${response.status}`);
        ws.send(JSON.stringify(response));
      } else if (data.type === "clear") {
        serviceLog("info", "🗑️ Processing WebSocket clear request");
        const success = clearPresence();

        const response = {
          type: "response",
          status: success ? "success" : "error",
          message: success ? "Activity cleared" : "Failed to clear activity",
          timestamp: new Date().toISOString(),
        };

        serviceLog("info", `📤 Sending WebSocket response: ${response.status}`);
        ws.send(JSON.stringify(response));
      } else if (data.type === "ping") {
        const status = getConnectionStatus();
        ws.send(
          JSON.stringify({
            type: "pong",
            timestamp: Date.now(),
            ...status,
          })
        );
      } else {
        serviceLog("info", `❓ Unknown WebSocket message type: ${data.type}`);
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Unknown message type",
          })
        );
      }
    } catch (error) {
      serviceLog("error", "❌ WebSocket message error:", error.message);
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Invalid message format",
          error: error.message,
        })
      );
    }
  });

  ws.on("close", () => {
    serviceLog("info", "🔌 Chrome extension disconnected");
  });

  ws.on("error", (error) => {
    serviceLog("error", "❌ WebSocket connection error:", error.message);
  });
});

// Handle WebSocket server errors
wss.on("error", (error) => {
  serviceLog("error", "❌ WebSocket Server error:", error.message);
});

// Graceful shutdown handling
process.on("SIGINT", () => {
  serviceLog("info", "🛑 Received SIGINT, shutting down gracefully...");
  clearPresence();

  wss.close(() => {
    serviceLog("info", "🔌 WebSocket server closed");
  });

  setTimeout(() => {
    process.exit(0);
  }, 1000);
});

process.on("SIGTERM", () => {
  serviceLog("info", "🛑 Received SIGTERM, shutting down gracefully...");
  clearPresence();
  process.exit(0);
});

// Catch unhandled errors
process.on("uncaughtException", (error) => {
  serviceLog("error", "💥 Uncaught Exception:", error.message);
  serviceLog("error", "Stack:", error.stack);
});

process.on("unhandledRejection", (reason, promise) => {
  serviceLog("error", "💥 Unhandled Rejection at:", promise, "reason:", reason);
});

// Start the servers
app.listen(PORT, () => {
  serviceLog("info", "=".repeat(60));
  serviceLog("info", "🚀 Discord Web RPC Service Started!");
  serviceLog("info", "=".repeat(60));
  serviceLog("info", `🌐 HTTP Server: http://localhost:${PORT}`);
  serviceLog("info", `🔌 WebSocket Server: ws://localhost:${WS_PORT}`);
  serviceLog(
    "info",
    `🎮 Mode: ${IS_SERVICE ? "Windows Service" : "Development"}`
  );
  serviceLog("info", `📊 Status: http://localhost:${PORT}/status`);
  serviceLog("info", `🏥 Health: http://localhost:${PORT}/health`);
  serviceLog("info", `ℹ️  Service Info: http://localhost:${PORT}/service-info`);
  if (IS_SERVICE) {
    serviceLog("info", `📁 Logs: ${path.join(logDir, "discord-rpc.log")}`);
  }
  serviceLog("info", "=".repeat(60));
});

wss.on("listening", () => {
  serviceLog("info", `✅ WebSocket server listening on port ${WS_PORT}`);
});

// Log initial connection status
setTimeout(() => {
  serviceLog("info", "🔍 Initial Discord connection check...");
  getConnectionStatus();
}, 2000);
