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
  GetMatchesResponse
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

  getLeagueDetails: async (id: string): Promise<GetLeagueDetailsResponse> => {
    const response = await api.get<GetLeagueDetailsResponse>(`/leagues/${id}`);
    return response.data;
  },

  updateLeague: async (id: string, data: UpdateLeagueRequest): Promise<void> => {
    await api.put(`/leagues/${id}`, data);
  },

  deleteLeague: async (id: string): Promise<void> => {
    await api.delete(`/leagues/${id}`);
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

  getMatches: async (leagueId: string, page = 1, limit = 20, status?: string): Promise<GetMatchesResponse> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append('status', status);
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
  }
};
