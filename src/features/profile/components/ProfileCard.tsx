import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent } from '@/components/ui/card';

export const ProfileCard = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <Card className="w-full h-full flex flex-col justify-center max-w-2xl mx-auto border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xl transition-colors duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col xl:flex-row items-center gap-6">
          <div className="relative shrink-0">
            <img
              src={user?.avatar_url || '/avatars/avatar1.png'}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-red-600 object-cover bg-neutral-800"
            />
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white dark:border-neutral-900 bg-green-500" />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white">
              {user?.username}
            </h2>
            <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
              {user?.email}
            </p>
            <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
              <span className="text-[11px] bg-red-600/10 text-red-600 dark:text-red-500 border border-red-600/30 px-2.5 py-0.5 rounded-full font-semibold">
                Apostador Frecuente
              </span>
              <span className="text-[11px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 px-2.5 py-0.5 rounded-full font-mono">
                ID: {user?.id ? `${user.id.slice(0, 8)}...` : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <div className="text-center">
            <span className="block text-xs uppercase font-bold text-neutral-500 dark:text-neutral-400">Ligas</span>
            <span className="text-xl font-black text-red-600">3</span>
          </div>
          <div className="text-center">
            <span className="block text-xs uppercase font-bold text-neutral-500 dark:text-neutral-400">Ganadas</span>
            <span className="text-xl font-black text-green-600 dark:text-green-500">12</span>
          </div>
          <div className="text-center">
            <span className="block text-xs uppercase font-bold text-neutral-500 dark:text-neutral-400">Efectividad</span>
            <span className="text-xl font-black text-amber-500">68%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};