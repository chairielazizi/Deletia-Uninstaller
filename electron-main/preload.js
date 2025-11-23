const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getApps: () => ipcRenderer.invoke('get-apps'),
  uninstallApp: (uninstallString) => ipcRenderer.invoke('uninstall-app', uninstallString),
  getDiskSpace: () => ipcRenderer.invoke('get-disk-space'),
  getTempSize: () => ipcRenderer.invoke('get-temp-size'),
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),
})
