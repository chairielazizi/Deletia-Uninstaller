import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const electron = require('electron')
const { app, BrowserWindow, ipcMain } = electron
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const { getInstalledApps, uninstallApp } = require('./system.js')

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    frame: false, // Frameless for custom titlebar
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: '#0f172a',
  })

  // In dev, load vite dev server. In prod, load index.html
  const isDev = !app.isPackaged;
  if (isDev) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

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

// IPC Handlers will go here
ipcMain.handle('get-apps', async () => {
  const apps = await getInstalledApps()
  return apps
})

ipcMain.handle('uninstall-app', async (event, uninstallString) => {
  return await uninstallApp(uninstallString)
})
