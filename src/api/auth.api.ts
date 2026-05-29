import apiClient from './client';
import type { ApiResponse } from '../types/api.types';
import type { LoginRequest, LoginResponseData, RegisterRequest, RegisterResponseData, User } from '../types/auth.types';

export class AuthApi {
  static async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponseData>> {
    const res = await apiClient.post<ApiResponse<RegisterResponseData>>('/auth/register', data);
    return res.data;
  }

  static async getFakultas(): Promise<ApiResponse<string[]>> {
    const res = await apiClient.get<ApiResponse<string[]>>('/auth/fakultas');
    return res.data;
  }

  static async getDepartemen(fakultas: string): Promise<ApiResponse<string[]>> {
    const res = await apiClient.get<ApiResponse<string[]>>('/auth/fakultas/departemen', {
      params: { fakultas },
    });
    return res.data;
  }

  static async login(data: LoginRequest): Promise<ApiResponse<LoginResponseData>> {
    const res = await apiClient.post<ApiResponse<LoginResponseData>>('/auth/login', data);
    return res.data;
  }

  static async me(): Promise<ApiResponse<User>> {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data;
  }

  static async verifyEmail(token: string): Promise<ApiResponse<null>> {
    const res = await apiClient.get<ApiResponse<null>>('/auth/verify-email', {
      params: { token },
    });
    return res.data;
  }
}
