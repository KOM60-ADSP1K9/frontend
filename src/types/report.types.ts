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
export type InquiryType = 'claim' | 'found';
export type InquiryStatus = 'proposed' | 'active' | 'rejected';

export class KategoriBarang {
  id: string;
  name: string;

  constructor(data: { id: string; name: string }) {
    this.id = data.id;
    this.name = data.name;
  }
}

export class LokasiEmbedded {
  id: string;
  name: string;
  latitude: number;
  longitude: number;

  constructor(data: { id: string; name: string; latitude: number; longitude: number }) {
    this.id = data.id;
    this.name = data.name;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
  }
}

export class Lokasi extends LokasiEmbedded {
  created_at: string | null;
  updated_at: string | null;

  constructor(data: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    created_at: string | null;
    updated_at: string | null;
  }) {
    super(data);
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}

export class BarangResponse {
  id: string;
  name: string;
  description: string;
  photo: string;
  kategori_barang_id: string | null;
  kategori_barang: { id: string; name: string } | null;
  created_at: string | null;
  updated_at: string | null;

  constructor(data: {
    id: string;
    name: string;
    description: string;
    photo: string;
    kategori_barang_id: string | null;
    kategori_barang: { id: string; name: string } | null;
    created_at: string | null;
    updated_at: string | null;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.photo = data.photo;
    this.kategori_barang_id = data.kategori_barang_id;
    this.kategori_barang = data.kategori_barang;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}

export class HomepageUserInfo {
  email: string;
  nim: string | null;
  nip: string | null;

  constructor(data: { email: string; nim: string | null; nip: string | null }) {
    this.email = data.email;
    this.nim = data.nim;
    this.nip = data.nip;
  }
}

export class InquiryResponse {
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

  constructor(data: {
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
  }) {
    this.id = data.id;
    this.type = data.type;
    this.status = data.status;
    this.laporan_id = data.laporan_id;
    this.sender_user_id = data.sender_user_id;
    this.sender = data.sender;
    this.message_content = data.message_content;
    this.send_date = data.send_date;
    this.claimer_contact = data.claimer_contact;
    this.proof_of_ownership = data.proof_of_ownership;
    this.ktm = data.ktm;
    this.finder_contact = data.finder_contact;
    this.photo = data.photo;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.is_owned = data.is_owned;
  }
}

export class LaporanResponse {
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

  constructor(data: {
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
  }) {
    this.id = data.id;
    this.type = data.type;
    this.status = data.status;
    this.lost_at_location_id = data.lost_at_location_id;
    this.lost_at_date = data.lost_at_date;
    this.found_at_location_id = data.found_at_location_id;
    this.found_at_date = data.found_at_date;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.barang = data.barang;
  }
}

export class LaporanDetailResponse extends LaporanResponse {
  user: HomepageUserInfo | null;
  is_owned: boolean;
  inquiries: InquiryResponse[];

  constructor(data: {
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
  }) {
    super(data);
    this.user = data.user;
    this.is_owned = data.is_owned;
    this.inquiries = data.inquiries;
  }
}

export class HomepageLaporanItem {
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

  constructor(data: {
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
  }) {
    this.id = data.id;
    this.type = data.type;
    this.status = data.status;
    this.lost_at_date = data.lost_at_date;
    this.lost_at_location = data.lost_at_location;
    this.found_at_date = data.found_at_date;
    this.found_at_location = data.found_at_location;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.barang = data.barang;
    this.user = data.user;
    this.is_owned = data.is_owned;
  }
}

export class LostReportPayload {
  photo: File;
  barang_name: string;
  barang_description: string;
  kategori_barang_id: string;
  lost_at_location_id: string;
  lost_at_date: string;

  constructor(data: {
    photo: File;
    barang_name: string;
    barang_description: string;
    kategori_barang_id: string;
    lost_at_location_id: string;
    lost_at_date: string;
  }) {
    this.photo = data.photo;
    this.barang_name = data.barang_name;
    this.barang_description = data.barang_description;
    this.kategori_barang_id = data.kategori_barang_id;
    this.lost_at_location_id = data.lost_at_location_id;
    this.lost_at_date = data.lost_at_date;
  }
}

export class FoundReportPayload {
  photo: File;
  barang_name: string;
  barang_description: string;
  kategori_barang_id: string;
  found_at_location_id: string | null;
  found_at_date: string;

  constructor(data: {
    photo: File;
    barang_name: string;
    barang_description: string;
    kategori_barang_id: string;
    found_at_location_id: string | null;
    found_at_date: string;
  }) {
    this.photo = data.photo;
    this.barang_name = data.barang_name;
    this.barang_description = data.barang_description;
    this.kategori_barang_id = data.kategori_barang_id;
    this.found_at_location_id = data.found_at_location_id;
    this.found_at_date = data.found_at_date;
  }
}

export class UpdateBarangPayload {
  barang_name: string;
  barang_description: string;
  kategori_barang_id: string;
  photo?: File;

  constructor(data: {
    barang_name: string;
    barang_description: string;
    kategori_barang_id: string;
    photo?: File;
  }) {
    this.barang_name = data.barang_name;
    this.barang_description = data.barang_description;
    this.kategori_barang_id = data.kategori_barang_id;
    this.photo = data.photo;
  }
}

export class UpdateDetailsPayload {
  location_id: string;
  date: string;

  constructor(data: { location_id: string; date: string }) {
    this.location_id = data.location_id;
    this.date = data.date;
  }
}

export class ClaimInquiryPayload {
  laporan_id: string;
  message_content: string;
  claimer_contact: string;
  proof_of_ownership: File;
  ktm: File;

  constructor(data: {
    laporan_id: string;
    message_content: string;
    claimer_contact: string;
    proof_of_ownership: File;
    ktm: File;
  }) {
    this.laporan_id = data.laporan_id;
    this.message_content = data.message_content;
    this.claimer_contact = data.claimer_contact;
    this.proof_of_ownership = data.proof_of_ownership;
    this.ktm = data.ktm;
  }
}

export class FoundInquiryPayload {
  laporan_id: string;
  message_content: string;
  finder_contact: string;
  photo: File;

  constructor(data: {
    laporan_id: string;
    message_content: string;
    finder_contact: string;
    photo: File;
  }) {
    this.laporan_id = data.laporan_id;
    this.message_content = data.message_content;
    this.finder_contact = data.finder_contact;
    this.photo = data.photo;
  }
}

export class LaporanQueryParams {
  type?: LaporanType;
  status?: LaporanStatus;
  page?: number;
  limit?: number;
  date?: string;
  date_from?: string;
  date_to?: string;

  constructor(data: {
    type?: LaporanType;
    status?: LaporanStatus;
    page?: number;
    limit?: number;
    date?: string;
    date_from?: string;
    date_to?: string;
  } = {}) {
    this.type = data.type;
    this.status = data.status;
    this.page = data.page;
    this.limit = data.limit;
    this.date = data.date;
    this.date_from = data.date_from;
    this.date_to = data.date_to;
  }
}
