import { create } from 'zustand';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: false,

  toggleTheme: () =>
    set((state) => {
      const nextMode = !state.isDarkMode;
      if (nextMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { isDarkMode: nextMode };
    }),

  initTheme: () => {
    document.documentElement.classList.remove('dark');
  },
}));