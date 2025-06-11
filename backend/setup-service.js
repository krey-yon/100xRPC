const { exec, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

console.log("🚀 Discord Web RPC Service Setup");
console.log("=".repeat(50));

// Check if running as administrator
function checkAdmin() {
  return new Promise((resolve) => {
    exec("net session", (error) => {
      resolve(!error);
    });
  });
}

// Check if Node.js version is compatible
function checkNodeVersion() {
  const version = process.version;
  const majorVersion = parseInt(version.slice(1).split(".")[0]);

  console.log(`📋 Node.js version: ${version}`);

  if (majorVersion < 16) {
    console.log("❌ Node.js 16+ is required");
    return false;
  }

  console.log("✅ Node.js version is compatible");
  return true;
}

// Check if Discord is installed
function checkDiscord() {
  const discordPaths = [
    process.env.LOCALAPPDATA + "\\Discord\\Discord.exe",
    process.env.APPDATA + "\\Discord\\Discord.exe",
    process.env.ProgramFiles + "\\Discord\\Discord.exe",
    process.env["ProgramFiles(x86)"] + "\\Discord\\Discord.exe",
  ];

  for (const discordPath of discordPaths) {
    if (fs.existsSync(discordPath)) {
      console.log("✅ Discord found:", discordPath);
      return true;
    }
  }

  console.log("⚠️  Discord not found in common locations");
  console.log("   Make sure Discord is installed for RPC to work");
  return false;
}

// Install service
function installService() {
  return new Promise((resolve, reject) => {
    console.log("📦 Installing Windows Service...");

    const installProcess = spawn("node", ["install-service.js"], {
      stdio: "inherit",
      shell: true,
    });

    installProcess.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Service installed successfully!");
        resolve();
      } else {
        reject(new Error(`Service installation failed with code ${code}`));
      }
    });

    installProcess.on("error", (error) => {
      reject(error);
    });
  });
}

// Main setup function
async function setup() {
  try {
    console.log("🔍 Checking system requirements...\n");

    // Check admin privileges
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      console.log("❌ Administrator privileges required!");
      console.log("\n🔧 Solution:");
      console.log("   1. Open Command Prompt as Administrator");
      console.log("   2. Navigate to this directory");
      console.log("   3. Run: npm run setup-service");
      console.log("\n   OR");
      console.log("\n   1. Open PowerShell as Administrator");
      console.log("   2. Run: Start-Process cmd -Verb RunAs");
      console.log('   3. In the new window: cd "' + __dirname + '"');
      console.log("   4. Run: npm run setup-service");
      process.exit(1);
    }
    console.log("✅ Running as Administrator");

    // Check Node.js version
    if (!checkNodeVersion()) {
      console.log("\n🔧 Please update Node.js: https://nodejs.org/");
      process.exit(1);
    }

    // Check Discord
    checkDiscord();

    console.log("\n📦 Installing dependencies...");
    // Dependencies should already be installed by npm run setup-service

    // Install Windows Service
    await installService();

    console.log("\n" + "=".repeat(50));
    console.log("🎉 Setup Complete!");
    console.log("=".repeat(50));
    console.log("✅ Discord Web RPC Service is now running");
    console.log("✅ Service will auto-start with Windows");
    console.log("\n🔗 Test URLs:");
    console.log("   • http://localhost:7832/status");
    console.log("   • http://localhost:7832/health");
    console.log("\n📋 Management Commands:");
    console.log("   • Check status: npm run service-status");
    console.log("   • Uninstall: npm run uninstall-service");
    console.log(
      '   • View logs: Get-EventLog -LogName Application -Source "Discord Web RPC Service" -Newest 10'
    );
    console.log("\n🌐 Chrome Extension:");
    console.log("   • Load unpacked extension from: chrome-extension/");
    console.log("   • Visit app.100xdevs.com to see it work!");
    console.log("\n🎮 The service is running in the background now!");
  } catch (error) {
    console.error("\n❌ Setup failed:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("   • Make sure you're running as Administrator");
    console.log("   • Check if ports 7832 and 7833 are available");
    console.log("   • Temporarily disable antivirus");
    console.log("   • Try manual installation: npm run install-service");
    process.exit(1);
  }
}

// Run setup
setup();
