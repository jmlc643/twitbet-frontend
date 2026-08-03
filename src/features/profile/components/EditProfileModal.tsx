import { useState, useEffect, useRef } from 'react';
import { isAxiosError } from 'axios';
import { Pencil } from 'lucide-react';
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
import { AvatarSelector } from './sections/AvatarSelector';

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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setUsername(user?.username || '');
        setAvatarUrl(user?.avatar_url || '');
        setAvatarFile(null);
        setError(null);
      }, 0);
    }
  }, [isOpen, user]);

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
      let finalAvatarUrl = avatarUrl;
      
      if (avatarFile) {
        const uploadResult = await authApi.uploadAvatar(avatarFile, token);
        finalAvatarUrl = uploadResult.avatar_url;
      }

      await authApi.updateProfile({ username, avatar_url: finalAvatarUrl }, token);
      updateUser({ username, avatar_url: finalAvatarUrl });
      setIsOpen(false);
    } catch (err: unknown) {
      if (isAxiosError<{ message?: string }>(err)) {
        setError(err.response?.data?.message || 'Error al actualizar el perfil');
      } else {
        setError('Error al actualizar el perfil');
      }
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

            <AvatarSelector 
              avatarUrl={avatarUrl}
              setAvatarUrl={setAvatarUrl}
              avatarFile={avatarFile}
              setAvatarFile={setAvatarFile}
              userAvatarUrl={user?.avatar_url}
              fileInputRef={fileInputRef}
              avatars={AVATARS}
            />
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
