import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [appCount, setAppCount] = useState('--');

  useEffect(() => {
    const fetchAppCount = async () => {
      if (window.electronAPI) {
        try {
          const apps = await window.electronAPI.getApps();
          setAppCount(apps.length);
        } catch (error) {
          console.error('Error fetching app count:', error);
          setAppCount('Error');
        }
      }
    };
    fetchAppCount();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
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
      
      <style>{`
        .dashboard-container {
          padding: 40px;
          flex: 1;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 30px;
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
      `}</style>
    </div>
  );
};

export default Dashboard;
