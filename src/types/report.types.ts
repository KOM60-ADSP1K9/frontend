export interface KategoriBarang {
  id: string;
  name: string;
}

export interface Lokasi {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface LokasiEmbedded {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface BarangResponse {
  id: string;
  name: string;
  description: string;
  photo: string;
  kategori_barang_id: string | null;
  kategori_barang: { id: string; name: string } | null;
  created_at: string | null;
  updated_at: string | null;
}

export type LaporanType = 'hilang' | 'temuan';
export type LaporanStatus =
  | 'draft'
  | 'active'
  | 'claim pending'
  | 'found claim pending'
  | 'in progress'
  | 'resolved'
  | 'closed'
  | 'self-resolved';

export type UpdateStatusValue = 'active' | 'resolved' | 'self-resolved' | 'closed';

export interface LaporanResponse {
  id: string;
  type: LaporanType;
  status: LaporanStatus;
  lost_at_location_id: string | null;
  lost_at_date: string | null;
  found_at_location_id: string | null;
  found_at_date: string | null;
  created_at: string | null;
  updated_at: string | null;
  barang: BarangResponse;
}

export interface UpdateBarangPayload {
  barang_name: string;
  barang_description: string;
  kategori_barang_id: string;
  photo?: File;
}

export interface UpdateDetailsPayload {
  location_id: string;
  date: string;
}

export interface LostReportPayload {
  photo: File;
  barang_name: string;
  barang_description: string;
  kategori_barang_id: string;
  lost_at_location_id: string;
  lost_at_date: string;
}

export interface FoundReportPayload {
  photo: File;
  barang_name: string;
  barang_description: string;
  kategori_barang_id: string;
  found_at_location_id: string | null;
  found_at_date: string;
}

export interface HomepageUserInfo {
  email: string;
  nim: string | null;
  nip: string | null;
}

export interface HomepageLaporanItem {
  id: string;
  type: LaporanType;
  status: LaporanStatus;
  lost_at_date: string | null;
  lost_at_location: LokasiEmbedded | null;
  found_at_date: string | null;
  found_at_location: LokasiEmbedded | null;
  created_at: string | null;
  updated_at: string | null;
  barang: BarangResponse;
  user: HomepageUserInfo | null;
  is_owned: boolean;
}

export type InquiryType = 'claim' | 'found';
export type InquiryStatus = 'proposed' | 'active' | 'rejected';

export interface InquiryResponse {
  id: string;
  type: InquiryType;
  status: InquiryStatus;
  laporan_id: string;
  sender_user_id: string;
  sender: HomepageUserInfo | null;
  message_content: string;
  send_date: string;
  claimer_contact: string | null;
  proof_of_ownership: string | null;
  ktm: string | null;
  finder_contact: string | null;
  photo: string | null;
  created_at: string | null;
  updated_at: string | null;
  is_owned: boolean;
}

export interface LaporanDetailResponse {
  id: string;
  type: LaporanType;
  status: LaporanStatus;
  lost_at_location_id: string | null;
  lost_at_date: string | null;
  found_at_location_id: string | null;
  found_at_date: string | null;
  created_at: string | null;
  updated_at: string | null;
  barang: BarangResponse;
  user: HomepageUserInfo | null;
  is_owned: boolean;
  inquiries: InquiryResponse[];
}

export interface ClaimInquiryPayload {
  laporan_id: string;
  message_content: string;
  claimer_contact: string;
  proof_of_ownership: File;
  ktm: File;
}

export interface FoundInquiryPayload {
  laporan_id: string;
  message_content: string;
  finder_contact: string;
  photo: File;
}

export interface LaporanQueryParams {
  type?: LaporanType;
  status?: LaporanStatus;
  page?: number;
  limit?: number;
  date?: string;
  date_from?: string;
  date_to?: string;
}
