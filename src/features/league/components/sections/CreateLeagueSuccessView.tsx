import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface CreateLeagueSuccessViewProps {
  inviteCode: string;
  slug: string;
  copied: boolean;
  onCopy: () => void;
}

export const CreateLeagueSuccessView = ({ inviteCode, slug, copied, onCopy }: CreateLeagueSuccessViewProps) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-neutral-200/50 dark:border-neutral-800/50 text-neutral-900 dark:text-white shadow-2xl">
      <CardHeader className="text-center pb-2">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <CardTitle className="text-2xl font-black tracking-tight text-green-600 dark:text-green-400">
          ¡Liga Creada con Éxito!
        </CardTitle>
        <CardDescription className="text-neutral-500 dark:text-neutral-400">
          Comparte este código con tus amigos para que se unan a tu liga.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 mt-4">
        <div className="p-6 bg-neutral-100 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase mb-2">Código de Invitación</p>
          <p className="text-4xl font-black tracking-widest text-neutral-800 dark:text-neutral-200">
            {inviteCode}
          </p>
        </div>
        <Button
          onClick={onCopy}
          className={`w-full font-bold uppercase py-6 text-sm transition-all duration-300 ${
            copied 
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-[0_0_20px_rgba(22,163,74,0.4)]' 
              : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25'
          }`}
        >
          {copied ? '¡Copiado!' : 'Copiar Código'}
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate(`/leagues/${slug}`)}
          className="w-full font-bold uppercase py-6 text-sm border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          Ir a la liga
        </Button>
      </CardContent>
    </Card>
  );
};
