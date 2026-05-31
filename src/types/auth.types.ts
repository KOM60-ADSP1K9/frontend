import type { ApiResponse } from './api.types';

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

export interface SupervisedAt {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface User {
  id: string;
  email: string;
  role: 'MAHASISWA' | 'STAFF';
  nim: string | null;
  fakultas: string | null;
  departemen: string | null;
  nip: string | null;
  supervised_at: SupervisedAt | null;
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

export type { ApiResponse };
