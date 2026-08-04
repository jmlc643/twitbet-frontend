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
  MarketResponse
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
  }
};
