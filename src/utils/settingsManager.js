// Settings storage utility
const SETTINGS_KEY = 'lumina_settings';

const defaultSettings = {
  autoStart: false,
  notifications: true,
  clearCacheOnExit: false,
  confirmUninstall: true,
  darkMode: true,
  minimizeToTray: true,
};

export const getSettings = () => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
    return defaultSettings;
  } catch (error) {
    console.error('Error reading settings:', error);
    return defaultSettings;
  }
};

export const saveSetting = async (key, value) => {
  try {
    const current = getSettings();
    const updated = { ...current, [key]: value };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    
    // Also save to main process for tray/close handler
    if (window.electronAPI?.saveSettings) {
      await window.electronAPI.saveSettings(updated);
    }
    
    return updated;
  } catch (error) {
    console.error('Error saving setting:', error);
    return getSettings();
  }
};

export const saveSettings = async (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    
    // Also save to main process
    if (window.electronAPI?.saveSettings) {
      await window.electronAPI.saveSettings(settings);
    }
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const resetSettings = () => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
    return defaultSettings;
  } catch (error) {
    console.error('Error resetting settings:', error);
    return defaultSettings;
  }
};
