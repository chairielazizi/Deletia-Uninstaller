import React, { useState } from 'react';
import { Trash2, HardDrive, FolderOpen, RefreshCw, CheckCircle2 } from 'lucide-react';

const Cleaner = () => {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [cleanItems, setCleanItems] = useState([
    { id: 'temp', name: 'Temporary Files', path: '%TEMP%', size: 0, checked: true, icon: FolderOpen },
    { id: 'wintemp', name: 'Windows Temp', path: 'C:\\Windows\\Temp', size: 0, checked: true, icon: FolderOpen },
    { id: 'prefetch', name: 'Prefetch Files', path: 'C:\\Windows\\Prefetch', size: 0, checked: false, icon: FolderOpen },
    { id: 'recyclebin', name: 'Recycle Bin', path: 'System', size: 0, checked: true, icon: Trash2 },
    { id: 'downloads', name: 'Downloads Folder', path: '%USERPROFILE%\\Downloads', size: 0, checked: false, icon: FolderOpen },
  ]);

  const handleScan = async () => {
    setScanning(true);
    
    // Simulate scanning (in real app, this would call backend APIs)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock data - in real app this would come from actual file system scanning
    const mockSizes = {
      temp: 1250000,      // ~1.19 GB
      wintemp: 850000,    // ~831 MB
      prefetch: 45000,    // ~44 MB
      recyclebin: 320000, // ~312 MB
      downloads: 0,       // 0 MB
    };

    setCleanItems(items => items.map(item => ({
      ...item,
      size: mockSizes[item.id] || 0
    })));
    
    setScanning(false);
    setScanned(true);
  };

  const handleClean = async () => {
    setCleaning(true);
    
    // Simulate cleaning
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reset sizes for checked items
    setCleanItems(items => items.map(item => ({
      ...item,
      size: item.checked ? 0 : item.size
    })));
    
    setCleaning(false);
  };

  const toggleItem = (id) => {
    setCleanItems(items => items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const formatSize = (sizeInKB) => {
    if (sizeInKB === 0) return '0 MB';
    const sizeInMB = sizeInKB / 1024;
    if (sizeInMB < 1024) {
      return `${sizeInMB.toFixed(0)} MB`;
    }
    const sizeInGB = sizeInMB / 1024;
    return `${sizeInGB.toFixed(2)} GB`;
  };

  const totalSize = cleanItems
    .filter(item => item.checked)
    .reduce((sum, item) => sum + item.size, 0);

  return (
    <div className="cleaner-container">
      <div className="cleaner-header">
        <h1>System Cleaner</h1>
        <p>Free up disk space by removing unnecessary files</p>
      </div>

      <div className="cleaner-stats">
        <div className="stat">
          <HardDrive size={24} color="#38bdf8" />
          <div>
            <div className="stat-label">Selected Items</div>
            <div className="stat-value">{formatSize(totalSize)}</div>
          </div>
        </div>
        <div className="action-buttons">
          <button 
            className="btn btn-secondary" 
            onClick={handleScan}
            disabled={scanning || cleaning}
          >
            {scanning ? (
              <>
                <RefreshCw size={18} className="spin" />
                Scanning...
              </>
            ) : (
              <>
                <RefreshCw size={18} />
                {scanned ? 'Rescan' : 'Start Scan'}
              </>
            )}
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleClean}
            disabled={!scanned || totalSize === 0 || cleaning}
          >
            {cleaning ? (
              <>
                <Trash2 size={18} />
                Cleaning...
              </>
            ) : (
              <>
                <Trash2 size={18} />
                Clean Now
              </>
            )}
          </button>
        </div>
      </div>

      <div className="clean-items-list">
        {cleanItems.map(item => (
          <div key={item.id} className="clean-item">
            <label className="item-checkbox">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleItem(item.id)}
                disabled={!scanned}
              />
              <span className="checkmark"></span>
            </label>
            <div className="item-icon">
              <item.icon size={20} color="#38bdf8" />
            </div>
            <div className="item-details">
              <div className="item-name">{item.name}</div>
              <div className="item-path">{item.path}</div>
            </div>
            <div className="item-size">
              {scanned ? formatSize(item.size) : '--'}
            </div>
          </div>
        ))}
      </div>

      {!scanned && (
        <div className="info-box">
          <CheckCircle2 size={20} />
          <p>Click "Start Scan" to analyze your system for cleanable files</p>
        </div>
      )}

      <style>{`
        .cleaner-container {
          padding: 40px;
          max-width: 1200px;
          margin: 0 auto;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .cleaner-container::-webkit-scrollbar {
          width: 8px;
        }

        .cleaner-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .cleaner-container::-webkit-scrollbar-thumb {
          background: var(--bg-secondary);
          border-radius: 4px;
        }

        .cleaner-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .cleaner-header {
          margin-bottom: 30px;
        }

        .cleaner-header h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 8px 0;
        }

        .cleaner-header p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 14px;
        }

        .cleaner-stats {
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-label {
          font-size: 12px;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--accent-color);
        }

        .action-buttons {
          display: flex;
          gap: 12px;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 10px;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
          border: 1px solid var(--glass-border);
        }

        .btn-secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
        }

        .btn-primary {
          background: var(--accent-color);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0ea5e9;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .clean-items-list {
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .clean-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          margin-bottom: 8px;
          transition: background 0.2s;
        }

        .clean-item:last-child {
          margin-bottom: 0;
        }

        .clean-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .item-checkbox {
          position: relative;
          cursor: pointer;
          user-select: none;
        }

        .item-checkbox input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }

        .checkmark {
          display: block;
          width: 20px;
          height: 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid var(--glass-border);
          border-radius: 4px;
          transition: all 0.2s;
        }

        .item-checkbox input:checked ~ .checkmark {
          background: var(--accent-color);
          border-color: var(--accent-color);
        }

        .item-checkbox input:checked ~ .checkmark::after {
          content: '';
          position: absolute;
          left: 6px;
          top: 2px;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .item-checkbox input:disabled ~ .checkmark {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .item-icon {
          background: rgba(56, 189, 248, 0.1);
          padding: 10px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-details {
          flex: 1;
        }

        .item-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .item-path {
          font-size: 12px;
          color: var(--text-secondary);
          font-family: 'Consolas', 'Monaco', monospace;
        }

        .item-size {
          font-size: 16px;
          font-weight: 600;
          color: var(--accent-color);
          min-width: 80px;
          text-align: right;
        }

        .info-box {
          background: rgba(56, 189, 248, 0.05);
          border: 1px dashed rgba(56, 189, 248, 0.2);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-secondary);
        }

        .info-box svg {
          color: var(--accent-color);
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};

export default Cleaner;
