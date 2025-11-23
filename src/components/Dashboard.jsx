import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, Calendar, Package, ChevronDown, Info } from 'lucide-react';
import { getRecentlyUsed, getFrequentlyUsed } from '../utils/usageTracker';
import { getSpaceCleaned, getSystemStatus } from '../utils/systemUtils';

const Dashboard = () => {
  const [appCount, setAppCount] = useState('--');
  const [apps, setApps] = useState([]);
  const [recentlyInstalled, setRecentlyInstalled] = useState([]);
  const [recentlyUsed, setRecentlyUsed] = useState([]);
  const [frequentlyUsed, setFrequentlyUsed] = useState([]);
  const [spacePeriod, setSpacePeriod] = useState('all');
  const [spaceCleaned, setSpaceCleaned] = useState(0);
  const [systemStatus, setSystemStatus] = useState({ label: 'Good', color: '#10b981' });

  useEffect(() => {
    const fetchAppData = async () => {
      if (window.electronAPI) {
        try {
          const allApps = await window.electronAPI.getApps();
          setAppCount(allApps.length);
          setApps(allApps);

          // Get recently installed apps (sort by InstallDate)
          const withDates = allApps
            .filter(app => app.InstallDate)
            .map(app => ({
              ...app,
              parsedDate: parseInstallDate(app.InstallDate)
            }))
            .filter(app => app.parsedDate)
            .sort((a, b) => b.parsedDate - a.parsedDate)
            .slice(0, 5);
          
          setRecentlyInstalled(withDates);

          // Load usage tracking data (no auto-simulation)
          setRecentlyUsed(getRecentlyUsed(5));
          setFrequentlyUsed(getFrequentlyUsed(5));

          // Load cleaning history (no auto-simulation)
          setSpaceCleaned(getSpaceCleaned(spacePeriod));

          // Get real system status
          const status = await getSystemStatus(allApps.length);
          setSystemStatus(status);
        } catch (error) {
          console.error('Error fetching app data:', error);
          setAppCount('Error');
        }
      }
    };
    fetchAppData();
  }, []);

  // Update space cleaned when period changes
  useEffect(() => {
    setSpaceCleaned(getSpaceCleaned(spacePeriod));
  }, [spacePeriod]);

  const parseInstallDate = (dateStr) => {
    if (!dateStr || dateStr.length !== 8) return null;
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return new Date(`${year}-${month}-${day}`);
  };

  const formatDate = (date) => {
    if (!date) return '';
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const formatSize = (sizeInKB) => {
    if (sizeInKB === 0) return '0 GB';
    const sizeInMB = sizeInKB / 1024;
    if (sizeInMB < 1024) {
      return `${sizeInMB.toFixed(1)} MB`;
    }
    const sizeInGB = sizeInMB / 1024;
    return `${sizeInGB.toFixed(2)} GB`;
  };

  const getPeriodLabel = () => {
    const labels = {
      all: 'All Time',
      today: 'Today',
      week: 'This Week',
      month: 'This Month',
      quarter: 'Last 3 Months'
    };
    return labels[spacePeriod] || 'All Time';
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header-with-info">
            <h3>System Status</h3>
            <div className="info-icon-wrapper">
              <Info size={16} className="info-icon" />
              <div className="status-tooltip">
                <div className="tooltip-header">System Health Details</div>
                <div className="tooltip-item">
                  <div className="tooltip-label">
                    <span className={`status-dot status-${systemStatus.details?.diskSpace?.status || 'good'}`}></span>
                    Disk Space
                  </div>
                  <div className="tooltip-value">{systemStatus.details?.diskSpace?.percent || 0}% free</div>
                </div>
                <div className="tooltip-item">
                  <div className="tooltip-label">
                    <span className={`status-dot status-${systemStatus.details?.appCount?.status || 'good'}`}></span>
                    App Count
                  </div>
                  <div className="tooltip-value">{systemStatus.details?.appCount?.count || 0} apps</div>
                </div>
                <div className="tooltip-item">
                  <div className="tooltip-label">
                    <span className={`status-dot status-${systemStatus.details?.tempFiles?.status || 'good'}`}></span>
                    Temp Files
                  </div>
                  <div className="tooltip-value">{formatSize(systemStatus.details?.tempFiles?.size || 0)}</div>
                </div>
                <div className="tooltip-footer">
                  <div className="threshold-info">
                    <strong>Thresholds:</strong><br/>
                    Disk: Good (&gt;20%), Warning (10-20%), Critical (&lt;10%)<br/>
                    Apps: Good (&lt;500), Warning (500-800), Critical (&gt;800)<br/>
                    Temp: Good (&lt;5GB), Warning (5-10GB), Critical (&gt;10GB)
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="value" style={{ color: systemStatus.color }}>{systemStatus.label}</p>
        </div>
        <div className="stat-card">
          <h3>Apps Installed</h3>
          <p className="value">{appCount}</p>
        </div>
        <div className="stat-card">
          <div className="stat-header-with-dropdown">
            <h3>Space Cleaned</h3>
            <div className="period-dropdown">
              <button className="period-btn" onClick={() => {
                const periods = ['all', 'today', 'week', 'month', 'quarter'];
                const currentIndex = periods.indexOf(spacePeriod);
                const nextIndex = (currentIndex + 1) % periods.length;
                setSpacePeriod(periods[nextIndex]);
              }}>
                {getPeriodLabel()} <ChevronDown size={14} />
              </button>
            </div>
          </div>
          <p className="value">{formatSize(spaceCleaned)}</p>
        </div>
      </div>

      {/* App Lists */}
      <div className="lists-container">
        {/* Recently Installed */}
        <div className="list-section">
          <div className="section-header">
            <Calendar size={20} />
            <h2>Recently Installed</h2>
          </div>
          <div className="app-list">
            {recentlyInstalled.length > 0 ? (
              recentlyInstalled.map((app, index) => (
                <div key={index} className="app-item">
                  <div className="app-icon-small">
                    <Package size={16} color="#38bdf8" />
                  </div>
                  <div className="app-details">
                    <div className="app-name">{app.DisplayName}</div>
                    <div className="app-meta-text">{formatDate(app.parsedDate)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">No install dates available</div>
            )}
          </div>
        </div>

        {/* Recently Used */}
        <div className="list-section">
          <div className="section-header">
            <Clock size={20} />
            <h2>Recently Used</h2>
          </div>
          <div className="app-list">
            {recentlyUsed.length > 0 ? (
              recentlyUsed.map((app, index) => (
                <div key={index} className="app-item">
                  <div className="app-icon-small">
                    <Package size={16} color="#38bdf8" />
                  </div>
                  <div className="app-details">
                    <div className="app-name">{app.name}</div>
                    <div className="app-meta-text">{formatDate(app.lastUsed)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="placeholder-state">
                <p>⚡ No usage data yet</p>
                <span>Launch apps to track usage</span>
              </div>
            )}
          </div>
        </div>

        {/* Frequently Used */}
        <div className="list-section">
          <div className="section-header">
            <TrendingUp size={20} />
            <h2>Frequently Used</h2>
          </div>
          <div className="app-list">
            {frequentlyUsed.length > 0 ? (
              frequentlyUsed.map((app, index) => (
                <div key={index} className="app-item">
                  <div className="app-icon-small">
                    <Package size={16} color="#38bdf8" />
                  </div>
                  <div className="app-details">
                    <div className="app-name">{app.name}</div>
                    <div className="app-meta-text">{app.count} launches</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="placeholder-state">
                <p>📊 No usage data yet</p>
                <span>Launch apps to track frequency</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        .dashboard-container {
          padding: 40px;
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          height: 100%;
        }

        .dashboard-container::-webkit-scrollbar {
          width: 8px;
        }

        .dashboard-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .dashboard-container::-webkit-scrollbar-thumb {
          background: var(--bg-secondary);
          border-radius: 4px;
        }

        .dashboard-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 30px;
          margin-bottom: 40px;
        }
        
        .stat-card {
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 24px;
        }
        
        .stat-card h3 {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 500;
        }
        
        .stat-card .value {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-header-with-dropdown {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .period-dropdown {
          position: relative;
        }

        .period-btn {
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.2);
          color: var(--accent-color);
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
        }

        .period-btn:hover {
          background: rgba(56, 189, 248, 0.15);
          border-color: rgba(56, 189, 248, 0.3);
        }

        .stat-header-with-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .info-icon-wrapper {
          position: relative;
          display: inline-block;
        }

        .info-icon {
          color: var(--text-secondary);
          cursor: help;
          transition: color 0.2s;
        }

        .info-icon:hover {
          color: var(--accent-color);
        }

        .status-tooltip {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 16px;
          min-width: 280px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s ease;
          z-index: 1000;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }

        .info-icon-wrapper:hover .status-tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .tooltip-header {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--glass-border);
        }

        .tooltip-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          font-size: 12px;
        }

        .tooltip-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
        }

        .tooltip-value {
          color: var(--text-primary);
          font-weight: 500;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }

        .status-dot.status-good {
          background: #10b981;
        }

        .status-dot.status-warning {
          background: #f59e0b;
        }

        .status-dot.status-critical {
          background: #ef4444;
        }

        .tooltip-footer {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--glass-border);
        }

        .threshold-info {
          font-size: 10px;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .threshold-info strong {
          color: var(--text-primary);
          font-size: 11px;
        }

        .lists-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .list-section {
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 24px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          color: var(--accent-color);
        }

        .section-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .app-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .app-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          transition: background 0.2s;
        }

        .app-item:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .app-icon-small {
          background: rgba(56, 189, 248, 0.1);
          padding: 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .app-details {
          flex: 1;
          min-width: 0;
        }

        .app-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .app-meta-text {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-secondary);
          font-size: 14px;
        }

        .placeholder-state {
          text-align: center;
          padding: 40px 20px;
          background: rgba(56, 189, 248, 0.05);
          border-radius: 8px;
          border: 1px dashed rgba(56, 189, 248, 0.2);
        }

        .placeholder-state p {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: var(--text-primary);
        }

        .placeholder-state span {
          font-size: 12px;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
