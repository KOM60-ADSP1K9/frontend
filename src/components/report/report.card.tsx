import React from 'react';
import { MapPin, Briefcase, User } from 'lucide-react';
import type { HomepageLaporanItem } from '../../types/report.types';
import { LaporanService } from '../../services/laporan.service';

interface Props {
  laporan: HomepageLaporanItem;
  lokasiMap?: Record<string, string>;
  kategoriMap?: Record<string, string>;
  showStatus?: boolean;
  onClick?: (laporan: HomepageLaporanItem) => void;
}

export class LaporanCard extends React.Component<Props> {
  private handleClick = () => {
    this.props.onClick?.(this.props.laporan);
  };

  render() {
    const { laporan, lokasiMap, kategoriMap, showStatus = false } = this.props;
    const { barang, type, status, created_at } = laporan;
    const kategoriName = barang.kategori_barang?.name ?? (barang.kategori_barang_id && kategoriMap ? (kategoriMap[barang.kategori_barang_id] ?? null) : null);

    const embeddedLokasi = type === 'hilang' ? laporan.lost_at_location : laporan.found_at_location;
    const locationName = embeddedLokasi?.name ?? (embeddedLokasi?.id && lokasiMap ? (lokasiMap[embeddedLokasi.id] ?? '—') : '—');

    const isFound = type === 'temuan';

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={this.handleClick}
        onKeyDown={(e) => e.key === 'Enter' && this.handleClick()}
        className="flex gap-3 p-3.5 rounded-2xl bg-brand-surface-alt cursor-pointer hover:brightness-110 active:scale-[0.99] transition-all duration-200"
      >

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

        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">

          <div className="flex items-center gap-2 flex-wrap">
            <span className={['text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wide', isFound ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'].join(' ')}>{isFound ? 'TEMUAN' : 'HILANG'}</span>
            {showStatus && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wide ${LaporanService.statusColor(status)}`}>{LaporanService.statusLabel(status).toUpperCase()}</span>}
            {laporan.is_owned && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wide bg-brand-accent/20 text-brand-accent">
                <User size={9} />
                Laporanku
              </span>
            )}
            <span className="text-brand-muted text-xs">{LaporanService.timeAgo(created_at)}</span>
          </div>

          <p className="font-semibold text-brand-text text-sm truncate mt-1">{barang.name}</p>

          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <div className="flex items-center gap-1 text-brand-muted min-w-0">
              <MapPin size={11} className="flex-shrink-0" />
              <span className="text-xs truncate">{locationName}</span>
            </div>
            {kategoriName && (
              <div className="flex items-center gap-1 text-brand-muted min-w-0">
                <Briefcase size={11} className="flex-shrink-0" />
                <span className="text-xs truncate">{kategoriName}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
