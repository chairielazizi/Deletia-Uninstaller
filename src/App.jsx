import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Titlebar from './components/Titlebar';
import Dashboard from './components/Dashboard';
import AppList from './components/AppList';

function App() {
  const [activeView, setActiveView] = useState('apps')

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'apps':
        return <AppList />;
      case 'cleaner':
        return <div className="placeholder">Cleaner Module Coming Soon</div>;
      case 'settings':
        return <div className="placeholder">Settings Module Coming Soon</div>;
      default:
        return <AppList />;
    }
  };

  return (
    <div className="app">
      <Titlebar />
      <div className="app-container">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <div className="content-area">{renderContent()}</div>
      </div>

      <style>{`
        .content-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .placeholder {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          color: var(--text-secondary);
          font-size: 24px;
        }
      `}</style>
    </div>
  )
}

export default App
