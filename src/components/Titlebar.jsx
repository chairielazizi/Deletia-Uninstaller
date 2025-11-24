import React from "react";
import { X, Minus, Square } from "lucide-react";

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
      <div className="titlebar-title">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{ marginRight: "8px", pointerEvents: "none" }}
        >
          <defs>
            <linearGradient
              id="logoGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="4" height="12" fill="url(#logoGradient)" />
          <rect x="6" y="2" width="4" height="4" fill="url(#logoGradient)" />
          <rect x="6" y="10" width="4" height="4" fill="url(#logoGradient)" />
          <rect x="10" y="4" width="4" height="2" fill="url(#logoGradient)" />
          <rect x="10" y="10" width="4" height="2" fill="url(#logoGradient)" />
        </svg>
        Deletia Uninstaller
      </div>
      <div className="window-controls">
        <button
          className="control-btn"
          onClick={handleMinimize}
          title="Minimize"
        >
          <Minus size={14} />
        </button>
        <button
          className="control-btn"
          onClick={handleMaximize}
          title="Maximize"
        >
          <Square size={14} />
        </button>
        <button
          className="control-btn close-btn"
          onClick={handleClose}
          title="Close"
        >
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
          display: flex;
          align-items: center;
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
