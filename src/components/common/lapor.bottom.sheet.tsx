import React from 'react';
import { Search, Archive, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectHilang: () => void;
  onSelectTemuan: () => void;
}

export class LaporBottomSheet extends React.Component<Props> {
  private handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      this.props.onClose();
    }
  };

  render() {
    const { isOpen, onClose, onSelectHilang, onSelectTemuan } = this.props;
    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-end lg:items-center lg:justify-center"
        onClick={this.handleBackdropClick}
        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      >
        <div className="w-full lg:w-[480px] bg-brand-surface rounded-t-3xl lg:rounded-2xl px-5 pt-5 pb-10 lg:px-8 lg:pt-7 lg:pb-8">
          {/* Handle bar (mobile only) */}
          <div className="w-10 h-1 rounded-full bg-brand-muted/30 mx-auto mb-5 lg:hidden" />

          <div className="flex items-center justify-between mb-5">
            <h2 className="text-brand-text font-bold text-lg">Buat laporan</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-brand-surface-alt flex items-center justify-center text-brand-muted hover:text-brand-text transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onSelectHilang}
              className="flex items-center gap-4 p-4 rounded-2xl bg-brand-surface-alt hover:brightness-110 active:scale-[0.98] transition-all duration-200 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-400 flex-shrink-0">
                <Search size={22} />
              </div>
              <div>
                <p className="text-brand-text font-semibold text-sm">Lapor barang hilang</p>
                <p className="text-brand-muted text-xs mt-0.5">Barang kamu hilang? Laporkan di sini</p>
              </div>
            </button>

            <button
              onClick={onSelectTemuan}
              className="flex items-center gap-4 p-4 rounded-2xl bg-brand-surface-alt hover:brightness-110 active:scale-[0.98] transition-all duration-200 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Archive size={22} />
              </div>
              <div>
                <p className="text-brand-text font-semibold text-sm">Lapor barang temuan</p>
                <p className="text-brand-muted text-xs mt-0.5">Menemukan barang? Bantu kembalikan</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
