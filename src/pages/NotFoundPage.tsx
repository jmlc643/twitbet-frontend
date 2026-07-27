import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <Card className="w-full max-w-md bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-center shadow-xl">
        <CardContent className="pt-10 pb-8 px-6 space-y-5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600/10 text-red-600 border border-red-600/20 mb-2">
            <AlertCircle size={36} />
          </div>

          <div className="space-y-2">
            <h1 className="text-6xl font-black text-red-600 tracking-tight font-mono">
              404
            </h1>
            <h2 className="text-xl font-extrabold uppercase tracking-wide text-neutral-900 dark:text-neutral-100">
              Página fuera de juego
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
              La jugada o sección que intentas consultar no existe o fue movida a otra ubicación.
            </p>
          </div>

          <div className="pt-4">
            <Link to="/">
              <Button className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase text-xs px-6 py-5 gap-2 w-full sm:w-auto">
                <Home size={16} />
                Volver al Inicio
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};