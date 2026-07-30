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
