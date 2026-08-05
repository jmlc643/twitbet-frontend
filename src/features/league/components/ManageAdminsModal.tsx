import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, ShieldAlert, ShieldCheck, UserCog } from 'lucide-react';
import { leagueApi } from '@/features/league/api/league.api';
import type { GetLeagueDetailsResponse } from '@/features/league/types/league.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const ManageAdminsModal = ({ league }: { league: GetLeagueDetailsResponse }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const queryClient = useQueryClient();

  const assignAdminMutation = useMutation({
    mutationFn: (participantId: string) => leagueApi.assignAdmin(league.league_id, participantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['league', league.slug] });
      setMessage({ type: 'success', text: 'Administrador asignado correctamente.' });
      setTimeout(() => setMessage(null), 3000);
    },
    onError: () => {
      setMessage({ type: 'error', text: 'Ocurrió un error al asignar al administrador.' });
      setTimeout(() => setMessage(null), 3000);
    }
  });

  const removeAdminMutation = useMutation({
    mutationFn: (participantId: string) => leagueApi.removeAdmin(league.league_id, participantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['league', league.slug] });
      setMessage({ type: 'success', text: 'Administrador removido correctamente.' });
      setTimeout(() => setMessage(null), 3000);
    },
    onError: () => {
      setMessage({ type: 'error', text: 'Ocurrió un error al remover al administrador.' });
      setTimeout(() => setMessage(null), 3000);
    }
  });

  const filteredParticipants = league.participants?.filter(p => 
    p.user_id !== league.owner_id && 
    p.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) {
        setSearchQuery('');
        setMessage(null);
      }
    }}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 dark:border-indigo-900/50 dark:text-indigo-400 dark:hover:bg-indigo-950/30 transition-colors"
        >
          <UserCog className="w-4 h-4 mr-2" />
          Gestionar Administradores
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl border-neutral-200/50 dark:border-neutral-800/50 shadow-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl font-bold text-center">
            Gestionar Administradores
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <p className="text-sm text-neutral-500 text-center mb-4">
            Como propietario, puedes nombrar a otros participantes como administradores o revocarles el acceso. Los administradores pueden crear partidos y mercados, pero no pueden eliminar la liga.
          </p>

          <Input 
            placeholder="Buscar participante por usuario..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-2"
          />

          {message && (
            <div className={`p-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {filteredParticipants?.map((p) => (
              <div key={p.participant_id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  {p.profile_picture ? (
                    <img src={p.profile_picture} alt={p.username} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0 text-xs">
                      {p.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-semibold text-sm">{p.username}</span>
                  {p.role === 'ADMIN' && (
                    <span className="flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                      <Shield className="w-3 h-3 mr-1" />
                      ADMIN
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  {p.role !== 'ADMIN' && (
                    <Button 
                      size="sm"
                      variant="ghost" 
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30 h-8 text-xs font-medium"
                      onClick={() => assignAdminMutation.mutate(p.user_id)}
                      disabled={assignAdminMutation.isPending}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Hacer Admin
                    </Button>
                  )}
                  {p.role === 'ADMIN' && (
                    <Button 
                      size="sm"
                      variant="ghost" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 h-8 text-xs font-medium"
                      onClick={() => removeAdminMutation.mutate(p.user_id)}
                      disabled={removeAdminMutation.isPending}
                    >
                      <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Quitar Admin
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {(!filteredParticipants || filteredParticipants.length === 0) && (
              <div className="text-center p-4 text-sm text-neutral-500">
                {searchQuery ? 'No se encontraron participantes que coincidan con la búsqueda.' : 'No hay otros participantes en la liga.'}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
