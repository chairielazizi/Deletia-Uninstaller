import React from 'react';
import { X, Minus, Square } from 'lucide-react';

const Titlebar = () => {
  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.minimizeWindow();
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI) {
      window.electronAPI.maximizeWindow();
    }
  };

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.closeWindow();
    }
  };

  return (
    <div className="titlebar">
      <div className="titlebar-title">Deletia Uninstaller</div>
      <div className="window-controls">
        <button className="control-btn" onClick={handleMinimize} title="Minimize">
          <Minus size={14} />
        </button>
        <button className="control-btn" onClick={handleMaximize} title="Maximize">
          <Square size={14} />
        </button>
        <button className="control-btn close-btn" onClick={handleClose} title="Close">
          <X size={14} />
        </button>
      </div>

      <style>{`
        .titlebar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 32px;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          z-index: 1000;
          -webkit-app-region: drag;
        }

        .titlebar-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
          opacity: 0.8;
        }

        .window-controls {
          display: flex;
          -webkit-app-region: no-drag;
        }

        .control-btn {
          width: 46px;
          height: 32px;
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .control-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .control-btn.close-btn:hover {
          background: #e81123;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Titlebar;
