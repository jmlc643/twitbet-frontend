export interface CreateLeagueRequest {
  name: string;
  initial_balance: number;
  max_recharges?: number;
  hide_standings?: boolean;
}

export interface CreateLeagueResponse {
  id: string;
  invite_code: string;
}

export interface JoinLeagueRequest {
  invite_code: string;
}

export interface JoinLeagueResponse {
  league_id: string;
  league_name: string;
  balance: number;
}

export type LeagueRole = 'ADMIN' | 'MIEMBRO';

export interface LeagueSummary {
  league_id: string;
  name: string;
  role: LeagueRole;
  participant_count: number;
  balance: number;
}

export interface GetUserLeaguesResponse {
  leagues: LeagueSummary[] | null;
}

export interface Participant {
  participant_id: string;
  user_id: string;
  username: string;
  balance: number;
  position: number;
  profile_picture?: string;
}

export interface GetLeagueDetailsResponse {
  league_id: string;
  name: string;
  admin_id: string;
  initial_balance: number;
  max_recharges: number;
  is_ranking_visible: boolean;
  invite_code: string;
  created_at: string;
  participants: Participant[] | null;
}

export interface UpdateLeagueSettingsRequest {
  is_ranking_visible: boolean;
}
