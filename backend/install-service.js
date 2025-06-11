const Service = require("node-windows").Service;
const path = require("path");

// Create a new service object
const svc = new Service({
  name: "Discord Web RPC Service",
  description: "Discord Web RPC Background Service for 100xDevs Extension",
  script: path.join(__dirname, "src", "server.js"),
  nodeOptions: ["--harmony", "--max_old_space_size=4096"],
  env: [
    {
      name: "NODE_ENV",
      value: "production",
    },
    {
      name: "PORT",
      value: "7832",
    },
    {
      name: "WS_PORT",
      value: "7833",
    },
  ],
  // Service will restart automatically if it crashes
  wait: 2,
  grow: 0.5,
});

// Listen for the "install" event
svc.on("install", () => {
  console.log("✅ Discord Web RPC Service installed successfully!");
  console.log("🚀 Starting the service...");
  svc.start();
});

svc.on("start", () => {
  console.log("✅ Discord Web RPC Service started!");
  console.log("🎮 Service is now running in the background");
  console.log("");
  console.log("📋 Service Management:");
  console.log("   • View in Services: Win+R → services.msc");
  console.log('   • Stop service: net stop "Discord Web RPC Service"');
  console.log('   • Start service: net start "Discord Web RPC Service"');
  console.log("   • Uninstall: npm run uninstall-service");
  console.log("");
  console.log("🌐 Service URLs:");
  console.log("   • Status: http://localhost:7832/status");
  console.log("   • Health: http://localhost:7832/health");
});

svc.on("stop", () => {
  console.log("🛑 Discord Web RPC Service stopped");
});

svc.on("error", (error) => {
  console.error("❌ Service error:", error);
});

// Check if service already exists
if (svc.exists) {
  console.log("⚠️  Service already exists. Uninstalling first...");
  svc.uninstall();

  svc.on("uninstall", () => {
    console.log("🗑️  Previous service uninstalled. Installing new version...");
    svc.install();
  });
} else {
  console.log("📦 Installing Discord Web RPC Service...");
  svc.install();
}
