// Cleaning history tracker
const CLEANING_HISTORY_KEY = 'lumina_cleaning_history';

export const recordCleaning = (sizeInKB) => {
  const history = getCleaningHistory();
  history.push({
    date: new Date().toISOString(),
    size: sizeInKB
  });
  saveCleaningHistory(history);
};

export const getSpaceCleaned = (period = 'all') => {
  const history = getCleaningHistory();
  const now = new Date();
  
  let startDate;
  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'quarter':
      const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
      startDate = new Date(now.getFullYear(), quarterMonth, 1);
      break;
    case 'all':
    default:
      startDate = new Date(0); // Beginning of time
  }
  
  return history
    .filter(entry => new Date(entry.date) >= startDate)
    .reduce((total, entry) => total + entry.size, 0);
};

export const simulateCleaningHistory = () => {
  const history = [];
  const now = new Date();
  
  // Generate some random cleaning history over the past 3 months
  for (let i = 0; i < 20; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const size = Math.floor(Math.random() * 2000000) + 100000; // 100MB - 2GB
    
    history.push({
      date: date.toISOString(),
      size
    });
  }
  
  saveCleaningHistory(history);
};

const getCleaningHistory = () => {
  try {
    const data = localStorage.getItem(CLEANING_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading cleaning history:', error);
    return [];
  }
};

const saveCleaningHistory = (history) => {
  try {
    localStorage.setItem(CLEANING_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving cleaning history:', error);
  }
};

export const clearCleaningHistory = () => {
  localStorage.removeItem(CLEANING_HISTORY_KEY);
};

// System health checker
export const getSystemStatus = async (appCount) => {
  let diskStatus = 'good';
  let freeSpacePercent = 0;
  let tempFilesSize = 0;
  let tempStatus = 'good';

  // Get real disk space if running in Electron
  if (window.electronAPI) {
    try {
      const diskInfo = await window.electronAPI.getDiskSpace();
      freeSpacePercent = diskInfo.freePercent;
      
      // Get real temp file size
      tempFilesSize = await window.electronAPI.getTempSize();
    } catch (error) {
      console.error('Error getting system info:', error);
    }
  }
  
  // Calculate status based on multiple factors
  diskStatus = freeSpacePercent > 20 ? 'good' : freeSpacePercent > 10 ? 'warning' : 'critical';
  const appStatus = appCount < 500 ? 'good' : appCount < 800 ? 'warning' : 'critical';
  tempStatus = tempFilesSize < 5000000 ? 'good' : tempFilesSize < 10000000 ? 'warning' : 'critical';
  
  // Overall status (worst of all checks)
  const statuses = [diskStatus, appStatus, tempStatus];
  const overallStatus = statuses.includes('critical') ? 'critical' 
    : statuses.includes('warning') ? 'warning' 
    : 'good';
  
  return {
    status: overallStatus,
    label: overallStatus === 'good' ? 'Good' 
      : overallStatus === 'warning' ? 'Warning' 
      : 'Critical',
    color: overallStatus === 'good' ? '#10b981' 
      : overallStatus === 'warning' ? '#f59e0b' 
      : '#ef4444',
    details: {
      diskSpace: { percent: freeSpacePercent, status: diskStatus },
      appCount: { count: appCount, status: appStatus },
      tempFiles: { size: tempFilesSize, status: tempStatus }
    }
  };
};
