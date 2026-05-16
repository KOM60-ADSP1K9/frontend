import type { LaporanType, LaporanStatus } from './report.types';

export type LaporanFilterType = 'semua' | LaporanType;

export interface ActiveFilters {
  date: string;
  kategoriId: string;
  status: LaporanStatus | '';
}
