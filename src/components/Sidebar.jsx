import React from "react";
import { LayoutDashboard, List, Trash2, Settings } from "lucide-react";

const Sidebar = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "apps", icon: List, label: "Applications" },
    { id: "cleaner", icon: Trash2, label: "Cleaner" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="sidebarLogoGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
          <rect
            x="4"
            y="4"
            width="8"
            height="24"
            fill="url(#sidebarLogoGradient)"
          />
          <rect
            x="12"
            y="4"
            width="8"
            height="8"
            fill="url(#sidebarLogoGradient)"
          />
          <rect
            x="12"
            y="20"
            width="8"
            height="8"
            fill="url(#sidebarLogoGradient)"
          />
          <rect
            x="20"
            y="8"
            width="8"
            height="4"
            fill="url(#sidebarLogoGradient)"
          />
          <rect
            x="20"
            y="20"
            width="8"
            height="4"
            fill="url(#sidebarLogoGradient)"
          />
        </svg>
        <h2>Deletia</h2>
      </div>
      <nav>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeView === item.id ? "active" : ""}`}
            onClick={() => setActiveView(item.id)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <style>{`
        .sidebar {
          width: 250px;
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          border-right: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          padding: 20px;
          height: 100%;
        }
        
        .sidebar-header {
          margin-bottom: 40px;
          padding-left: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .sidebar-header:hover {
          opacity: 0.8;
        }
        
        .sidebar-header h2 {
          margin: 0;
          background: linear-gradient(45deg, var(--accent-color), #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 24px;
          font-weight: 800;
        }
        
        nav {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.3s ease;
          font-size: 14px;
          font-weight: 500;
          text-align: left;
        }
        
        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }
        
        .nav-item.active {
          background: rgba(56, 189, 248, 0.1);
          color: var(--accent-color);
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
