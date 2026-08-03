import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leagueApi } from '@/features/league/api/league.api';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Trophy, Wallet, Settings, EyeOff, Trash2, AlertTriangle } from 'lucide-react';
import { EditLeagueModal } from '@/features/league/components/EditLeagueModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const LeagueDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: league, isLoading, isError } = useQuery({
    queryKey: ['league', id],
    queryFn: () => leagueApi.getLeagueDetails(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => leagueApi.deleteLeague(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLeagues'] });
      navigate('/profile');
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6 max-w-4xl animate-in fade-in duration-500">
        <div className="h-8 w-24 bg-zinc-800/50 rounded animate-pulse" />
        <Card className="border-white/5 bg-zinc-950/50 backdrop-blur-xl">
          <CardHeader>
            <div className="h-6 w-1/3 bg-zinc-800/50 rounded animate-pulse mb-2" />
            <div className="h-4 w-1/4 bg-zinc-800/50 rounded animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-24 w-full bg-zinc-800/50 rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !league) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error al cargar la liga</h2>
        <Button onClick={() => navigate(-1)} variant="outline">
          Volver
        </Button>
      </div>
    );
  }

  const isAdmin = user?.id === league.admin_id;

  const handleDeleteLeague = () => {
    deleteMutation.mutate();
  };

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-5xl animate-in fade-in duration-500">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/profile')} 
        className="mb-4 text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a Mis Ligas
      </Button>

      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-neutral-200 dark:border-white/10 bg-white dark:bg-zinc-950/80 backdrop-blur-md shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <CardHeader>
            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              {league.name}
            </CardTitle>
            <CardDescription className="text-neutral-500 dark:text-zinc-400 flex items-center mt-2">
              Creado el {new Date(league.created_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-4">
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-neutral-500 dark:text-zinc-500 uppercase tracking-wider font-semibold">Código Inv.</span>
                <span className="text-lg font-mono font-medium text-emerald-600 dark:text-emerald-400">{league.invite_code}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-neutral-500 dark:text-zinc-500 uppercase tracking-wider font-semibold flex items-center"><Wallet className="w-3 h-3 mr-1"/> Saldo Inicial</span>
                <span className="text-lg font-medium text-neutral-900 dark:text-white">${league.initial_balance}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-neutral-500 dark:text-zinc-500 uppercase tracking-wider font-semibold flex items-center"><Users className="w-3 h-3 mr-1"/> Participantes</span>
                <span className="text-lg font-medium text-neutral-900 dark:text-white">{league.participants?.length || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Panel */}
        {isAdmin && (
          <Card className="border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-950/20 backdrop-blur-md shadow-lg shadow-indigo-500/10">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Administración
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3">
                <div className="w-full">
                  <EditLeagueModal league={league} />
                </div>
                <div className="w-full">
                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar Liga
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl border-neutral-200/50 dark:border-neutral-800/50 shadow-2xl">
                      <DialogHeader>
                        <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4">
                          <AlertTriangle className="w-6 h-6" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-center">
                          ¿Eliminar esta liga?
                        </DialogTitle>
                        <DialogDescription className="text-center">
                          Esta acción es irreversible. Se eliminarán todas las participaciones y el historial de la liga.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-center gap-3 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsDeleteDialogOpen(false)}
                          disabled={deleteMutation.isPending}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteLeague}
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? 'Eliminando...' : 'Sí, eliminar liga'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Ranking Section */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold flex items-center text-neutral-900 dark:text-zinc-100">
          <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
          Clasificación
        </h3>

        {!league.is_ranking_visible ? (
          <Card className="border-neutral-200 dark:border-white/5 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-neutral-100 dark:bg-zinc-800/50 mb-4">
                <EyeOff className="w-8 h-8 text-neutral-400 dark:text-zinc-400" />
              </div>
              <h4 className="text-lg font-semibold text-neutral-800 dark:text-zinc-200 mb-2">Ranking Oculto</h4>
              <p className="text-neutral-500 dark:text-zinc-500 max-w-md">
                El ranking de esta liga es privado. Las posiciones permanecen ocultas por decisión del administrador.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white dark:bg-zinc-950/60 border border-neutral-200 dark:border-white/10 rounded-xl overflow-hidden backdrop-blur-xl shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-neutral-500 dark:text-zinc-400 uppercase bg-neutral-50 dark:bg-zinc-900/80 border-b border-neutral-200 dark:border-white/5">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-semibold">Pos</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Jugador</th>
                    <th scope="col" className="px-6 py-4 font-semibold text-right">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {league.participants && [...league.participants].sort((a, b) => a.position - b.position).map((participant, index) => (
                    <tr 
                      key={participant.participant_id} 
                      className="border-b border-neutral-100 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors duration-200 group"
                      style={{
                        animationDelay: `${index * 50}ms`
                      }}
                    >
                      <td className="px-6 py-4 font-medium">
                        <div className={`
                          flex items-center justify-center w-8 h-8 rounded-full font-bold
                          ${participant.position === 1 ? 'bg-yellow-500/20 text-yellow-500 ring-1 ring-yellow-500/50' : 
                            participant.position === 2 ? 'bg-zinc-300/20 text-zinc-300 ring-1 ring-zinc-300/50' : 
                            participant.position === 3 ? 'bg-amber-700/20 text-amber-600 ring-1 ring-amber-700/50' : 
                            'bg-neutral-100 text-neutral-500 dark:bg-zinc-800 dark:text-zinc-400'}
                        `}>
                          {participant.position}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {participant.profile_picture ? (
                            <img 
                              src={participant.profile_picture} 
                              alt={participant.username} 
                              className="w-8 h-8 rounded-full object-cover shadow-lg"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shrink-0">
                              {participant.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="font-medium text-neutral-800 dark:text-zinc-200 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                            {participant.username}
                          </span>
                          {participant.user_id === user?.id && (
                            <span className="px-2 py-0.5 text-[10px] font-medium bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-500/30">
                              Tú
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-mono text-base font-semibold text-emerald-600 dark:text-emerald-400">
                          ${participant.balance.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!league.participants || league.participants.length === 0) && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-neutral-500 dark:text-zinc-500">
                        No hay participantes en esta liga aún.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
