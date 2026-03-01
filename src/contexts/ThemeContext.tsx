import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface ThemeInfo {
  id: string;
  name: string;
  description: string;
  themeColor: string; // PWA status-bar color
  preview: { bg: string; card: string; accent: string };
}

export const THEMES: ThemeInfo[] = [
  {
    id: 'neo',
    name: 'Neomorphism',
    description: 'Soft 3-D embossed surfaces',
    themeColor: '#155685',
    preview: { bg: '#e0e5ec', card: '#e0e5ec', accent: '#155685' },
  },
  {
    id: 'glass',
    name: 'Glassmorphism',
    description: 'Frosted glass & blur effects',
    themeColor: '#6366f1',
    preview: { bg: '#1e1b4b', card: 'rgba(255,255,255,0.15)', accent: '#6366f1' },
  },
  {
    id: 'edtech',
    name: 'EdTech',
    description: 'Clean white & indigo',
    themeColor: '#4f46e5',
    preview: { bg: '#f8fafc', card: '#f1f5f9', accent: '#4f46e5' },
  },
  {
    id: 'minimal',
    name: 'Minimalist',
    description: 'Flat, no shadows, thin borders',
    themeColor: '#111827',
    preview: { bg: '#fafafa', card: '#ffffff', accent: '#111827' },
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Dark backgrounds, light text',
    themeColor: '#1a1a2e',
    preview: { bg: '#0f0f1a', card: '#1a1a2e', accent: '#60a5fa' },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm cream & orange tones',
    themeColor: '#c2410c',
    preview: { bg: '#fdf8f0', card: '#f5e6d0', accent: '#c2410c' },
  },
];

interface ThemeContextValue {
  theme: string;
  setTheme: (id: string) => void;
  themes: ThemeInfo[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'indira-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'neo';
  });

  const applyTheme = (id: string) => {
    const html = document.documentElement;
    if (id === 'neo') {
      html.removeAttribute('data-theme');
    } else {
      html.setAttribute('data-theme', id);
    }

    const info = THEMES.find((t) => t.id === id);
    if (info) {
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', info.themeColor);
    }
  };

  const setTheme = (id: string) => {
    localStorage.setItem(STORAGE_KEY, id);
    setThemeState(id);
    applyTheme(id);
  };

  // Apply on mount (covers React hydration after the inline script)
  useEffect(() => {
    applyTheme(theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
