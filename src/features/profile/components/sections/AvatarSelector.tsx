import { Check, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { RefObject } from 'react';

interface AvatarSelectorProps {
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  avatarFile: File | null;
  setAvatarFile: (file: File | null) => void;
  userAvatarUrl?: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  avatars: string[];
}

export const AvatarSelector = ({
  avatarUrl,
  setAvatarUrl,
  avatarFile,
  setAvatarFile,
  userAvatarUrl,
  fileInputRef,
  avatars,
}: AvatarSelectorProps) => {
  return (
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
        {(avatarFile || (userAvatarUrl && !avatars.includes(userAvatarUrl))) && (
          <button
            type="button"
            onClick={() => {
              if (!avatarFile && userAvatarUrl) {
                setAvatarUrl(userAvatarUrl);
              }
            }}
            className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
              (avatarFile) || (avatarUrl === userAvatarUrl && !avatarFile)
                ? 'border-red-600 scale-105 shadow-lg ring-2 ring-red-600/20'
                : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 opacity-70 hover:opacity-100'
            }`}
          >
            <img 
              src={avatarFile ? avatarUrl : (userAvatarUrl || '')} 
              alt="Avatar personalizado" 
              className="w-full h-full object-cover bg-neutral-100 dark:bg-neutral-800" 
            />
            {((avatarFile) || (avatarUrl === userAvatarUrl && !avatarFile)) && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="bg-red-600 rounded-full p-1 text-white">
                    <Check size={16} />
                </div>
              </div>
            )}
          </button>
        )}
        {avatars.map((avatar) => (
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
  );
};
