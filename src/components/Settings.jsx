import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Moon, Bell, Shield, Info, Zap } from 'lucide-react';
import { getSettings, saveSetting } from '../utils/settingsManager';
import toast, { Toaster } from 'react-hot-toast';
import { toastConfig } from '../utils/toastConfig';

const Settings = () => {
  const [settings, setSettings] = useState({
    autoStart: false,
    notifications: true,
    clearCacheOnExit: false,
    confirmUninstall: true,
    darkMode: true,
    minimizeToTray: true,
  });

  useEffect(() => {
    // Load settings from localStorage
    const loadedSettings = getSettings();
    setSettings(loadedSettings);
  }, []);

  const toggleSetting = async (key) => {
    const newValue = !settings[key];
    const updatedSettings = await saveSetting(key, newValue);
    setSettings(updatedSettings);
    
    // Show toast notification
    toast.success(`Setting updated successfully!`, {
      ...toastConfig,
      duration: 2000,
    });

    // Apply setting immediately if needed
    if (key === 'autoStart') {
      await handleAutoStart(newValue);
    }
  };

  const handleAutoStart = async (enabled) => {
    if (window.electronAPI?.setAutoStart) {
      try {
        const result = await window.electronAPI.setAutoStart(enabled);
        if (result && result.success) {
          console.log(`Auto-start ${enabled ? 'enabled' : 'disabled'}`);
        } else if (result && result.error) {
          console.error('Failed to set auto-start:', result.error);
          // Only show error if it's not a development mode issue
          if (!result.error.includes('not packaged')) {
            toast.error('Failed to update auto-start setting');
          } else {
            console.log('Auto-start only works in packaged app');
          }
        }
      } catch (error) {
        console.error('Error setting auto-start:', error);
      }
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Customize your Lumina experience</p>
      </div>

      <div className="settings-sections">
        {/* General Settings */}
        <div className="settings-section">
          <div className="section-header">
            <SettingsIcon size={20} />
            <h2>General</h2>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <Zap size={18} color="#38bdf8" />
              <div>
                <div className="setting-name">Launch on startup</div>
                <div className="setting-description">Start Lumina when Windows boots</div>
              </div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.autoStart}
                onChange={() => toggleSetting('autoStart')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <Bell size={18} color="#38bdf8" />
              <div>
                <div className="setting-name">Enable notifications</div>
                <div className="setting-description">Show system notifications for important events</div>
              </div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={() => toggleSetting('notifications')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <Moon size={18} color="#38bdf8" />
              <div>
                <div className="setting-name">Minimize to system tray</div>
                <div className="setting-description">Keep app running in background when closed</div>
              </div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.minimizeToTray}
                onChange={() => toggleSetting('minimizeToTray')}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="settings-section">
          <div className="section-header">
            <Shield size={20} />
            <h2>Privacy & Security</h2>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <Shield size={18} color="#38bdf8" />
              <div>
                <div className="setting-name">Confirm before uninstall</div>
                <div className="setting-description">Show confirmation dialog before uninstalling apps</div>
              </div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.confirmUninstall}
                onChange={() => toggleSetting('confirmUninstall')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <Zap size={18} color="#38bdf8" />
              <div>
                <div className="setting-name">Clear cache on exit</div>
                <div className="setting-description">Automatically clean temporary files when closing</div>
              </div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.clearCacheOnExit}
                onChange={() => toggleSetting('clearCacheOnExit')}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* About */}
        <div className="settings-section">
          <div className="section-header">
            <Info size={20} />
            <h2>About</h2>
          </div>

          <div className="about-content">
            <div className="about-logo">
              <h2>Lumina</h2>
            </div>
            <div className="about-info">
              <div className="info-row">
                <span className="label">Version</span>
                <span className="value">1.0.0</span>
              </div>
              <div className="info-row">
                <span className="label">Build</span>
                <span className="value">2024.11.23</span>
              </div>
              <div className="info-row">
                <span className="label">Platform</span>
                <span className="value">Windows 11</span>
              </div>
            </div>
            <p className="about-description">
              Lumina is a modern, beautiful application uninstaller and system cleaner for Windows.
              Designed to help you keep your system clean and organized.
            </p>
          </div>
        </div>
      </div>

      <Toaster 
        toastOptions={{
          style: {
            background: 'rgba(16, 185, 129, 0.9)',
            color: '#fff',
          },
        }}
      />
      
      <style>{`
        .settings-container {
          padding: 40px;
          max-width: 900px;
          margin: 0 auto;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .settings-container::-webkit-scrollbar {
          width: 8px;
        }

        .settings-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .settings-container::-webkit-scrollbar-thumb {
          background: var(--bg-secondary);
          border-radius: 4px;
        }

        .settings-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .settings-header {
          margin-bottom: 30px;
        }

        .settings-header h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 8px 0;
        }

        .settings-header p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 14px;
        }

        .settings-sections {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .settings-section {
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

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          margin-bottom: 12px;
          transition: background 0.2s;
        }

        .setting-item:last-child {
          margin-bottom: 0;
        }

        .setting-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .setting-info {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .setting-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .setting-description {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .toggle {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
          flex-shrink: 0;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.1);
          transition: 0.3s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: var(--accent-color);
        }

        input:checked + .slider:before {
          transform: translateX(24px);
        }

        .about-content {
          padding: 16px;
        }

        .about-logo {
          text-align: center;
          margin-bottom: 24px;
        }

        .about-logo h2 {
          margin: 0;
          background: linear-gradient(45deg, var(--accent-color), #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 32px;
          font-weight: 800;
        }

        .about-info {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid var(--glass-border);
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-row .label {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .info-row .value {
          font-size: 14px;
          color: var(--text-primary);
          font-weight: 500;
        }

        .about-description {
          margin: 0;
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Settings;
