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
