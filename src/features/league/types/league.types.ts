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

export interface UpdateLeagueRequest {
  name: string;
  initial_balance: number;
  max_recharges: number;
  hide_standings: boolean;
}

export interface CreateMatchRequest {
  title: string;
  start_time: string;
}

export interface MatchResponse {
  id: string;
  league_id: string;
  title: string;
  start_time: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface MarketOptionRequest {
  name: string;
  odds: number;
}

export interface CreateMarketRequest {
  name: string;
  options: MarketOptionRequest[];
}

export interface MarketOptionResponse {
  id: string;
  market_id: string;
  name: string;
  initial_odds: number;
  current_odds: number;
}

export interface MarketResponse {
  id: string;
  league_id: string;
  match_id: string | null;
  name: string;
  status: string;
  options: MarketOptionResponse[];
  created_at: string;
  updated_at: string;
}

export interface GetMatchesResponse {
  matches: MatchResponse[] | null;
  total: number;
}

export interface UpdateMarketStatusRequest {
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface UpdateMarketOddsRequest {
  options_odds: Record<string, number>;
}

export interface WsMarketStatusChanged {
  type: 'MARKET_STATUS_CHANGED';
  market_id: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface WsOddsUpdated {
  type: 'ODDS_UPDATED';
  market_id: string;
  options: {
    id: string;
    market_id: string;
    name: string;
    initial_odds: number;
    current_odds: number;
  }[];
}

export type WebSocketEvent = WsMarketStatusChanged | WsOddsUpdated;
