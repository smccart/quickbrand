import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface SiteColorContextValue {
  color: string;
  secondaryColor: string;
  setColor: (hex: string) => void;
  setSecondaryColor: (hex: string) => void;
}

const SiteColorContext = createContext<SiteColorContextValue>({
  color: '#6366f1',
  secondaryColor: '#f59e0b',
  setColor: () => {},
  setSecondaryColor: () => {},
});

const STORAGE_KEY = 'fetchkit-site-color';
const STORAGE_KEY_SECONDARY = 'fetchkit-site-color-secondary';

export function SiteColorProvider({ children }: { children: ReactNode }) {
  const [color, setColor] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || '#6366f1';
  });
  const [secondaryColor, setSecondaryColor] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_SECONDARY) || '#f59e0b';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, color);
    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--ring', color);
  }, [color]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SECONDARY, secondaryColor);
    document.documentElement.style.setProperty('--secondary-brand', secondaryColor);
  }, [secondaryColor]);

  return (
    <SiteColorContext.Provider value={{ color, secondaryColor, setColor, setSecondaryColor }}>
      {children}
    </SiteColorContext.Provider>
  );
}

export function useSiteColor() {
  return useContext(SiteColorContext);
}
