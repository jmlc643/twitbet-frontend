import { useState, useEffect } from 'react';
import { Pencil, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/features/auth/api/auth.api';

const AVATARS = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
];

export const EditProfileModal = () => {
  const { user, token, updateUser } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUsername(user?.username || '');
      setAvatarUrl(user?.avatar_url || '');
      setError(null);
    }
  }, [isOpen, user]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!username.trim()) {
      setError('El nombre de usuario es obligatorio');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authApi.updateProfile({ username, avatar_url: avatarUrl }, token);
      updateUser({ username, avatar_url: avatarUrl });
      setIsOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <Pencil size={14} /> <span className="hidden sm:inline">Editar Perfil</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md dark:bg-neutral-900 dark:border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Editar Perfil</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">Nombre de Usuario</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tu nombre de usuario"
                className="bg-neutral-50 dark:bg-neutral-800"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Foto de Perfil</label>
              <div className="grid grid-cols-4 gap-3">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setAvatarUrl(avatar)}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                      avatarUrl === avatar
                        ? 'border-red-600 scale-105 shadow-lg ring-2 ring-red-600/20'
                        : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={avatar} alt="Avatar option" className="w-full h-full object-cover bg-neutral-100 dark:bg-neutral-800" />
                    {avatarUrl === avatar && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="bg-red-600 rounded-full p-1 text-white">
                           <Check size={16} />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between p-3 rounded-lg border dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  {avatarUrl === '' ? 'No hay foto seleccionada' : 'Foto de perfil seleccionada'}
                </span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setAvatarUrl('')}
                  disabled={avatarUrl === ''}
                  className={avatarUrl === '' ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  Quitar foto
                </Button>
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <div className="flex justify-end gap-3 pt-4 border-t dark:border-neutral-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
