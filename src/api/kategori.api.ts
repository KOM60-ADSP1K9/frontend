import apiClient from './client';
import type { ApiResponse } from '../types/api.types';
import type { KategoriBarang } from '../types/report.types';

export class KategoriApi {
  static async getAll(): Promise<ApiResponse<KategoriBarang[]>> {
    const res = await apiClient.get<ApiResponse<KategoriBarang[]>>('/kategori-barang');
    return res.data;
  }
}
