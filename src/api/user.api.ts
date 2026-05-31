import apiClient from './client';
import type { ApiResponse } from '../types/api.types';
import type { User } from '../types/auth.types';

export class UserApi {
  static async getAll(): Promise<ApiResponse<User[]>> {
    const res = await apiClient.get<ApiResponse<User[]>>('/users');
    return res.data;
  }
}
