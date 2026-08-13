import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Navbar } from '@/components/layout/Navbar';
import { AppRouter } from '@/routes/AppRouter';

import { Toaster } from 'sonner';

const queryClient = new QueryClient();

export default function App() {
  const initTheme = useThemeStore((state) => state.initTheme);
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initTheme();
    initAuth();
  }, [initTheme, initAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200 font-sans">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <AppRouter />
          </main>
          <Toaster richColors position="top-right" />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}