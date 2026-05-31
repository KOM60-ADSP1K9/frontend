import type { LaporanStatus, LaporanType, UpdateStatusValue } from '../types/report.types';

export class LaporanService {
  static canUpdate(status: LaporanStatus): boolean {
    return status === 'draft' || status === 'active' || status === 'in progress';
  }

  static canEdit(status: LaporanStatus): boolean {
    return status === 'draft' || status === 'active';
  }

  static canDelete(status: LaporanStatus): boolean {
    return status === 'draft' || status === 'active';
  }

  static nextStatusOptions(status: LaporanStatus, type: LaporanType): { value: UpdateStatusValue; label: string; danger?: boolean }[] {
    if (status === 'draft') {
      return [{ value: 'active', label: 'Aktifkan Laporan' }];
    }

    if (status === 'active') {
      const opts: { value: UpdateStatusValue; label: string; danger?: boolean }[] = [];

      if (type === 'temuan') {
        opts.push({ value: 'resolved', label: 'Telah Dikembalikan' }); 
      } else if (type === 'hilang') {
        opts.push({ value: 'resolved', label: 'Barang Telah Kembali' });
        opts.push({ value: 'self-resolved', label: 'Ditemukan Sendiri' });
      }

      opts.push({ value: 'closed', label: 'Batalkan Laporan', danger: true });
      return opts;
    }

    if (status === 'in progress') {
      return [
        {
          value: 'resolved',
          label: type === 'temuan' ? 'Telah Dikembalikan' : 'Barang Telah Kembali',
        },
      ];
    }

    return [];
  }

  static statusLabel(status: LaporanStatus): string {
    const map: Record<LaporanStatus, string> = {
      draft: 'Draft',
      active: 'Aktif',
      'claim pending': 'Diklaim',
      'found claim pending': 'Ada Temuan',
      'in progress': 'Sedang Diproses',
      resolved: 'Ditemukan',
      closed: 'Ditutup',
      'self-resolved': 'Ditemukan Sendiri',
    };
    return map[status] ?? status;
  }

  static statusColor(status: LaporanStatus): string {
    const map: Record<LaporanStatus, string> = {
      draft: 'bg-zinc-500/20 text-zinc-400',
      active: 'bg-sky-500/20 text-sky-400',
      'claim pending': 'bg-amber-500/20 text-amber-400',
      'found claim pending': 'bg-indigo-500/20 text-indigo-400',
      'in progress': 'bg-violet-500/20 text-violet-400',
      resolved: 'bg-emerald-500/20 text-emerald-400',
      closed: 'bg-zinc-500/20 text-zinc-500',
      'self-resolved': 'bg-teal-500/20 text-teal-400',
    };
    return map[status] ?? 'bg-zinc-500/20 text-zinc-400';
  }

  static timeAgo(dateStr: string | null): string {
    if (!dateStr) return '—';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Baru saja';
    if (mins < 60) return `${mins} mnt lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
  }

  static formatDate(dateStr: string | null): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}
