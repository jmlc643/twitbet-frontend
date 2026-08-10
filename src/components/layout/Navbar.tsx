import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/shared/UserAvatar';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <header className="w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-6">
        <Link to="/" className="flex items-center gap-3">
          <img 
            src={isDarkMode ? '/logo/twitbet-dark-logo.webp' : '/logo/twitbet-light-logo.webp'} 
            alt="TwitBet Logo" 
            className="h-14 w-auto" 
          />
        </Link>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-lg border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-yellow-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-xs font-semibold">
                  <UserAvatar avatarUrl={user?.avatar_url} username={user?.username} className="w-5 h-5 rounded-full text-[10px]" />
                  <span>{user?.username}</span>
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase"
              >
                Cerrar Sesión
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};