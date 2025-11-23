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

export const saveSetting = (key, value) => {
  try {
    const current = getSettings();
    const updated = { ...current, [key]: value };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error saving setting:', error);
    return getSettings();
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
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
