const Service = require("node-windows").Service;
const path = require("path");

// Create a new service object
const svc = new Service({
  name: "Discord Web RPC Service",
  script: path.join(__dirname, "src", "server.js"),
});

// Listen for the "uninstall" event
svc.on("uninstall", () => {
  console.log("✅ Discord Web RPC Service uninstalled successfully!");
  console.log("🧹 Service has been completely removed from Windows");
  console.log("");
  console.log("📋 What was removed:");
  console.log("   • Windows Service registration");
  console.log("   • Auto-start configuration");
  console.log("   • Service event logs");
  console.log("");
  console.log("💾 Your files are still here:");
  console.log("   • Extension files: Safe");
  console.log("   • Backend code: Safe");
  console.log("   • Configuration: Safe");
  console.log("");
  console.log("🔄 To reinstall: npm run install-service");
});

svc.on("error", (error) => {
  console.error("❌ Uninstall error:", error);
});

if (svc.exists) {
  console.log("🗑️  Uninstalling Discord Web RPC Service...");
  svc.uninstall();
} else {
  console.log("ℹ️  Service is not installed.");
}
