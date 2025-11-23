import React, { useState, useEffect } from 'react';
import { Package, Trash2, Search, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCache } from '../context/CacheContext';
import toast, { Toaster } from 'react-hot-toast';

const formatSize = (sizeInKB) => {
  if (!sizeInKB || sizeInKB === 0) return null;
  const sizeInMB = sizeInKB / 1024;
  if (sizeInMB < 1024) {
    return `${sizeInMB.toFixed(1)} MB`;
  }
  const sizeInGB = sizeInMB / 1024;
  return `${sizeInGB.toFixed(2)} GB`;
};

const AppList = () => {
  const { fetchApps, loadingApps, appsCache } = useCache();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Show cached data immediately if available
    if (appsCache) {
      setApps(appsCache);
      setLoading(false);
    } else {
      loadData();
    }
  }, [appsCache]);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchApps();
    setApps(data);
    setLoading(false);
  };

  const handleRefresh = async () => {
    const data = await fetchApps(true); // Force refresh
    setApps(data);
    toast.success('Applications refreshed successfully!', {
      duration: 3000,
      position: 'bottom-right',
    });
  };

  const filteredApps = apps.filter(app => 
    app.DisplayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUninstall = async (app) => {
    if (!app.UninstallString) {
      alert('No uninstall string found for this app.');
      return;
    }
    
    if (window.electronAPI) {
      const success = await window.electronAPI.uninstallApp(app.UninstallString);
      if (success) {
        console.log('Uninstaller launched');
      } else {
        console.error('Failed to launch uninstaller');
      }
    }
  };

  return (
    <div className="app-list-container">
      <div className="header">
        <div className="header-left">
          <h1>Applications</h1>
          <button 
            className="refresh-btn" 
            onClick={handleRefresh}
            disabled={loadingApps}
            title="Refresh applications"
          >
            <RefreshCw size={18} className={loadingApps ? 'spin' : ''} />
          </button>
        </div>
        <div className="search-bar">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search apps..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="content">
        {loading ? (
          <div className="loading">Loading applications...</div>
        ) : (
          <div className="grid">
            {filteredApps.map((app, index) => (
              <motion.div 
                key={index}
                className="app-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.5) }}
              >
                <div className="app-icon">
                  <Package size={24} color="#38bdf8" />
                </div>
                <div className="app-info">
                  <h3 title={app.DisplayName}>{app.DisplayName}</h3>
                  <p>{app.Publisher || 'Unknown Publisher'}</p>
                  <div className="app-meta">
                    {app.DisplayVersion && (
                      <span className="version">v{app.DisplayVersion}</span>
                    )}
                    {app.EstimatedSize && formatSize(app.EstimatedSize) && (
                      <span className="size">{formatSize(app.EstimatedSize)}</span>
                    )}
                  </div>
                </div>
                <button className="uninstall-btn" onClick={() => handleUninstall(app)} title="Uninstall">
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Toaster />

      <style>{`
        .app-list-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          padding: 30px 40px 40px 40px;
          box-sizing: border-box;
          overflow: hidden;
        }

        .header {
          flex-shrink: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
        }

        .refresh-btn {
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.2);
          color: var(--accent-color);
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .refresh-btn:hover:not(:disabled) {
          background: rgba(56, 189, 248, 0.15);
          border-color: rgba(56, 189, 248, 0.3);
        }

        .refresh-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .search-bar {
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          width: 300px;
          transition: border-color 0.3s;
        }

        .search-bar:focus-within {
          border-color: var(--accent-color);
        }

        .search-bar input {
          background: transparent;
          border: none;
          color: var(--text-primary);
          width: 100%;
          outline: none;
          font-size: 14px;
        }

        .content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          min-height: 0;
        }

        .content::-webkit-scrollbar {
          width: 8px;
        }

        .content::-webkit-scrollbar-track {
          background: transparent;
        }

        .content::-webkit-scrollbar-thumb {
          background: var(--bg-secondary);
          border-radius: 4px;
        }

        .content::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          padding-right: 10px;
        }

        .app-card {
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          position: relative;
          transition: transform 0.2s, border-color 0.2s;
        }

        .app-card:hover {
          transform: translateY(-2px);
          border-color: rgba(56, 189, 248, 0.3);
        }

        .app-icon {
          background: rgba(56, 189, 248, 0.1);
          padding: 12px;
          border-radius: 12px;
          flex-shrink: 0;
        }

        .app-info {
          flex: 1;
          overflow: hidden;
        }

        .app-info h3 {
          margin: 0 0 4px 0;
          font-size: 16px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .app-info p {
          margin: 0 0 8px 0;
          font-size: 12px;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .app-meta {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .version, .size {
          font-size: 11px;
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--text-secondary);
        }

        .size {
          background: rgba(56, 189, 248, 0.1);
          color: #38bdf8;
        }

        .uninstall-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .uninstall-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: var(--danger-color);
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};

export default AppList;
