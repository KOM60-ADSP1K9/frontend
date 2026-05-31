import type { LaporanType, LaporanStatus } from './report.types';

export type LaporanFilterType = 'semua' | LaporanType;

export class ActiveFilters {
  date_from: string;
  date_to: string;
  kategoriId: string;
  lokasiId: string;
  status: LaporanStatus | '';

  constructor(data: {
    date_from: string;
    date_to: string;
    kategoriId: string;
    lokasiId: string;
    status: LaporanStatus | '';
  }) {
    this.date_from = data.date_from;
    this.date_to = data.date_to;
    this.kategoriId = data.kategoriId;
    this.lokasiId = data.lokasiId;
    this.status = data.status;
  }
}
