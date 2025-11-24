const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getApps: () => ipcRenderer.invoke("get-apps"),
  uninstallApp: (uninstallString) =>
    ipcRenderer.invoke("uninstall-app", uninstallString),
  getDiskSpace: () => ipcRenderer.invoke("get-disk-space"),
  getTempSize: () => ipcRenderer.invoke("get-temp-size"),
  setAutoStart: (enabled) => ipcRenderer.invoke("set-auto-start", enabled),
  getAutoStart: () => ipcRenderer.invoke("get-auto-start"),
  saveSettings: (settings) => ipcRenderer.invoke("save-settings", settings),
  getSettings: () => ipcRenderer.invoke("get-settings"),
  getCleanableFiles: () => ipcRenderer.invoke("get-cleanable-files"),
  cleanFiles: (itemIds) => ipcRenderer.invoke("clean-files", itemIds),
  minimizeWindow: () => ipcRenderer.send("minimize-window"),
  maximizeWindow: () => ipcRenderer.send("maximize-window"),
  closeWindow: () => ipcRenderer.send("close-window"),
});
