import type { LaporanStatus, UpdateStatusValue } from '../types/report.types';

export class LaporanService {
  // Status yang boleh update STATUS laporan (via PATCH /reports/{id}/status)
  static canUpdate(status: LaporanStatus): boolean {
    return status === 'draft' || status === 'active' || status === 'claim pending';
  }

  // Status yang boleh edit KONTEN laporan (via PATCH /reports/{id}/barang & details)
  // BE: assert_can_update hanya allow DRAFT dan ACTIVE
  static canEdit(status: LaporanStatus): boolean {
    return status === 'draft' || status === 'active';
  }

  // Status yang boleh hapus laporan (via DELETE /reports/{id})
  // BE: assert_can_delete hanya allow DRAFT dan ACTIVE
  static canDelete(status: LaporanStatus): boolean {
    return status === 'draft' || status === 'active';
  }

  static nextStatusOptions(
    status: LaporanStatus,
  ): { value: UpdateStatusValue; label: string; danger?: boolean }[] {
    if (status === 'draft') {
      return [{ value: 'active', label: 'Aktifkan Laporan' }];
    }
    if (status === 'active') {
      return [
        { value: 'resolved', label: 'Tandai Ditemukan' },
        { value: 'self-resolved', label: 'Ditemukan Sendiri' },
        { value: 'closed', label: 'Tutup Laporan', danger: true },
      ];
    }
    if (status === 'claim pending') {
      return [
        { value: 'resolved', label: 'Konfirmasi Ditemukan' },
        { value: 'active', label: 'Batalkan Klaim' },
      ];
    }
    return [];
  }

  static statusLabel(status: LaporanStatus): string {
    const map: Record<LaporanStatus, string> = {
      draft: 'Draft',
      active: 'Aktif',
      'claim pending': 'Diklaim',
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
