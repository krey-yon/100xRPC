document.addEventListener("DOMContentLoaded", () => {
  const statusEl = document.getElementById("status");
  const refreshBtn = document.getElementById("refresh");
  const clearBtn = document.getElementById("clear");
  const activityInfo = document.getElementById("activity-info");
  const activityDetails = document.getElementById("activity-details");

  let backendConnected = false;
  let discordConnected = false;

  // Check backend and Discord status
  checkStatus();

  refreshBtn.addEventListener("click", () => {
    checkStatus();
    // Also refresh current tab activity
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.runtime.sendMessage({
          type: "updateActivity",
          tab: tabs[0],
        });
      }
    });
  });

  clearBtn.addEventListener("click", async () => {
    try {
      const response = await fetch("http://localhost:7832/clear-status", {
        // Updated unique port
        method: "POST",
      });

      if (response.ok) {
        // Also clear via runtime message
        chrome.runtime.sendMessage({ type: "clear" });
        activityInfo.style.display = "none";
        showToast("Activity cleared! 🗑️");
      } else {
        const result = await response.json();
        showToast("Error: " + result.error, "error");
      }
    } catch (error) {
      // Try clearing via runtime message if backend is down
      chrome.runtime.sendMessage({ type: "clear" });
      showToast("Activity cleared locally! 🗑️");
    }
  });

  async function checkStatus() {
    try {
      const response = await fetch("http://localhost:7832/status"); // Updated unique port
      const data = await response.json();

      backendConnected = true;
      discordConnected = data.connected;

      if (discordConnected) {
        statusEl.innerHTML = `
                    <div>✅ Connected to Discord</div>
                    ${
                      data.user
                        ? `<div class="user-info">👤 ${data.user.username}#${data.user.discriminator}</div>`
                        : ""
                    }
                `;
        statusEl.className = "status status-connected";

        clearBtn.disabled = false;
        clearBtn.className = "btn-danger";
      } else {
        statusEl.innerHTML = `
                    <div>❌ Discord not connected</div>
                    <div class="user-info">Make sure Discord is running</div>
                `;
        statusEl.className = "status status-disconnected";
        clearBtn.disabled = true;
        clearBtn.className = "btn-disabled";
      }
    } catch (error) {
      backendConnected = false;
      statusEl.innerHTML = `
                <div>❌ Backend server not running</div>
                <div class="user-info">Please start the Node.js server on port 7832</div>
            `;
      statusEl.className = "status status-disconnected";
      clearBtn.disabled = true;
      clearBtn.className = "btn-disabled";
    }
  }

  function showToast(message, type = "success") {
    // Simple toast notification
    const toast = document.createElement("div");
    toast.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 10px 15px;
            border-radius: 5px;
            color: white;
            font-size: 12px;
            z-index: 1000;
            background-color: ${type === "error" ? "#dc3545" : "#28a745"};
        `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  }

  // Get current activity from background script
  chrome.runtime.sendMessage({ type: "getCurrentActivity" }, (response) => {
    if (response && response.activity) {
      showCurrentActivity(response.activity);
    }
  });

  // Check if current tab is 100xdevs and show appropriate message
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      const currentUrl = tabs[0].url;
      checkCurrentWebsite(currentUrl);
    }
  });

  function checkCurrentWebsite(url) {
    const websiteInfo = document.createElement("div");
    websiteInfo.style.cssText = `
      background: #f8f9fa;
      padding: 10px;
      border-radius: 6px;
      margin-bottom: 15px;
      font-size: 12px;
      border-left: 3px solid ${
        url && url.includes("app.100xdevs.com") ? "#28a745" : "#ffc107"
      };
    `;

    if (url && url.includes("app.100xdevs.com")) {
      websiteInfo.innerHTML = `
        <div style="color: #155724; font-weight: bold;">
          ✅ 100xDevs Website Detected
        </div>
        <div style="color: #155724; margin-top: 4px;">
          Discord presence is active
        </div>
      `;
    } else {
      websiteInfo.innerHTML = `
        <div style="color: #856404; font-weight: bold;">
          ℹ️ Not on 100xDevs Website
        </div>
        <div style="color: #856404; margin-top: 4px;">
          Discord presence is disabled for privacy
        </div>
      `;
    }

    // Insert after status but before activity info
    statusEl.parentNode.insertBefore(websiteInfo, activityInfo);
  }

  function showCurrentActivity(activity) {
    if (activity) {
      activityInfo.style.display = "block";

      let badgeHtml = "";
      let detailsHtml = "";

      // Check if it's a 100xdevs course
      if (activity.url && activity.url.includes("app.100xdevs.com/courses/")) {
        badgeHtml = '<span class="badge badge-100xdevs">100xDevs</span> ';
        if (activity.details && activity.details.startsWith("Watching")) {
          badgeHtml += '<span class="badge badge-watching">Watching</span>';
        }

        detailsHtml = `
                    <div class="lecture-title">${
                      activity.details || "N/A"
                    }</div>
                    <div><strong>Platform:</strong> ${
                      activity.state || "N/A"
                    }</div>
                    <div><strong>URL:</strong> <a href="${
                      activity.url
                    }" target="_blank" style="color: #5865f2; text-decoration: none;">${activity.url
          .split("/")
          .slice(-2)
          .join("/")}</a></div>
                `;
      } else if (activity.url && activity.url.includes("app.100xdevs.com")) {
        // General 100xdevs activity
        badgeHtml = '<span class="badge badge-100xdevs">100xDevs</span>';
        detailsHtml = `
                    <div class="lecture-title">${
                      activity.details || "N/A"
                    }</div>
                    <div><strong>Platform:</strong> ${
                      activity.state || "N/A"
                    }</div>
                    <div><strong>URL:</strong> <a href="${
                      activity.url
                    }" target="_blank" style="color: #5865f2; text-decoration: none;">100xDevs Platform</a></div>
                `;
      } else {
        // This shouldn't happen anymore, but just in case
        activityInfo.style.display = "none";
        return;
      }

      activityDetails.innerHTML = `
                <div style="margin-bottom: 8px;">${badgeHtml}</div>
                ${detailsHtml}
            `;
    } else {
      activityInfo.style.display = "none";
    }
  }

  // Listen for activity updates
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "activityUpdate") {
      showCurrentActivity(request.activity);
    }
  });
});
