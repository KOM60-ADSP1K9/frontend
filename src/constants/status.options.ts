import type { LaporanStatus } from '../types/report.types';

export const STATUS_OPTIONS: { value: LaporanStatus; label: string }[] = [
  { value: 'active', label: 'Aktif' },
  { value: 'draft', label: 'Draft' },
  { value: 'claim pending', label: 'Diklaim' },
  { value: 'resolved', label: 'Ditemukan' },
  { value: 'self-resolved', label: 'Ditemukan Sendiri' },
  { value: 'closed', label: 'Ditutup' },
];
