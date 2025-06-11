const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 7834 }); // Unique port for Discord Web RPC

wss.on("connection", (ws) => {
  console.log("Client connected to Discord Web RPC WebSocket");

  ws.on("message", (message) => {
    console.log("Received:", message);
    // Here you can handle the incoming message and process it
    // For example, you could update the Discord Rich Presence based on the message
  });

  ws.on("close", () => {
    console.log("Client disconnected from Discord Web RPC");
  });
});

console.log(
  "Discord Web RPC WebSocket server is running on ws://localhost:7834"
);
