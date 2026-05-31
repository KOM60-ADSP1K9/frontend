import apiClient from './client';
import type { ApiResponse } from '../types/api.types';
import type { LaporanResponse, LostReportPayload, FoundReportPayload, UpdateStatusValue, UpdateBarangPayload, UpdateDetailsPayload, HomepageLaporanItem, LaporanQueryParams, LaporanDetailResponse } from '../types/report.types';

export class LaporanApi {
    static async getAllLaporan(params?: LaporanQueryParams): Promise<ApiResponse<HomepageLaporanItem[]>> {
    const res = await apiClient.get<ApiResponse<HomepageLaporanItem[]>>('/homepage/laporan', {
      params: {
        ...(params?.type && { type: params.type }),
        ...(params?.status && { status: params.status }),
        page: params?.page ?? 1,
        limit: params?.limit ?? 20,
        ...(params?.date && { date: params.date }),
        ...(params?.date_from && { date_from: params.date_from }),
        ...(params?.date_to && { date_to: params.date_to }),
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
        ...(params?.date && { date: params.date }),
        ...(params?.date_from && { date_from: params.date_from }),
        ...(params?.date_to && { date_to: params.date_to }),
      },
    });
    return res.data;
  }
  static async createLostReport(payload: LostReportPayload): Promise<ApiResponse<LaporanResponse>> {
    const formData = new FormData();
    formData.append('photo', payload.photo);
    formData.append('barang_name', payload.barang_name);
    formData.append('barang_description', payload.barang_description);
    formData.append('kategori_barang_id', payload.kategori_barang_id);
    formData.append('lost_at_location_id', payload.lost_at_location_id);
    formData.append('lost_at_date', payload.lost_at_date);

    const res = await apiClient.post<ApiResponse<LaporanResponse>>('/lost-reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }

  static async createFoundReport(payload: FoundReportPayload): Promise<ApiResponse<LaporanResponse>> {
    const formData = new FormData();
    formData.append('photo', payload.photo);
    formData.append('barang_name', payload.barang_name);
    formData.append('barang_description', payload.barang_description);
    formData.append('kategori_barang_id', payload.kategori_barang_id);
    if (payload.found_at_location_id) {
      formData.append('found_at_location_id', payload.found_at_location_id);
    }
    formData.append('found_at_date', payload.found_at_date);

    const res = await apiClient.post<ApiResponse<LaporanResponse>>('/found-reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }

  static async getLaporanDetail(laporanId: string): Promise<ApiResponse<LaporanDetailResponse>> {
    const res = await apiClient.get<ApiResponse<LaporanDetailResponse>>(`/reports/${laporanId}`);
    return res.data;
  }

  static async updateStatus(
    laporanId: string,
    status: UpdateStatusValue,
  ): Promise<ApiResponse<LaporanResponse>> {
    const res = await apiClient.patch<ApiResponse<LaporanResponse>>(
      `/reports/${laporanId}/status`,
      { status },
    );
    return res.data;
  }

  static async deleteLaporan(laporanId: string): Promise<ApiResponse<null>> {
    const res = await apiClient.delete<ApiResponse<null>>(`/reports/${laporanId}`);
    return res.data;
  }

  static async updateBarang(
    laporanId: string,
    payload: UpdateBarangPayload,
  ): Promise<ApiResponse<LaporanResponse>> {
    const formData = new FormData();
    formData.append('barang_name', payload.barang_name);
    formData.append('barang_description', payload.barang_description);
    formData.append('kategori_barang_id', payload.kategori_barang_id);
    if (payload.photo) formData.append('photo', payload.photo);
    const res = await apiClient.patch<ApiResponse<LaporanResponse>>(
      `/reports/${laporanId}/barang`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return res.data;
  }

  static async updateDetails(
    laporanId: string,
    payload: UpdateDetailsPayload,
  ): Promise<ApiResponse<LaporanResponse>> {
    const res = await apiClient.patch<ApiResponse<LaporanResponse>>(
      `/reports/${laporanId}/details`,
      { location_id: payload.location_id, date: payload.date },
    );
    return res.data;
  }
}
