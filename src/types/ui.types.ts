import type { LaporanType, LaporanStatus } from './report.types';

export type LaporanFilterType = 'semua' | LaporanType;

export interface ActiveFilters {
  date_from: string;
  date_to: string;
  kategoriId: string;
  lokasiId: string;
  status: LaporanStatus | '';
}
