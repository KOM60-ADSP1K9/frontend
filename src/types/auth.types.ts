// ── Request types ──────────────────────────────────────────────────────────

export interface RegisterRequest {
  email: string;
  password: string;
  nim: string;
  fakultas: string;
  departemen: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ── Response data types ────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  role: string;
  nim: string | null;
  fakultas: string | null;
  departemen: string | null;
  nip: string | null;
  email_verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface RegisterResponseData {
  id: string;
  email: string;
  role: string;
  nim: string | null;
  fakultas: string | null;
  departemen: string | null;
}

export interface LoginResponseData {
  access_token: string;
}

// ── API envelope ───────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  status: string;
  data: T;
  message: string;
}

export interface MessageResponse {
  status: string;
  message: string;
}
