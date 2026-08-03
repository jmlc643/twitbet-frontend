import { useState, useEffect, useRef } from 'react';
import { isAxiosError } from 'axios';
import { Pencil, Check, Upload } from 'lucide-react';
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

            <div>
              <label className="text-sm font-semibold mb-2 block flex items-center justify-between">
                <span>Foto de Perfil</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setAvatarFile(file);
                      setAvatarUrl(URL.createObjectURL(file));
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 text-xs gap-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                >
                  <Upload size={14} /> Subir desde PC
                </Button>
              </label>
              <div className="grid grid-cols-4 gap-3 mt-2">
                {/* Si hay un archivo subido o si ya tiene una foto personalizada (que no está en AVATARS), la mostramos */}
                {(avatarFile || (user?.avatar_url && !AVATARS.includes(user.avatar_url))) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!avatarFile && user?.avatar_url) {
                        setAvatarUrl(user.avatar_url);
                      }
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                      (avatarFile) || (avatarUrl === user?.avatar_url && !avatarFile)
                        ? 'border-red-600 scale-105 shadow-lg ring-2 ring-red-600/20'
                        : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={avatarFile ? avatarUrl : (user?.avatar_url || '')} 
                      alt="Avatar personalizado" 
                      className="w-full h-full object-cover bg-neutral-100 dark:bg-neutral-800" 
                    />
                    {((avatarFile) || (avatarUrl === user?.avatar_url && !avatarFile)) && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="bg-red-600 rounded-full p-1 text-white">
                           <Check size={16} />
                        </div>
                      </div>
                    )}
                  </button>
                )}
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => {
                      setAvatarFile(null);
                      setAvatarUrl(avatar);
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                      avatarUrl === avatar && !avatarFile
                        ? 'border-red-600 scale-105 shadow-lg ring-2 ring-red-600/20'
                        : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={avatar} alt="Avatar option" className="w-full h-full object-cover bg-neutral-100 dark:bg-neutral-800" />
                    {avatarUrl === avatar && !avatarFile && (
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
                  onClick={() => {
                    setAvatarFile(null);
                    setAvatarUrl('');
                  }}
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
