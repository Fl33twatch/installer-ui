import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Config = {
  apiBaseUrl: string;
  organisation: string;
};

type ConfigContextType = {
  config: Config;
  setConfig: (c: Partial<Config>) => void;
};

const defaultConfig: Config = {
  apiBaseUrl: "",
  organisation: "",
};

const KEY = "installer_config_v1";

const ConfigContext = createContext<ConfigContextType>({
  config: defaultConfig,
  setConfig: () => {},
});

export const ConfigProvider: React.FC = ({ children }) => {
  const [config, setConfigState] = useState<Config>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? { ...defaultConfig, ...JSON.parse(raw) } : defaultConfig;
    } catch {
      return defaultConfig;
    }
  });

  const setConfig = (next: Partial<Config>) =>
    setConfigState((prev) => ({ ...prev, ...next }));

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(config));
  }, [config]);

  const value = useMemo(() => ({ config, setConfig }), [config]);

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};

export const useConfig = () => useContext(ConfigContext);
