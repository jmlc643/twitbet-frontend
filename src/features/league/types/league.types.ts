export interface CreateLeagueRequest {
  name: string;
  initial_balance: number;
  max_recharges?: number;
  hide_standings?: boolean;
  min_bets_to_qualify?: number;
}

export interface CreateLeagueResponse {
  id: string;
  slug: string;
  invite_code: string;
}

export interface JoinLeagueRequest {
  invite_code: string;
}

export interface JoinLeagueResponse {
  league_id: string;
  league_name: string;
  slug: string;
  balance: number;
}

export type LeagueRole = 'ADMIN' | 'MIEMBRO';

export interface LeagueSummary {
  league_id: string;
  slug: string;
  name: string;
  role: LeagueRole;
  participant_count: number;
  balance: number;
  status?: 'ACTIVE' | 'FINALIZED';
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
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
}

export interface GetLeagueDetailsResponse {
  league_id: string;
  slug: string;
  name: string;
  owner_id: string;
  initial_balance: number;
  max_recharges: number;
  is_ranking_visible: boolean;
  invite_code: string;
  created_at: string;
  participants_count: number;
  participants: Participant[] | null;
  min_bets_to_qualify?: number;
  status: 'ACTIVE' | 'FINALIZED';
}

export interface UpdateLeagueRequest {
  name: string;
  initial_balance: number;
  max_recharges: number;
  hide_standings: boolean;
  min_bets_to_qualify?: number;
}

export interface CreateMatchRequest {
  title: string;
  start_time: string;
}

export interface MatchResponse {
  id: string;
  league_id: string;
  slug: string;
  title: string;
  start_time: string;
  status: string;
  markets?: MarketResponse[];
  created_at: string;
  updated_at: string;
}

export interface GetMatchDetailsResponse extends MatchResponse {
  markets: MarketResponse[];
}

export type MarketType = 'RESULT' | 'TOTALS' | 'HANDICAP' | 'CORRECT_SCORE' | 'OTHER';

export type MarketOptionStatus = 'ACTIVE' | 'BLOCKED';

export interface MarketOptionRequest {
  name: string;
  odds: number;
}

export interface CreateMarketRequest {
  name: string;
  type?: MarketType;
  options: MarketOptionRequest[];
}

export interface AddMarketOptionsRequest {
  options: MarketOptionRequest[];
}

export interface UpdateMarketOptionStatusRequest {
  status: MarketOptionStatus;
}

export interface MarketOptionResponse {
  id: string;
  market_id: string;
  name: string;
  initial_odds: number;
  current_odds: number;
  status?: MarketOptionStatus;
}

export interface MarketResponse {
  id: string;
  league_id: string;
  match_id: string | null;
  name: string;
  type?: MarketType;
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

export interface PlaceBetRequest {
  league_id: string;
  market_id: string;
  market_option_id: string;
  amount: number;
  bonus_id?: string;
}

export interface ResolveMarketRequest {
  winning_option_ids: string[];
}

export interface CancelMarketRequest {
  cancellation_reason: string;
}

export interface UpdateMatchStatusRequest {
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'VOIDED';
}

export interface WsMarketStatusChanged {
  type: 'MARKET_STATUS_CHANGED';
  market_id: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'RESOLVED' | 'VOIDED' | 'CANCELLED';
}

export interface WsMatchStatusChanged {
  type: 'MATCH_STATUS_CHANGED';
  match_id: string;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'VOIDED';
}

export interface WsMarketResolved {
  type: 'MARKET_RESOLVED';
  market_id: string;
  league_id: string;
  winning_option_ids: string[];
}

export interface WsMarketSnapshotOption {
  id: string;
  market_id: string;
  name: string;
  initial_odds: number;
  current_odds: number;
  status?: MarketOptionStatus;
}

export interface WsMarketSnapshot {
  market_id: string;
  league_id: string;
  match_id: string | null;
  name: string;
  market_type: MarketType;
  status: string;
  options: WsMarketSnapshotOption[];
}

export interface WsMarketCreated extends WsMarketSnapshot {
  type: 'MARKET_CREATED';
}

export interface WsMarketOptionsUpdated extends WsMarketSnapshot {
  type: 'MARKET_OPTIONS_UPDATED';
}

export interface WsOddsUpdated {
  type: 'ODDS_UPDATED';
  market_id: string;
  options: WsMarketSnapshotOption[];
}

export interface WsParticipantBalanceUpdated {
  type: 'PARTICIPANT_BALANCE_UPDATED';
  participant_id: string;
  league_id: string;
  user_id: string;
}

export type WebSocketEvent = WsMarketStatusChanged | WsOddsUpdated | WsMatchStatusChanged | WsMarketResolved | WsParticipantBalanceUpdated | WsMarketCreated | WsMarketOptionsUpdated;

export interface ParticipantMeResponse {
  id: string;
  league_id: string;
  user_id: string;
  is_admin: boolean;
  balance: number;
  recharges_consumed: number;
  joined_at: string;
}

export interface BetDetailResponse {
  id: string;
  amount: number;
  odds: number;
  potential_win: number;
  status: 'ACCEPTED' | 'WON' | 'LOST' | 'VOIDED' | 'CASHOUT';
  placed_at: string;
  match_title: string;
  market_id: string;
  market_name: string;
  option_id: string;
  option_name: string;
  cashout_amount?: number;
}

export interface PaginatedBetResponse {
  data: BetDetailResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface BonusResponse {
  id: string;
  amount: number;
  status: 'PENDING' | 'USED' | 'EXPIRED';
  created_at: string;
}

export interface RechargeResponse {
  balance: number;
  recharges_consumed: number;
}

export interface GrantBonusRequest {
  amount: number;
}

export interface LeaderboardParticipant {
  participant_id: string;
  user_id: string;
  username: string;
  profile_picture?: string | null;
  balance: number | null;
  position: number | null;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  is_unranked: boolean;
}

export interface GetLeaderboardResponse {
  league_id: string;
  status: 'ACTIVE' | 'FINALIZED';
  hide_standings: boolean;
  min_bets_to_qualify: number;
  leaderboard: LeaderboardParticipant[];
}

export interface UpdateLeagueStatusRequest {
  status: 'FINALIZED';
}

export interface CombinedBetSelection {
  market_id: string;
  selection_id: string;
}

export interface PlaceCombinedBetRequest {
  league_id: string;
  stake: number;
  use_bonus: boolean;
  bonus_id?: string;
  selections: CombinedBetSelection[];
}

export interface LegResponse {
  id: string;
  market_id: string;
  match_id?: string;
  selection_name: string;
  odds_at_placement: number;
  status: 'PENDING' | 'WON' | 'LOST' | 'VOIDED';
  settled_at?: string;
}

export interface CombinedBetResponse {
  id: string;
  user_id: string;
  league_id: string;
  stake: number;
  use_bonus: boolean;
  total_odds: number;
  potential_win: number;
  status: 'PENDING' | 'ACCEPTED' | 'WON' | 'LOST' | 'CASHOUT';
  cashout_value?: number;
  cashout_expires_at?: string;
  created_at: string;
  settled_at?: string;
  legs: LegResponse[];
}
