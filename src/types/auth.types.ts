import type { ApiResponse } from './api.types';

export class SupervisedAt {
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

export class User {
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

  constructor(data: {
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
  }) {
    this.id = data.id;
    this.email = data.email;
    this.role = data.role;
    this.nim = data.nim;
    this.fakultas = data.fakultas;
    this.departemen = data.departemen;
    this.nip = data.nip;
    this.supervised_at = data.supervised_at;
    this.email_verified_at = data.email_verified_at;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}

export class RegisterRequest {
  email: string;
  password: string;
  nim: string;
  fakultas: string;
  departemen: string;

  constructor(data: { email: string; password: string; nim: string; fakultas: string; departemen: string }) {
    this.email = data.email;
    this.password = data.password;
    this.nim = data.nim;
    this.fakultas = data.fakultas;
    this.departemen = data.departemen;
  }
}

export class LoginRequest {
  email: string;
  password: string;

  constructor(data: { email: string; password: string }) {
    this.email = data.email;
    this.password = data.password;
  }
}

export class RegisterResponseData {
  id: string;
  email: string;
  role: string;
  nim: string | null;
  fakultas: string | null;
  departemen: string | null;

  constructor(data: {
    id: string;
    email: string;
    role: string;
    nim: string | null;
    fakultas: string | null;
    departemen: string | null;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.role = data.role;
    this.nim = data.nim;
    this.fakultas = data.fakultas;
    this.departemen = data.departemen;
  }
}

export class LoginResponseData {
  access_token: string;

  constructor(data: { access_token: string }) {
    this.access_token = data.access_token;
  }
}

export type { ApiResponse };
