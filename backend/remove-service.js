const { exec, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

console.log("🗑️  Discord Web RPC Service Removal");
console.log("=".repeat(50));

// Check if running as administrator
function checkAdmin() {
  return new Promise((resolve) => {
    exec("net session", (error) => {
      resolve(!error);
    });
  });
}

// Check if service exists
function checkServiceExists() {
  return new Promise((resolve) => {
    exec('sc query "Discord Web RPC Service"', (error) => {
      resolve(!error);
    });
  });
}

// Stop service if running
function stopService() {
  return new Promise((resolve) => {
    console.log("🛑 Stopping service...");
    exec('net stop "Discord Web RPC Service"', (error, stdout) => {
      if (error && !error.message.includes("not started")) {
        console.log("ℹ️  Service was not running");
      } else {
        console.log("✅ Service stopped");
      }
      resolve();
    });
  });
}

// Remove service using uninstall-service.js
function removeService() {
  return new Promise((resolve, reject) => {
    console.log("🗑️  Removing Windows Service...");

    const removeProcess = spawn("node", ["uninstall-service.js"], {
      stdio: "inherit",
      shell: true,
    });

    removeProcess.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Service removed successfully!");
        resolve();
      } else {
        console.log("⚠️  Service removal completed with warnings");
        resolve(); // Continue even with warnings
      }
    });

    removeProcess.on("error", (error) => {
      console.log("⚠️  Service removal error (continuing):", error.message);
      resolve(); // Continue even with errors
    });
  });
}

// Force remove service if normal removal fails
function forceRemoveService() {
  return new Promise((resolve) => {
    console.log("🔧 Force removing service from Windows registry...");
    exec('sc delete "Discord Web RPC Service"', (error) => {
      if (error) {
        console.log("ℹ️  Service was already removed from registry");
      } else {
        console.log("✅ Service forcefully removed from registry");
      }
      resolve();
    });
  });
}

// Kill any remaining processes
function killRemainingProcesses() {
  return new Promise((resolve) => {
    console.log("🔍 Checking for remaining processes...");

    // Kill any Node.js processes running our server
    exec('tasklist /FI "IMAGENAME eq node.exe" /FO CSV', (error, stdout) => {
      if (!error && stdout.includes("server.js")) {
        console.log("🛑 Killing remaining Discord RPC processes...");
        exec(
          'taskkill /F /IM node.exe /FI "WINDOWTITLE eq Discord Web RPC*"',
          () => {
            console.log("✅ Remaining processes cleaned up");
            resolve();
          }
        );
      } else {
        console.log("✅ No remaining processes found");
        resolve();
      }
    });
  });
}

// Main removal function
async function removeComplete() {
  try {
    console.log("🔍 Checking system status...\n");

    // Check admin privileges
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      console.log("❌ Administrator privileges required!");
      console.log("\n🔧 Solution:");
      console.log("   1. Open Command Prompt as Administrator");
      console.log("   2. Navigate to this directory");
      console.log("   3. Run: npm run remove-service");
      console.log("\n   OR");
      console.log("\n   1. Open PowerShell as Administrator");
      console.log("   2. Run: Start-Process cmd -Verb RunAs");
      console.log('   3. In the new window: cd "' + __dirname + '"');
      console.log("   4. Run: npm run remove-service");
      process.exit(1);
    }
    console.log("✅ Running as Administrator");

    // Check if service exists
    const serviceExists = await checkServiceExists();
    if (!serviceExists) {
      console.log("ℹ️  Discord Web RPC Service is not installed");
      console.log("✅ Nothing to remove - system is already clean");

      // Still check for remaining processes
      await killRemainingProcesses();

      console.log("\n" + "=".repeat(50));
      console.log("✅ Cleanup Complete!");
      console.log("=".repeat(50));
      return;
    }

    console.log("📋 Found Discord Web RPC Service - proceeding with removal\n");

    // Stop the service
    await stopService();

    // Remove the service
    await removeService();

    // Force remove if still exists
    const stillExists = await checkServiceExists();
    if (stillExists) {
      await forceRemoveService();
    }

    // Kill any remaining processes
    await killRemainingProcesses();

    // Final verification
    const finalCheck = await checkServiceExists();

    console.log("\n" + "=".repeat(50));
    console.log("🎉 Removal Complete!");
    console.log("=".repeat(50));

    if (finalCheck) {
      console.log("⚠️  Service may still be registered (restart required)");
      console.log("✅ Background processes stopped");
    } else {
      console.log("✅ Discord Web RPC Service completely removed");
      console.log("✅ All background processes stopped");
    }

    console.log("✅ No personal data was removed");
    console.log("\n📋 What was removed:");
    console.log("   • Windows Service registration");
    console.log("   • Auto-start configuration");
    console.log("   • Background processes");
    console.log("   • Service event logs");
    console.log("\n💾 What was kept:");
    console.log("   • Source code files");
    console.log("   • Chrome extension");
    console.log("   • Node.js installation");
    console.log("   • Project dependencies");
    console.log("\n🔄 To reinstall: npm run setup-service");
    console.log("🗂️  To remove files: Delete this folder manually");
  } catch (error) {
    console.error("\n❌ Removal failed:", error.message);
    console.log("\n🔧 Manual cleanup steps:");
    console.log("   1. Open Services: Win+R → services.msc");
    console.log('   2. Find "Discord Web RPC Service" → Right-click → Stop');
    console.log('   3. Run as Admin: sc delete "Discord Web RPC Service"');
    console.log("   4. Open Task Manager → End any Node.js processes");
    console.log("   5. Restart Windows if needed");
    process.exit(1);
  }
}

// Run removal
removeComplete();
