import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, Calendar, Package } from 'lucide-react';

const Dashboard = () => {
  const [appCount, setAppCount] = useState('--');
  const [apps, setApps] = useState([]);
  const [recentlyInstalled, setRecentlyInstalled] = useState([]);

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
        } catch (error) {
          console.error('Error fetching app data:', error);
          setAppCount('Error');
        }
      }
    };
    fetchAppData();
  }, []);

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

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>System Status</h3>
          <p className="value">Good</p>
        </div>
        <div className="stat-card">
          <h3>Apps Installed</h3>
          <p className="value">{appCount}</p>
        </div>
        <div className="stat-card">
          <h3>Space Cleaned</h3>
          <p className="value">0 GB</p>
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
            <div className="placeholder-state">
              <p>⚡ Usage tracking coming soon</p>
              <span>Requires background monitoring</span>
            </div>
          </div>
        </div>

        {/* Frequently Used */}
        <div className="list-section">
          <div className="section-header">
            <TrendingUp size={20} />
            <h2>Frequently Used</h2>
          </div>
          <div className="app-list">
            <div className="placeholder-state">
              <p>📊 Frequency tracking coming soon</p>
              <span>Requires background monitoring</span>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .dashboard-container {
          padding: 40px;
          flex: 1;
          overflow-y: auto;
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
