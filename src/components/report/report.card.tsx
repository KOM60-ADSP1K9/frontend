import React from 'react';
import type { HomepageLaporanItem } from '../../types/report.types';
import { LaporanService } from '../../services/laporan.service';

interface Props {
  laporan: HomepageLaporanItem;
  lokasiMap?: Record<string, string>;
  showStatus?: boolean;
  onClick?: (laporan: HomepageLaporanItem) => void;
}

export class LaporanCard extends React.Component<Props> {
  private handleClick = () => {
    this.props.onClick?.(this.props.laporan);
  };

  render() {
    const { laporan, lokasiMap, showStatus = false } = this.props;
    const { barang, type, status, created_at } = laporan;

    const embeddedLokasi = type === 'hilang' ? laporan.lost_at_location : laporan.found_at_location;
    const locationId = type === 'hilang' ? laporan.lost_at_location_id : laporan.found_at_location_id;
    const locationName = embeddedLokasi?.name ?? (locationId && lokasiMap ? (lokasiMap[locationId] ?? '—') : '—');

    const isFound = type === 'temuan';

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={this.handleClick}
        onKeyDown={(e) => e.key === 'Enter' && this.handleClick()}
        className="flex gap-3 p-3.5 rounded-2xl bg-brand-surface-alt cursor-pointer hover:brightness-110 active:scale-[0.99] transition-all duration-200"
      >
        {/* Foto */}
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-brand-surface">
          <img
            src={barang.photo}
            alt={barang.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
              e.currentTarget.parentElement!.style.background = '#1e2a3a';
            }}
          />
        </div>

        {/* Konten */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          {/* Badges + waktu */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={['text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wide', isFound ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'].join(' ')}>{isFound ? 'TEMUAN' : 'HILANG'}</span>
            {showStatus && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wide ${LaporanService.statusColor(status)}`}>{LaporanService.statusLabel(status).toUpperCase()}</span>}
            <span className="text-brand-muted text-xs">{LaporanService.timeAgo(created_at)}</span>
          </div>

          {/* Nama barang */}
          <p className="font-semibold text-white text-sm truncate mt-1">{barang.name}</p>

          {/* Lokasi */}
          <div className="flex items-center gap-1 text-brand-muted mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-xs truncate">{locationName}</span>
          </div>
        </div>
      </div>
    );
  }
}
