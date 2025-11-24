import React, { createContext, useContext, useState, useCallback } from "react";

const CacheContext = createContext();

export const useCache = () => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error("useCache must be used within CacheProvider");
  }
  return context;
};

export const CacheProvider = ({ children }) => {
  const [appsCache, setAppsCache] = useState(null);
  const [dashboardCache, setDashboardCache] = useState(null);
  const [systemStatusCache, setSystemStatusCache] = useState(null);
  const [cleanerCache, setCleanerCache] = useState(null);
  const [loadingApps, setLoadingApps] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [loadingCleaner, setLoadingCleaner] = useState(false);

  const fetchApps = useCallback(
    async (force = false) => {
      // Return cached data if available and not forcing refresh
      if (appsCache && !force) {
        return appsCache;
      }

      setLoadingApps(true);
      try {
        if (window.electronAPI) {
          const apps = await window.electronAPI.getApps();
          setAppsCache(apps);
          setLoadingApps(false);
          return apps;
        }
        setLoadingApps(false);
        return [];
      } catch (error) {
        console.error("Error fetching apps:", error);
        setLoadingApps(false);
        return [];
      }
    },
    [appsCache]
  );

  const fetchDashboardData = useCallback(
    async (force = false) => {
      // Return cached data if available and not forcing refresh
      if (dashboardCache && systemStatusCache && !force) {
        return { ...dashboardCache, systemStatus: systemStatusCache };
      }

      setLoadingDashboard(true);
      try {
        if (window.electronAPI) {
          const apps = await window.electronAPI.getApps();

          // Calculate system status (only once and cache it)
          const { getSystemStatus } = await import("../utils/systemUtils");
          const systemStatus = await getSystemStatus(apps.length);

          const data = {
            apps,
            timestamp: Date.now(),
            systemStatus,
          };

          setDashboardCache({ apps, timestamp: data.timestamp });
          setSystemStatusCache(systemStatus);
          setLoadingDashboard(false);
          return data;
        }
        setLoadingDashboard(false);
        return { apps: [], timestamp: Date.now(), systemStatus: null };
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoadingDashboard(false);
        return { apps: [], timestamp: Date.now(), systemStatus: null };
      }
    },
    [dashboardCache, systemStatusCache]
  );

  const fetchCleanerData = useCallback(
    async (force = false) => {
      // Return cached data if available and not forcing refresh
      if (cleanerCache && !force) {
        return cleanerCache;
      }

      setLoadingCleaner(true);
      try {
        if (window.electronAPI) {
          const data = await window.electronAPI.getCleanableFiles();
          const cacheData = {
            items: data,
            timestamp: Date.now(),
          };
          setCleanerCache(cacheData);
          setLoadingCleaner(false);
          return cacheData;
        }
        setLoadingCleaner(false);
        return { items: [], timestamp: Date.now() };
      } catch (error) {
        console.error("Error fetching cleaner data:", error);
        setLoadingCleaner(false);
        return { items: [], timestamp: Date.now() };
      }
    },
    [cleanerCache]
  );

  const clearCache = useCallback(() => {
    setAppsCache(null);
    setDashboardCache(null);
    setSystemStatusCache(null);
    setCleanerCache(null);
  }, []);

  return (
    <CacheContext.Provider
      value={{
        appsCache,
        dashboardCache,
        systemStatusCache,
        cleanerCache,
        loadingApps,
        loadingDashboard,
        loadingCleaner,
        fetchApps,
        fetchDashboardData,
        fetchCleanerData,
        clearCache,
      }}
    >
      {children}
    </CacheContext.Provider>
  );
};
