const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron')
const path = require('path')
const AutoLaunch = require('electron-auto-launch')

// Enable hot reload in development
if (!app.isPackaged) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  });
}

const systemAPI = require('./system')

// Auto-launch configuration
const luminaAutoLauncher = new AutoLaunch({
  name: 'Lumina Uninstaller',
  path: app.getPath('exe'),
});

let mainWindow;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: '#0f172a',
  })

  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Handle minimize to tray
  mainWindow.on('close', (event) => {
    const settings = getSettings();
    console.log('Window closing, settings:', settings);
    
    if (settings.minimizeToTray && !app.isQuitting) {
      console.log('Minimizing to tray instead of closing');
      event.preventDefault();
      mainWindow.hide();
    } else {
      console.log('Closing app normally');
    }
    
    // Clear cache on exit if enabled
    if (settings.clearCacheOnExit && app.isQuitting) {
      console.log('Clearing cache on exit...');
      // Add actual cache clearing logic here
    }
  });
}

function createTray() {
  try {
    // Create tray icon (you'll need to add an icon file)
    const iconPath = path.join(__dirname, '../assets/icon.png');
    
    // Check if icon exists, otherwise skip tray creation
    const fs = require('fs');
    if (!fs.existsSync(iconPath)) {
      console.log('Tray icon not found, skipping tray creation');
      return;
    }
    
    tray = new Tray(iconPath);
    
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show Lumina',
        click: () => {
          mainWindow.show();
        }
      },
      {
        label: 'Quit',
        click: () => {
          app.isQuitting = true;
          app.quit();
        }
      }
    ]);
    
    tray.setContextMenu(contextMenu);
    tray.setToolTip('Lumina Uninstaller');
    
    tray.on('click', () => {
      mainWindow.show();
    });
  } catch (error) {
    console.error('Error creating tray:', error);
  }
}

// Helper to get settings
function getSettings() {
  // In a real app, you'd read from a config file or database
  // For now, we'll use a simple approach
  try {
    const fs = require('fs');
    const settingsPath = path.join(app.getPath('userData'), 'settings.json');
    if (fs.existsSync(settingsPath)) {
      return JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    }
  } catch (error) {
    console.error('Error reading settings:', error);
  }
  return { minimizeToTray: false, clearCacheOnExit: false };
}

app.whenReady().then(() => {
  createWindow()
  createTray()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// System API handlers
ipcMain.handle('get-apps', async () => {
  return await systemAPI.getInstalledApps()
})

ipcMain.handle('uninstall-app', async (event, uninstallString) => {
  return await systemAPI.uninstallApp(uninstallString)
})

ipcMain.handle('get-disk-space', async () => {
  return await systemAPI.getDiskSpace()
})

ipcMain.handle('get-temp-size', async () => {
  return await systemAPI.getTempFilesSize()
})

// Settings handlers
ipcMain.handle('set-auto-start', async (event, enabled) => {
  try {
    // Auto-launch only works in packaged apps
    if (!app.isPackaged) {
      console.log('Auto-launch is only available in packaged apps');
      return { 
        success: true, 
        note: 'Auto-launch only works in production (packaged app)' 
      };
    }
    
    if (enabled) {
      await luminaAutoLauncher.enable();
    } else {
      await luminaAutoLauncher.disable();
    }
    return { success: true };
  } catch (error) {
    console.error('Error setting auto-start:', error);
    return { success: false, error: error.message };
  }
})

ipcMain.handle('get-auto-start', async () => {
  try {
    const isEnabled = await luminaAutoLauncher.isEnabled();
    return isEnabled;
  } catch (error) {
    console.error('Error getting auto-start status:', error);
    return false;
  }
})

// Save settings to file
ipcMain.handle('save-settings', async (event, settings) => {
  try {
    const fs = require('fs');
    const settingsPath = path.join(app.getPath('userData'), 'settings.json');
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error saving settings:', error);
    return { success: false, error: error.message };
  }
})

// Get settings from file
ipcMain.handle('get-settings', async () => {
  try {
    const fs = require('fs');
    const settingsPath = path.join(app.getPath('userData'), 'settings.json');
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf8');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Error reading settings:', error);
    return null;
  }
})

// Window control handlers
ipcMain.on('minimize-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  win.minimize()
})

ipcMain.on('maximize-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win.isMaximized()) {
    win.unmaximize()
  } else {
    win.maximize()
  }
})

ipcMain.on('close-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  win.close()
})
