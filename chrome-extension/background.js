const BACKEND_URL = "http://localhost:7832"; // Updated unique port

chrome.runtime.onInstalled.addListener(() => {
  console.log("Discord Web RPC Extension installed.");
});

let socket = null;
let isConnected = false;
let currentActivity = null;
let active100xDevsTab = null; // Track the active 100xdevs tab
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;

// Connect to WebSocket server
function connectToServer() {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.log(
      "Max reconnection attempts reached. Please restart the backend server."
    );
    return;
  }

  try {
    console.log(
      `Attempting to connect to WebSocket server (attempt ${
        reconnectAttempts + 1
      })...`
    );
    socket = new WebSocket("ws://localhost:7833"); // Updated unique WebSocket port

    socket.onopen = () => {
      console.log("✅ Connected to Discord RPC server");
      isConnected = true;
      reconnectAttempts = 0; // Reset on successful connection

      // Send current activity if available
      if (currentActivity) {
        console.log("Sending cached activity:", currentActivity);
        sendActivity(currentActivity);
      }
    };

    socket.onclose = (event) => {
      console.log(
        "🔌 Disconnected from Discord RPC server",
        event.code,
        event.reason
      );
      isConnected = false;
      reconnectAttempts++;

      // Reconnect after 5 seconds
      setTimeout(connectToServer, 5000);
    };

    socket.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    socket.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        console.log("📨 Server response:", response);

        if (response.type === "response") {
          if (response.status === "success") {
            console.log("✅ Discord presence updated successfully");
          } else {
            console.error(
              "❌ Discord presence update failed:",
              response.message
            );
          }
        }
      } catch (error) {
        console.error("Error parsing server response:", error);
      }
    };
  } catch (error) {
    console.error("Failed to connect to server:", error);
    reconnectAttempts++;
    setTimeout(connectToServer, 5000);
  }
}

function sendActivity(activity) {
  console.log("🎯 Attempting to send activity:", activity);

  if (socket && isConnected) {
    const message = {
      type: "activity",
      activity: activity,
    };

    console.log("📤 Sending to WebSocket:", message);
    socket.send(JSON.stringify(message));
    console.log("✅ Activity sent to Discord RPC server");
  } else {
    console.log("❌ Cannot send activity - WebSocket not connected");
    console.log(`Socket exists: ${!!socket}, Connected: ${isConnected}`);

    // Try to reconnect if not connected
    if (!isConnected) {
      connectToServer();
    }
  }
}

function clearPresence() {
  console.log("🗑️ Clearing Discord presence...");

  if (socket && isConnected) {
    socket.send(JSON.stringify({ type: "clear" }));
    console.log("✅ Clear request sent to Discord RPC server");
  } else {
    console.log("❌ Cannot clear presence - WebSocket not connected");
  }

  currentActivity = null;
  active100xDevsTab = null;
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("📨 Received message:", request.type, request);

  if (request.type === "pageActivity") {
    console.log("🎯 Received page activity:", request.activity);
    currentActivity = request.activity;
    active100xDevsTab = sender.tab?.id; // Track which tab is showing 100xdevs
    sendActivity(request.activity);
  }

  if (request.type === "clearPresence") {
    console.log("🗑️ Clearing presence - user left 100xdevs");
    clearPresence();
  }

  if (request.action === "sendActivity") {
    sendActivityToBackend(request.data);
  }

  if (request.type === "getCurrentActivity") {
    console.log("📊 Current activity requested:", currentActivity);
    sendResponse({ activity: currentActivity });
  }

  if (request.type === "toggle") {
    // Toggle RPC functionality
    if (isConnected && socket) {
      console.log("🔄 Disconnecting WebSocket");
      socket.close();
    } else {
      console.log("🔄 Reconnecting to WebSocket");
      connectToServer();
    }
  }

  if (request.type === "clear") {
    // Clear Discord activity
    clearPresence();
  }
});

function sendActivityToBackend(data) {
  console.log("📤 Sending activity to backend:", data);

  fetch(`${BACKEND_URL}/api/activity`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("✅ Activity sent to backend:", responseData);
    })
    .catch((error) => {
      console.error("❌ Error sending activity to backend:", error);
    });
}

// Function to check if URL is 100xdevs
function is100xDevsWebsite(url) {
  return url && url.includes("app.100xdevs.com");
}

// Listen for tab removal (when tabs are closed)
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log(`🗂️ Tab ${tabId} was closed`);

  // If the closed tab was showing 100xdevs activity, clear presence
  if (active100xDevsTab === tabId) {
    console.log("🗑️ 100xdevs tab was closed, clearing presence");
    clearPresence();
  }
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    updateActivity(tab);
  }

  // If URL changed from 100xdevs to something else
  if (
    changeInfo.url &&
    tabId === active100xDevsTab &&
    !is100xDevsWebsite(changeInfo.url)
  ) {
    console.log("🔄 100xdevs tab navigated away, clearing presence");
    clearPresence();
  }
});

// Listen for tab activation (when switching between tabs)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  updateActivity(tab);

  // If switching away from 100xdevs tab to a different tab
  if (active100xDevsTab && active100xDevsTab !== activeInfo.tabId) {
    console.log("🔄 Switched away from 100xdevs tab, clearing presence");
    clearPresence();
  }
});

function updateActivity(tab) {
  if (!tab.url || tab.url.startsWith("chrome://")) {
    // If we had a 100xdevs tab active and now on chrome:// page, clear presence
    if (active100xDevsTab) {
      clearPresence();
    }
    return;
  }

  // Only allow 100xdevs activities - clear presence for other sites
  if (!is100xDevsWebsite(tab.url)) {
    console.log("🚫 Not on 100xdevs website, clearing presence");
    clearPresence();
    return;
  }

  // Let content script handle 100xdevs activities
  console.log("✅ On 100xdevs website, content script will handle activity");
}

// Listen for window focus changes
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Browser lost focus (user switched to another app)
    console.log("👁️ Browser lost focus, clearing presence");
    clearPresence();
  } else {
    // Browser gained focus, check current tab
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        windowId: windowId,
      });
      if (tab) {
        updateActivity(tab);
      }
    } catch (error) {
      console.log("❌ Could not get active tab");
    }
  }
});

// Initialize connection when extension starts
console.log("🚀 Initializing Discord Web RPC Extension...");
connectToServer();

// Clear presence when extension is starting up (in case it was left from previous session)
setTimeout(() => {
  console.log("🧹 Initial cleanup - clearing any existing presence");
  clearPresence();
}, 1000);
