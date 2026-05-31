import React from 'react';
import { Image } from 'lucide-react';
import type { InquiryResponse, InquiryStatus } from '../../types/report.types';
import { LoadingSpinner } from '../common/loading.spinner';

interface Props {
  inquiry: InquiryResponse;
  laporanIsOwned?: boolean;
  onStatusUpdate?: (inquiryId: string, status: InquiryStatus) => Promise<void>;
}

interface State {
  isUpdating: boolean;
}

const TYPE_LABEL: Record<InquiryResponse['type'], string> = {
  claim: 'KLAIM',
  found: 'TEMUAN',
};

const STATUS_LABEL: Record<InquiryResponse['status'], string> = {
  proposed: 'MENUNGGU',
  active: 'DITERIMA',
  rejected: 'DITOLAK',
};

const TYPE_COLOR: Record<InquiryResponse['type'], string> = {
  claim: 'bg-indigo-500/20 text-indigo-400',
  found: 'bg-emerald-500/20 text-emerald-400',
};

const STATUS_COLOR: Record<InquiryResponse['status'], string> = {
  proposed: 'bg-amber-500/20 text-amber-400',
  active: 'bg-emerald-500/20 text-emerald-400',
  rejected: 'bg-rose-500/20 text-rose-400',
};

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export class InquiryCard extends React.Component<Props, State> {
  state: State = { isUpdating: false };

  private handleAction = async (status: InquiryStatus) => {
    const { inquiry, onStatusUpdate } = this.props;
    if (!onStatusUpdate) return;
    this.setState({ isUpdating: true });
    try {
      await onStatusUpdate(inquiry.id, status);
    } finally {
      this.setState({ isUpdating: false });
    }
  };

  private renderPhotoLink(url: string, label: string) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-brand-accent underline underline-offset-2 hover:opacity-80 transition-opacity"
      >
        <Image size={13} />
        {label}
      </a>
    );
  }

  render() {
    const { inquiry, laporanIsOwned } = this.props;
    const { isUpdating } = this.state;
    const { type, status, sender, message_content, send_date, is_owned } = inquiry;

    const showActions = laporanIsOwned && !is_owned;

    return (
      <div className="p-4 rounded-2xl bg-brand-surface-alt flex flex-col gap-3">

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wide ${TYPE_COLOR[type]}`}>
            {TYPE_LABEL[type]}
          </span>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wide ${STATUS_COLOR[status]}`}>
            {STATUS_LABEL[status]}
          </span>
          {is_owned && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wide bg-brand-accent/20 text-brand-accent ml-auto">
              KIRIMAN SAYA
            </span>
          )}
        </div>

        <div>
          <p className="text-brand-muted text-xs font-semibold tracking-widest uppercase mb-1">Pesan</p>
          <p className="text-brand-text text-sm leading-relaxed">{message_content}</p>
        </div>

        <div className="flex flex-col gap-0.5">
          {sender && (
            <p className="text-brand-muted text-xs">{sender.email}{sender.nim ? ` · ${sender.nim}` : ''}</p>
          )}
          <p className="text-brand-muted text-xs">{formatDateTime(send_date)}</p>
        </div>

        {type === 'claim' && (
          <div className="flex flex-col gap-2 pt-1 border-t border-white/5">
            {inquiry.claimer_contact && (
              <div>
                <p className="text-brand-muted text-xs font-semibold tracking-widest uppercase mb-1">Kontak</p>
                <p className="text-brand-text text-sm">{inquiry.claimer_contact}</p>
              </div>
            )}
            <div className="flex gap-3 flex-wrap">
              {inquiry.proof_of_ownership && this.renderPhotoLink(inquiry.proof_of_ownership, 'Bukti Kepemilikan')}
              {inquiry.ktm && this.renderPhotoLink(inquiry.ktm, 'Foto KTM')}
            </div>
          </div>
        )}

        {type === 'found' && (
          <div className="flex flex-col gap-2 pt-1 border-t border-white/5">
            {inquiry.finder_contact && (
              <div>
                <p className="text-brand-muted text-xs font-semibold tracking-widest uppercase mb-1">Kontak Penemu</p>
                <p className="text-brand-text text-sm">{inquiry.finder_contact}</p>
              </div>
            )}
            {inquiry.photo && (
              <div>
                <p className="text-brand-muted text-xs font-semibold tracking-widest uppercase mb-1.5">Foto Temuan</p>
                <img
                  src={inquiry.photo}
                  alt="Foto temuan"
                  className="w-full max-w-[240px] rounded-xl object-cover"
                />
              </div>
            )}
          </div>
        )}

        {showActions && status === 'proposed' && (
          <div className="flex gap-2 pt-1 border-t border-white/5">
            <button
              onClick={() => this.handleAction('active')}
              disabled={isUpdating}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/30 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isUpdating ? <LoadingSpinner size="sm" /> : 'Terima'}
            </button>
            <button
              onClick={() => this.handleAction('rejected')}
              disabled={isUpdating}
              className="flex-1 py-2.5 rounded-xl bg-rose-500/10 text-rose-400 text-xs font-bold hover:bg-rose-500/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isUpdating ? <LoadingSpinner size="sm" /> : 'Tolak'}
            </button>
          </div>
        )}
      </div>
    );
  }
}
