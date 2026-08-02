import { api } from '@/lib/axios';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth.types';

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  getProfile: async (token?: string): Promise<User> => {
    const response = await api.get<User>('/users/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  },

  updateProfile: async (data: { username?: string; avatar_url?: string }, token?: string): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>('/users/me', data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  },

  uploadAvatar: async (file: File, token?: string): Promise<{ avatar_url: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post<{ avatar_url: string }>('/users/me/avatar', formData, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};