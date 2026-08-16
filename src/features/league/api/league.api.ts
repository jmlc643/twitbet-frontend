import { api } from '@/lib/axios';
import type { 
  CreateLeagueRequest, 
  CreateLeagueResponse, 
  JoinLeagueRequest, 
  JoinLeagueResponse,
  GetUserLeaguesResponse,
  GetLeagueDetailsResponse,
  UpdateLeagueRequest,
  CreateMatchRequest,
  MatchResponse,
  CreateMarketRequest,
  MarketResponse,
  GetMatchesResponse,
  UpdateMarketStatusRequest,
  UpdateMarketOddsRequest,
  GetMatchDetailsResponse,
  PlaceBetRequest,
  ResolveMarketRequest,
  UpdateMatchStatusRequest,
  ParticipantMeResponse,
  PaginatedBetResponse,
  BonusResponse,
  RechargeResponse,
  GrantBonusRequest,
  CancelMarketRequest,
  UpdateLeagueStatusRequest,
  GetLeaderboardResponse,
  AddMarketOptionsRequest,
  UpdateMarketOptionStatusRequest,
  PlaceCombinedBetRequest,
  CombinedBetResponse
} from '../types/league.types';

export const leagueApi = {
  createLeague: async (data: CreateLeagueRequest): Promise<CreateLeagueResponse> => {
    const response = await api.post<CreateLeagueResponse>('/leagues', data);
    return response.data;
  },

  joinLeague: async (data: JoinLeagueRequest): Promise<JoinLeagueResponse> => {
    const response = await api.post<JoinLeagueResponse>('/leagues/join', data);
    return response.data;
  },

  getUserLeagues: async (): Promise<GetUserLeaguesResponse> => {
    const response = await api.get<GetUserLeaguesResponse>('/leagues');
    return response.data;
  },

  getLeagueDetails: async (slug: string): Promise<GetLeagueDetailsResponse> => {
    const response = await api.get<GetLeagueDetailsResponse>(`/leagues/${slug}`);
    return response.data;
  },

  getMatchDetails: async (slug: string): Promise<GetMatchDetailsResponse> => {
    const response = await api.get<GetMatchDetailsResponse>(`/matches/${slug}`);
    return response.data;
  },

  updateLeague: async (id: string, data: UpdateLeagueRequest): Promise<void> => {
    await api.put(`/leagues/${id}`, data);
  },

  deleteLeague: async (id: string): Promise<void> => {
    await api.delete(`/leagues/${id}`);
  },

  updateLeagueStatus: async (id: string, data: UpdateLeagueStatusRequest): Promise<void> => {
    await api.patch(`/leagues/${id}/status`, data);
  },

  getLeaderboard: async (id: string): Promise<GetLeaderboardResponse> => {
    const response = await api.get<GetLeaderboardResponse>(`/leagues/${id}/leaderboard`);
    return response.data;
  },

  createMatch: async (leagueId: string, data: CreateMatchRequest): Promise<MatchResponse> => {
    const response = await api.post<MatchResponse>(`/leagues/${leagueId}/matches`, data);
    return response.data;
  },

  createMarketForLeague: async (leagueId: string, data: CreateMarketRequest): Promise<MarketResponse> => {
    const response = await api.post<MarketResponse>(`/leagues/${leagueId}/markets`, data);
    return response.data;
  },

  createMarketForMatch: async (matchId: string, data: CreateMarketRequest): Promise<MarketResponse> => {
    const response = await api.post<MarketResponse>(`/matches/${matchId}/markets`, data);
    return response.data;
  },

  getMatches: async (leagueId: string, page = 1, limit = 20, status?: string, includeAllMarkets?: boolean): Promise<GetMatchesResponse> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append('status', status);
    if (includeAllMarkets) params.append('include_all_markets', 'true');
    const response = await api.get<GetMatchesResponse>(`/leagues/${leagueId}/matches?${params.toString()}`);
    return response.data;
  },

  getLeagueMarkets: async (leagueId: string): Promise<MarketResponse[]> => {
    const response = await api.get<MarketResponse[]>(`/leagues/${leagueId}/markets`);
    return response.data;
  },

  getMatchMarkets: async (matchId: string): Promise<MarketResponse[]> => {
    const response = await api.get<MarketResponse[]>(`/matches/${matchId}/markets`);
    return response.data;
  },

  updateMarketStatus: async (marketId: string, data: UpdateMarketStatusRequest): Promise<void> => {
    await api.patch(`/markets/${marketId}/status`, data);
  },

  updateMarketOdds: async (marketId: string, data: UpdateMarketOddsRequest): Promise<void> => {
    await api.patch(`/markets/${marketId}/odds`, data);
  },

  addMarketOptions: async (marketId: string, data: AddMarketOptionsRequest): Promise<void> => {
    await api.post(`/markets/${marketId}/options`, data);
  },

  updateMarketOptionStatus: async (marketId: string, optionId: string, data: UpdateMarketOptionStatusRequest): Promise<void> => {
    await api.patch(`/markets/${marketId}/options/${optionId}/status`, data);
  },

  assignAdmin: async (leagueId: string, participantId: string): Promise<void> => {
    await api.post(`/leagues/${leagueId}/admins`, { participant_id: participantId });
  },

  removeAdmin: async (leagueId: string, participantId: string): Promise<void> => {
    await api.delete(`/leagues/${leagueId}/admins/${participantId}`);
  },

  placeBet: async (data: PlaceBetRequest): Promise<void> => {
    await api.post('/bets', data);
  },

  resolveMarket: async (marketId: string, data: ResolveMarketRequest): Promise<void> => {
    await api.post(`/markets/${marketId}/resolve`, data);
  },

  cancelMarket: async (marketId: string, data: CancelMarketRequest): Promise<void> => {
    await api.post(`/markets/${marketId}/cancel`, data);
  },

  updateMatchStatus: async (matchId: string, data: UpdateMatchStatusRequest): Promise<void> => {
    await api.patch(`/matches/${matchId}/status`, data);
  },

  getParticipantMe: async (leagueId: string): Promise<ParticipantMeResponse> => {
    const response = await api.get<ParticipantMeResponse>(`/leagues/${leagueId}/me`);
    return response.data;
  },

  getParticipantBets: async (
    leagueId: string, 
    status?: string, 
    page = 1, 
    limit = 10,
    startDate?: string,
    endDate?: string
  ): Promise<PaginatedBetResponse> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append('status', status);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const response = await api.get<PaginatedBetResponse>(`/leagues/${leagueId}/bets?${params.toString()}`);
    return response.data;
  },

  cashoutBet: async (betId: string): Promise<void> => {
    await api.post(`/bets/${betId}/cashout`);
  },

  recharge: async (leagueId: string): Promise<RechargeResponse> => {
    const response = await api.post<RechargeResponse>(`/leagues/${leagueId}/recharge`);
    return response.data;
  },

  grantBonus: async (leagueId: string, data: GrantBonusRequest): Promise<void> => {
    await api.post(`/leagues/${leagueId}/bonuses`, data);
  },

  getMyBonuses: async (leagueId: string): Promise<BonusResponse[]> => {
    const response = await api.get<BonusResponse[]>(`/leagues/${leagueId}/bonuses/me`);
    return response.data;
  },

  placeCombinedBet: async (data: PlaceCombinedBetRequest): Promise<void> => {
    await api.post('/combined-bets', data);
  },

  getUserCombinedBets: async (leagueId: string): Promise<CombinedBetResponse[]> => {
    const response = await api.get<CombinedBetResponse[]>(`/combined-bets?league_id=${leagueId}`);
    return response.data;
  },

  getCombinedBetDetails: async (betId: string): Promise<CombinedBetResponse> => {
    const response = await api.get<CombinedBetResponse>(`/combined-bets/${betId}`);
    return response.data;
  },

  cashoutCombinedBet: async (betId: string): Promise<{ message: string; cashout_value: number }> => {
    const response = await api.post<{ message: string; cashout_value: number }>(`/combined-bets/${betId}/cashout`);
    return response.data;
  }
};
