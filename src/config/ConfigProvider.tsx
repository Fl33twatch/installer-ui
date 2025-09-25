// src/config/ConfigProvider.tsx
import React, { createContext, useContext, useState } from "react";

export type AppConfig = {
  apiBaseUrl?: string;
  theme?: "light" | "dark";
  // add other app-wide settings here
  [key: string]: any;
};

type ConfigContextValue = {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
};

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

type Props = { children: React.ReactNode };

export const ConfigProvider: React.FC<Props> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>({
    theme: "light",
    apiBaseUrl: "", // set your default API base here if you like
  });

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = (): ConfigContextValue => {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used within ConfigProvider");
  return ctx;
};
