# 🎮 Discord Web RPC for 100xDevs

Show your 100xDevs learning progress on Discord automatically!

## 🚀 Quick Setup (2 minutes)

### Prerequisites

- ✅ Windows 10/11
- ✅ Node.js 16+ ([Download](https://nodejs.org/))
- ✅ Discord Desktop App
- ✅ Chrome Browser

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/discord-web-rpc.git
   cd discord-web-rpc/backend
   ```

2. **Install as Windows Service** (Run as Administrator)

   ```bash
   # Option 1: PowerShell (Right-click "Run as Administrator")
   npm run setup-service

   # Option 2: Command Prompt (Right-click "Run as Administrator")
   npm run setup-service
   ```

3. **Install Chrome Extension**

   - Open Chrome → Extensions → Developer mode → Load unpacked
   - Select the `chrome-extension` folder
   - Done!

4. **Test it!**
   - Visit [app.100xdevs.com](https://app.100xdevs.com)
   - Check your Discord profile - you should see your activity!

## 🎯 That's it!

The service now runs automatically in the background and will start with Windows.

## 📋 Management

```bash
# Check service status
npm run service-status

# Uninstall service
npm run uninstall-service

# Manual start (if needed)
npm run install-service
```

## 🔧 Troubleshooting

**Service won't install?**

- Make sure you're running as Administrator
- Check if ports 7832/7833 are free
- Temporarily disable antivirus

**Discord RPC not working?**

- Make sure Discord desktop app is running
- Check service status: `npm run service-status`
- Visit: http://localhost:7832/status

**Chrome extension not working?**

- Make sure service is running
- Check browser console for errors
- Reload the extension

## 🗑️ Uninstall

```bash
cd discord-web-rpc/backend
npm run uninstall-service
```

Then delete the folder. That's it!
# 100xRPC
