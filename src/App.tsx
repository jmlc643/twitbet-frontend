import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useThemeStore } from '@/store/useThemeStore';
import { Navbar } from '@/components/layout/Navbar';
import { AppRouter } from '@/routes/AppRouter';

export default function App() {
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200 font-sans">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <AppRouter />
        </main>
      </div>
    </BrowserRouter>
  );
}