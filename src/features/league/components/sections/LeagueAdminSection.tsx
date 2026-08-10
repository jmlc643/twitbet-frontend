import { useNavigate } from 'react-router-dom';
import { Settings, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EditLeagueModal } from '@/features/league/components/EditLeagueModal';
import { CreateMatchModal } from '@/features/league/components/CreateMatchModal';
import { CreateMarketModal } from '@/features/league/components/CreateMarketModal';
import { ManageAdminsModal } from '@/features/league/components/ManageAdminsModal';
import { GrantBonusModal } from '@/features/league/components/GrantBonusModal';
import { FinalizeLeagueModal } from '@/features/league/components/FinalizeLeagueModal';
import { DeleteLeagueModal } from '@/features/league/components/DeleteLeagueModal';
import { useAuthStore } from '@/store/useAuthStore';
import type { GetLeagueDetailsResponse } from '../../types/league.types';

interface LeagueAdminSectionProps {
  league: GetLeagueDetailsResponse;
  onDelete: () => void;
  isDeleting: boolean;
}

export const LeagueAdminSection = ({ league, onDelete, isDeleting }: LeagueAdminSectionProps) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isOwner = user?.id === league.owner_id;
  const isFinalized = league.status === 'FINALIZED';

  return (
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
            <Button 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md border-0"
              onClick={() => navigate(`/leagues/${league.slug}/live`)}
            >
              <Activity className="w-4 h-4 mr-2" />
              Consola En Vivo
            </Button>
          </div>
          <div className="w-full">
            <EditLeagueModal league={league} />
          </div>
          <div className="w-full">
            <CreateMatchModal leagueId={league.league_id} />
          </div>
          <div className="w-full">
            <CreateMarketModal leagueId={league.league_id} />
          </div>
          {isOwner && (
            <div className="w-full">
              <GrantBonusModal leagueId={league.league_id} />
            </div>
          )}
          {isOwner && !isFinalized && (
            <div className="w-full">
              <ManageAdminsModal league={league} />
            </div>
          )}
          {isOwner && !isFinalized && (
            <div className="w-full">
              <FinalizeLeagueModal leagueId={league.league_id} />
            </div>
          )}
          <div className="w-full">
            <DeleteLeagueModal onDelete={onDelete} isDeleting={isDeleting} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
