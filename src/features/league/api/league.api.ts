import { api } from '@/lib/axios';
import type { 
  CreateLeagueRequest, 
  CreateLeagueResponse, 
  JoinLeagueRequest, 
  JoinLeagueResponse,
  GetUserLeaguesResponse
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
  }
};
