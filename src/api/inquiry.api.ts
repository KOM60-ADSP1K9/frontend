import apiClient from './client';
import type { ApiResponse } from '../types/api.types';
import type { InquiryResponse, ClaimInquiryPayload, FoundInquiryPayload } from '../types/report.types';

export class InquiryApi {
  static async createClaimInquiry(payload: ClaimInquiryPayload): Promise<ApiResponse<InquiryResponse>> {
    const formData = new FormData();
    formData.append('laporan_id', payload.laporan_id);
    formData.append('message_content', payload.message_content);
    formData.append('claimer_contact', payload.claimer_contact);
    formData.append('proof_of_ownership', payload.proof_of_ownership);
    formData.append('ktm', payload.ktm);
    const res = await apiClient.post<ApiResponse<InquiryResponse>>('/inquiries/claim', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }

  static async createFoundInquiry(payload: FoundInquiryPayload): Promise<ApiResponse<InquiryResponse>> {
    const formData = new FormData();
    formData.append('laporan_id', payload.laporan_id);
    formData.append('message_content', payload.message_content);
    formData.append('finder_contact', payload.finder_contact);
    formData.append('photo', payload.photo);
    const res = await apiClient.post<ApiResponse<InquiryResponse>>('/inquiries/found', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }

  static async updateInquiryStatus(
    inquiryId: string,
    status: InquiryResponse['status'],
  ): Promise<ApiResponse<InquiryResponse>> {
    const res = await apiClient.patch<ApiResponse<InquiryResponse>>(
      `/inquiries/${inquiryId}/status`,
      { status },
    );
    return res.data;
  }
}
