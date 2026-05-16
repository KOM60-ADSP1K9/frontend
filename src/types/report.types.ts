// ── Kategori Barang ────────────────────────────────────────────────────────

export interface KategoriBarang {
  id: string;
  name: string;
}

// ── Lokasi ─────────────────────────────────────────────────────────────────

export interface Lokasi {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  created_at: string | null;
  updated_at: string | null;
}

// ── Barang ─────────────────────────────────────────────────────────────────

export interface BarangResponse {
  id: string;
  name: string;
  description: string;
  photo: string;
  kategori_barang_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// ── Laporan ─────────────────────────────────────────────────────────────────

export type LaporanType = 'hilang' | 'temuan';
export type LaporanStatus =
  | 'draft'
  | 'active'
  | 'claim pending'
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

// ── Request payloads ────────────────────────────────────────────────────────

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

// ── Homepage list item ──────────────────────────────────────────────────────

export interface HomepageUserInfo {
  email: string;
  nim: string | null;
  nip: string | null;
}

export interface HomepageLaporanItem {
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
}

// ── Query params ────────────────────────────────────────────────────────────

export interface LaporanQueryParams {
  type?: LaporanType;
  status?: LaporanStatus;
  page?: number;
  limit?: number;
}
