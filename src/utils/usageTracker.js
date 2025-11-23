// Simple usage tracking utility
const STORAGE_KEY = 'lumina_app_usage';

export const trackAppLaunch = (appName) => {
  const usage = getUsageData();
  const now = new Date().toISOString();
  
  if (!usage[appName]) {
    usage[appName] = {
      count: 0,
      lastUsed: null,
      history: []
    };
  }
  
  usage[appName].count += 1;
  usage[appName].lastUsed = now;
  usage[appName].history.push(now);
  
  // Keep only last 100 launches per app
  if (usage[appName].history.length > 100) {
    usage[appName].history = usage[appName].history.slice(-100);
  }
  
  saveUsageData(usage);
};

export const getRecentlyUsed = (limit = 5) => {
  const usage = getUsageData();
  
  return Object.entries(usage)
    .filter(([_, data]) => data.lastUsed)
    .map(([name, data]) => ({
      name,
      lastUsed: new Date(data.lastUsed),
      count: data.count
    }))
    .sort((a, b) => b.lastUsed - a.lastUsed)
    .slice(0, limit);
};

export const getFrequentlyUsed = (limit = 5) => {
  const usage = getUsageData();
  
  return Object.entries(usage)
    .map(([name, data]) => ({
      name,
      count: data.count,
      lastUsed: data.lastUsed ? new Date(data.lastUsed) : null
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

export const simulateUsageData = () => {
  // Simulate some usage data for demonstration
  const apps = [
    'Visual Studio Code',
    'Google Chrome',
    'Spotify',
    'Discord',
    'Microsoft Edge',
    'Notion',
    'Slack',
    'Adobe Photoshop'
  ];
  
  const usage = {};
  const now = new Date();
  
  apps.forEach((app, index) => {
    const count = Math.floor(Math.random() * 50) + 5;
    const daysAgo = Math.floor(Math.random() * 7);
    const lastUsed = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    
    usage[app] = {
      count,
      lastUsed: lastUsed.toISOString(),
      history: Array(count).fill(null).map((_, i) => {
        const date = new Date(now.getTime() - (Math.random() * 30 * 24 * 60 * 60 * 1000));
        return date.toISOString();
      })
    };
  });
  
  saveUsageData(usage);
};

const getUsageData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading usage data:', error);
    return {};
  }
};

const saveUsageData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving usage data:', error);
  }
};

export const clearUsageData = () => {
  localStorage.removeItem(STORAGE_KEY);
};
