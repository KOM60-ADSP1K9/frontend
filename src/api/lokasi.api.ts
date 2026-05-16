import apiClient from './client';
import type { ApiResponse } from '../types/api.types';
import type { Lokasi } from '../types/report.types';

export class LokasiApi {
  static async getAll(): Promise<ApiResponse<Lokasi[]>> {
    const res = await apiClient.get<ApiResponse<Lokasi[]>>('/locations');
    return res.data;
  }
}
