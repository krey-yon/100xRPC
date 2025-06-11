const DiscordRPC = require("discord-rpc");

// Your Discord application client ID (create one at https://discord.com/developers/applications)
const CLIENT_ID = "1382339421726048266";
let rpc = null;
let isConnected = false;
let currentUser = null;

async function initializeRPC() {
  try {
    // Close existing connection if any
    if (rpc) {
      try {
        await rpc.destroy();
      } catch (error) {
        console.log("Previous RPC connection cleanup");
      }
    }

    rpc = new DiscordRPC.Client({ transport: "ipc" });

    rpc.on("ready", () => {
      console.log("✅ Discord RPC connected successfully!");
      currentUser = rpc.user;
      isConnected = true;
      console.log(
        `👤 Connected as: ${currentUser.username}#${currentUser.discriminator}`
      );
    });

    rpc.on("disconnected", () => {
      console.log("🔌 Discord RPC disconnected");
      isConnected = false;
      currentUser = null;
      // Attempt to reconnect after 10 seconds
      setTimeout(initializeRPC, 10000);
    });

    await rpc.login({ clientId: CLIENT_ID });
  } catch (error) {
    console.error("❌ Failed to connect to Discord:", error.message);
    isConnected = false;
    currentUser = null;
    // Retry connection after 10 seconds
    console.log("🔄 Retrying Discord connection in 10 seconds...");
    setTimeout(initializeRPC, 10000);
  }
}

function updatePresence(activity) {
  console.log("🎯 Attempting to update Discord presence...");

  if (!rpc || !isConnected) {
    console.log("❌ Discord RPC not connected - cannot update presence");
    console.log(`RPC exists: ${!!rpc}, Connected: ${isConnected}`);
    return false;
  }

  try {
    const presence = {
      details: activity.details || "Browsing the web",
      state: activity.state || "100xDevs Platform",
      startTimestamp: activity.startTime || Date.now(),
      largeImageKey: "web", // You can add custom images in Discord Developer Portal
      largeImageText: activity.title || "100xDevs Learning",
      smallImageKey: "chrome",
      smallImageText: "Chrome Extension",
      instance: false,
    };

    // Add buttons if provided
    if (activity.buttons && Array.isArray(activity.buttons)) {
      presence.buttons = activity.buttons.slice(0, 2); // Discord allows max 2 buttons
    }

    console.log("📤 Sending presence to Discord:", {
      details: presence.details,
      state: presence.state,
      buttons: presence.buttons ? presence.buttons.length : 0,
      startTime: new Date(presence.startTimestamp).toISOString(),
    });

    rpc.setActivity(presence);
    console.log("✅ Discord presence updated successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error updating Discord presence:", error.message);
    console.error("Full error:", error);
    return false;
  }
}

function clearPresence() {
  console.log("🗑️ Attempting to clear Discord presence...");

  if (!rpc || !isConnected) {
    console.log("❌ Discord RPC not connected - cannot clear presence");
    return false;
  }

  try {
    rpc.clearActivity();
    console.log("✅ Discord presence cleared successfully");
    return true;
  } catch (error) {
    console.error("❌ Error clearing Discord presence:", error.message);
    return false;
  }
}

function getConnectionStatus() {
  const status = {
    connected: isConnected,
    user: currentUser,
    clientId: CLIENT_ID,
    rpcExists: !!rpc,
  };

  console.log("📊 Connection Status:", status);
  return status;
}

module.exports = {
  initializeRPC,
  updatePresence,
  clearPresence,
  getConnectionStatus,
};
