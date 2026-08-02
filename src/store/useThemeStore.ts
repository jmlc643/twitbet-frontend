import { create } from 'zustand';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  };

  return {
    isDarkMode: getInitialTheme(),

    toggleTheme: () =>
      set((state) => {
        const nextMode = !state.isDarkMode;
        if (nextMode) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
        return { isDarkMode: nextMode };
      }),

    initTheme: () => {
      const isDark = getInitialTheme();
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
  };
});