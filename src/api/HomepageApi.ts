import apiClient from './client';
import type { ApiResponse } from '../types/api.types';
import type { HomepageLaporanItem, LaporanQueryParams } from '../types/report.types';

export class HomepageApi {
  static async getAllLaporan(params?: LaporanQueryParams): Promise<ApiResponse<HomepageLaporanItem[]>> {
    const res = await apiClient.get<ApiResponse<HomepageLaporanItem[]>>('/homepage/laporan', {
      params: {
        ...(params?.type && { type: params.type }),
        ...(params?.status && { status: params.status }),
        page: params?.page ?? 1,
        limit: params?.limit ?? 20,
      },
    });
    return res.data;
  }

  static async getMyLaporan(params?: LaporanQueryParams): Promise<ApiResponse<HomepageLaporanItem[]>> {
    const res = await apiClient.get<ApiResponse<HomepageLaporanItem[]>>('/homepage/laporan/me', {
      params: {
        ...(params?.type && { type: params.type }),
        ...(params?.status && { status: params.status }),
        page: params?.page ?? 1,
        limit: params?.limit ?? 20,
      },
    });
    return res.data;
  }
}
