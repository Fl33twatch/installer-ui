import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Config = {
  useMocks: boolean;
  apiBase: string;
};

type ConfigContextType = {
  config: Config;
  setUseMocks: (v: boolean) => void;
  setApiBase: (v: string) => void;
  resetDefaults: () => void;
};

const DEFAULTS: Config = {
  useMocks: (import.meta as any).env?.VITE_USE_MOCKS === "true" || false,
  apiBase: (import.meta as any).env?.VITE_API_BASE || "",
};

const KEY = "installer_ui_config_v1";

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Config>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch {}
    return DEFAULTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(config));
    } catch {}
  }, [config]);

  const value = useMemo<ConfigContextType>(() => ({
    config,
    setUseMocks: (v: boolean) => setConfig((c) => ({ ...c, useMocks: v })),
    setApiBase: (v: string) => setConfig((c) => ({ ...c, apiBase: v.trim() })),
    resetDefaults: () => setConfig(DEFAULTS),
  }), [config]);

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used inside ConfigProvider");
  return ctx;
}
