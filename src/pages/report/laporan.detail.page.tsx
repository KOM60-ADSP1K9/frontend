import React from 'react';
import { withRouter } from '../../router/with.router';
import type { RouterProps } from '../../router/with.router';
import { LoadingSpinner } from '../../components/common/loading.spinner';
import { LaporanApi } from '../../api/laporan.api';
import { LokasiApi } from '../../api/lokasi.api';
import { KategoriApi } from '../../api/kategori.api';
import { Alert } from '../../utils/alert';
import { Toast } from '../../utils/toast';
import { ImageOff, FileSearch, ChevronLeft } from 'lucide-react';
import { LaporanService } from '../../services/laporan.service';
import { InquiryCard } from '../../components/report/inquiry.card';
import { ClaimInquiryForm } from '../../components/report/claim.inquiry.form';
import { FoundInquiryForm } from '../../components/report/found.inquiry.form';
import { InquiryApi } from '../../api/inquiry.api';
import type { HomepageLaporanItem, LaporanDetailResponse, UpdateStatusValue, InquiryStatus } from '../../types/report.types';

interface State {
  laporan: LaporanDetailResponse | null;
  lokasiMap: Record<string, string>;
  kategoriMap: Record<string, string>;
  isLoading: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  sheetOpen: boolean;
  inquirySheet: 'claim' | 'found' | null;
  imgError: boolean;
}

class LaporanDetailPageBase extends React.Component<RouterProps, State> {
  state: State = {
    laporan: null,
    lokasiMap: {},
    kategoriMap: {},
    isLoading: true,
    isUpdating: false,
    isDeleting: false,
    sheetOpen: false,
    inquirySheet: null,
    imgError: false,
  };

  async componentDidMount() {
    const passed = (this.props.location.state as { laporan?: HomepageLaporanItem } | null)?.laporan;
    const laporanId = this.props.params.id as string;

    const [lokasiRes, kategoriRes] = await Promise.all([LokasiApi.getAll(), KategoriApi.getAll()]);

    const lokasiMap: Record<string, string> = {};
    if (lokasiRes.status === 'success') {
      lokasiRes.data.forEach((l) => { lokasiMap[l.id] = l.name; });
    }

    const kategoriMap: Record<string, string> = {};
    if (kategoriRes.status === 'success') {
      kategoriRes.data.forEach((k) => { kategoriMap[k.id] = k.name; });
    }

    if (passed) {

      const laporan: LaporanDetailResponse = {
        ...passed,
        lost_at_location_id: passed.lost_at_location?.id ?? null,
        found_at_location_id: passed.found_at_location?.id ?? null,
        inquiries: [],
      };
      this.setState({ laporan, lokasiMap, kategoriMap, isLoading: false });

      LaporanApi.getLaporanDetail(laporanId).then((res) => {
        if (res.status === 'success') {
          this.setState((prev) =>
            prev.laporan ? { laporan: { ...prev.laporan, inquiries: res.data.inquiries } } : null,
          );
        }
      }).catch(() => {});
    } else {

      try {
        const res = await LaporanApi.getLaporanDetail(laporanId);
        if (res.status === 'success') {
          this.setState({ laporan: res.data, lokasiMap, kategoriMap, isLoading: false });
        } else {
          this.setState({ lokasiMap, kategoriMap, isLoading: false });
          Alert.error('Gagal memuat laporan', res.error);
        }
      } catch {
        this.setState({ lokasiMap, kategoriMap, isLoading: false });
        Alert.error('Gagal memuat laporan', 'Terjadi kesalahan. Coba lagi.');
      }
    }
  }

  private handleUpdateStatus = async (statusValue: UpdateStatusValue) => {
    const { laporan } = this.state;
    if (!laporan) return;

    const confirmed = await Alert.confirm('Update Status', `Ubah status laporan menjadi "${LaporanService.statusLabel(statusValue as Parameters<typeof LaporanService.statusLabel>[0])}"?`);
    if (!confirmed) return;

    this.setState({ isUpdating: true, sheetOpen: false });
    const toastId = Toast.loading('Memperbarui status...');

    try {
      const res = await LaporanApi.updateStatus(laporan.id, statusValue);
      Toast.dismiss(toastId);

      if (res.status !== 'success') {
        Alert.error('Gagal Update Status', res.error);
        this.setState({ isUpdating: false });
        return;
      }

      this.setState({
        laporan: { ...laporan, status: res.data.status },
        isUpdating: false,
      });
      Toast.success('Status laporan diperbarui');
    } catch {
      Toast.dismiss(toastId);
      Alert.error('Gagal Update Status', 'Terjadi kesalahan. Coba lagi.');
      this.setState({ isUpdating: false });
    }
  };

  private handleDelete = async () => {
    const { laporan } = this.state;
    if (!laporan) return;
    const confirmed = await Alert.confirm('Hapus Laporan', 'Laporan yang dihapus tidak bisa dikembalikan. Lanjutkan?');
    if (!confirmed) return;

    this.setState({ isDeleting: true });
    const toastId = Toast.loading('Menghapus laporan...');

    try {
      const res = await LaporanApi.deleteLaporan(laporan.id);
      Toast.dismiss(toastId);
      if (res.status !== 'success') {
        Alert.error('Gagal Menghapus', res.error);
        this.setState({ isDeleting: false });
        return;
      }
      Toast.success('Laporan berhasil dihapus');
      this.props.navigate('/riwayat');
    } catch {
      Toast.dismiss(toastId);
      Alert.error('Gagal Menghapus', 'Terjadi kesalahan. Coba lagi.');
      this.setState({ isDeleting: false });
    }
  };

  private refreshInquiries = async () => {
    const { laporan } = this.state;
    if (!laporan) return;
    this.setState({ inquirySheet: null });
    try {
      const res = await LaporanApi.getLaporanDetail(laporan.id);
      if (res.status === 'success') {
        this.setState((prev) =>
          prev.laporan ? { laporan: { ...prev.laporan, inquiries: res.data.inquiries } } : null,
        );
      }
    } catch {  }
  };

  private handleInquiryStatusUpdate = async (inquiryId: string, status: InquiryStatus) => {
    try {
      const res = await InquiryApi.updateInquiryStatus(inquiryId, status);
      if (res.status === 'success') {
        this.setState((prev) => {
          if (!prev.laporan) return null;
          return {
            laporan: {
              ...prev.laporan,
              inquiries: prev.laporan.inquiries.map((inq) =>
                inq.id === inquiryId ? { ...inq, status: res.data.status } : inq,
              ),
            },
          };
        });
      } else {
        Alert.error('Gagal', res.error);
      }
    } catch {
      Alert.error('Gagal', 'Terjadi kesalahan. Coba lagi.');
    }
  };

  private renderInquirySheet() {
    const { laporan, inquirySheet } = this.state;
    if (!laporan || !inquirySheet) return null;

    const title = inquirySheet === 'claim' ? 'Ajukan Klaim' : 'Laporkan Temuan';
    const subtitle = inquirySheet === 'claim'
      ? 'Isi form berikut untuk mengajukan klaim kepemilikan'
      : 'Isi form berikut untuk melaporkan bahwa Anda menemukan barang ini';

    return (
      <div className="fixed inset-0 z-40 bg-black/60 lg:flex lg:items-center lg:justify-center" onClick={() => this.setState({ inquirySheet: null })}>
        <div
          className="fixed bottom-0 left-0 right-0 z-50 bg-brand-surface rounded-t-3xl p-6 pb-10 max-w-lg mx-auto overflow-y-auto max-h-[90vh] lg:static lg:z-auto lg:max-w-none lg:w-[520px] lg:rounded-2xl lg:pb-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-10 h-1 bg-brand-muted/30 rounded-full mx-auto mb-5 lg:hidden" />
          <p className="text-brand-text font-bold text-base mb-1">{title}</p>
          <p className="text-brand-muted text-xs mb-5">{subtitle}</p>
          {inquirySheet === 'claim' ? (
            <ClaimInquiryForm
              laporanId={laporan.id}
              onSuccess={this.refreshInquiries}
              onCancel={() => this.setState({ inquirySheet: null })}
            />
          ) : (
            <FoundInquiryForm
              laporanId={laporan.id}
              onSuccess={this.refreshInquiries}
              onCancel={() => this.setState({ inquirySheet: null })}
            />
          )}
        </div>
      </div>
    );
  }

  private renderUpdateSheet() {
    const { laporan, sheetOpen } = this.state;
    if (!laporan || !sheetOpen) return null;

    const options = LaporanService.nextStatusOptions(laporan.status, laporan.type);

    return (
      <div className="fixed inset-0 z-40 bg-black/60 lg:flex lg:items-center lg:justify-center" onClick={() => this.setState({ sheetOpen: false })}>
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-brand-surface rounded-t-3xl p-6 pb-10 max-w-lg mx-auto lg:static lg:z-auto lg:max-w-none lg:w-[500px] lg:rounded-2xl lg:pb-6" onClick={(e) => e.stopPropagation()}>
          <div className="w-10 h-1 bg-brand-muted/30 rounded-full mx-auto mb-5 lg:hidden" />
          <p className="text-brand-text font-bold text-base mb-1">Update Status</p>
          <p className="text-brand-muted text-xs mb-5">Pilih status baru untuk laporan ini</p>
          <div className="flex flex-col gap-3">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => this.handleUpdateStatus(opt.value)}
                className={[
                  'w-full py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-[0.98]',
                  opt.danger ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20' : 'bg-brand-surface-alt text-brand-text hover:brightness-110',
                ].join(' ')}
              >
                {opt.label}
              </button>
            ))}
            <button onClick={() => this.setState({ sheetOpen: false })} className="w-full py-3.5 rounded-2xl text-brand-muted text-sm font-semibold hover:text-brand-text transition-colors">
              Batal
            </button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { laporan, lokasiMap, kategoriMap, isLoading, isUpdating, isDeleting, imgError } = this.state;

    if (isLoading) {
      return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center">
          <LoadingSpinner />
        </div>
      );
    }

    if (!laporan) {
      return (
        <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center gap-3 px-6">
          <FileSearch size={40} className="text-brand-muted" />
          <p className="text-brand-muted text-sm text-center">Data laporan tidak ditemukan</p>
          <button onClick={() => this.props.navigate(-1)} className="mt-2 px-6 py-2.5 rounded-xl bg-brand-surface-alt text-brand-text text-sm font-semibold">
            Kembali
          </button>
        </div>
      );
    }

    const { barang, type, status, user, is_owned } = laporan;
    const kategoriName = barang.kategori_barang?.name ?? (barang.kategori_barang_id ? (kategoriMap[barang.kategori_barang_id] ?? '—') : '—');
    const isFound = type === 'temuan';
    const locationId = isFound ? laporan.found_at_location_id : laporan.lost_at_location_id;
    const locationName = locationId ? (lokasiMap[locationId] ?? '—') : '—';
    const eventDate = isFound ? laporan.found_at_date : laporan.lost_at_date;
    const canUpdateStatus = is_owned && LaporanService.canUpdate(status);
    const canEditLaporan = is_owned && LaporanService.canEdit(status);
    const canDeleteLaporan = is_owned && LaporanService.canDelete(status);

    const photoBlock = (
      <div className="rounded-2xl overflow-hidden bg-brand-surface-alt w-full h-full">
        {!imgError ? (
          <img src={barang.photo} alt={barang.name} className="w-full h-full object-cover" onError={() => this.setState({ imgError: true })} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff size={36} className="text-brand-muted" />
          </div>
        )}
      </div>
    );

    const badgesBlock = (
      <div className="flex gap-2">
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wide ${isFound ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>{isFound ? 'TEMUAN' : 'HILANG'}</span>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wide ${LaporanService.statusColor(status)}`}>{LaporanService.statusLabel(status).toUpperCase()}</span>
      </div>
    );

    const visibleInquiries = laporan.is_owned
      ? laporan.inquiries
      : laporan.inquiries.filter((q) => q.is_owned);

    const inquiryBlock = visibleInquiries.length > 0 ? (
      <div className="flex flex-col gap-3">
        <p className="text-brand-muted text-xs font-semibold tracking-widest uppercase">
          {laporan.is_owned ? `Inquiry Masuk (${visibleInquiries.length})` : 'Inquiry Saya'}
        </p>
        {visibleInquiries.map((inq) => (
          <InquiryCard
            key={inq.id}
            inquiry={inq}
            laporanIsOwned={laporan.is_owned}
            onStatusUpdate={this.handleInquiryStatusUpdate}
          />
        ))}
      </div>
    ) : null;

    const infoBlock = (
      <div className="flex flex-col gap-3">
        <div className="p-4 rounded-2xl bg-brand-surface-alt">
          <p className="text-brand-muted text-xs font-semibold tracking-widest uppercase mb-1.5">Deskripsi</p>
          <p className="text-brand-text text-sm leading-relaxed">{barang.description}</p>
        </div>
        <div className="p-4 rounded-2xl bg-brand-surface-alt">
          <p className="text-brand-muted text-xs font-semibold tracking-widest uppercase mb-1.5">Kategori Barang</p>
          <p className="text-brand-text text-sm">{kategoriName}</p>
        </div>
        <div className="p-4 rounded-2xl bg-brand-surface-alt flex flex-col gap-3">
          <div>
            <p className="text-brand-muted text-xs font-semibold tracking-widest uppercase mb-1">{isFound ? 'Lokasi Ditemukan' : 'Lokasi Kehilangan'}</p>
            <p className="text-brand-text text-sm">{locationName}</p>
          </div>
          <div className="w-full h-px bg-white/5" />
          <div>
            <p className="text-brand-muted text-xs font-semibold tracking-widest uppercase mb-1">{isFound ? 'Tanggal Ditemukan' : 'Tanggal Hilang'}</p>
            <p className="text-brand-text text-sm">{LaporanService.formatDate(eventDate)}</p>
          </div>
        </div>
        {user && (
          <div className="p-4 rounded-2xl bg-brand-surface-alt">
            <p className="text-brand-muted text-xs font-semibold tracking-widest uppercase mb-2">Pelapor</p>
            <p className="text-brand-text text-sm">{user.email}</p>
            {user.nim && <p className="text-brand-muted text-xs mt-0.5">{user.nim}</p>}
          </div>
        )}
      </div>
    );

    const canSendClaim = !is_owned && type === 'temuan' && status === 'active';
    const canSendFound = !is_owned && type === 'hilang' && status === 'active';

    const ctaBlock = (canUpdateStatus || canDeleteLaporan || canSendClaim || canSendFound) ? (
      <div className="flex flex-col gap-2">
        {canUpdateStatus && (
          <div className="flex gap-2">
            <button
              onClick={() => this.setState({ sheetOpen: true })}
              disabled={isUpdating || isDeleting}
              className="flex-1 py-4 rounded-2xl bg-brand-accent text-brand-bg font-bold text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isUpdating ? <LoadingSpinner size="sm" /> : 'Update Status'}
            </button>
            {canEditLaporan && (
              <button
                onClick={() => this.props.navigate(`/laporan/${laporan.id}/edit`, { state: { laporan } })}
                disabled={isUpdating || isDeleting}
                className="px-5 py-4 rounded-2xl bg-brand-surface-alt text-brand-text font-semibold text-sm hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
              >
                Edit
              </button>
            )}
          </div>
        )}
        {canDeleteLaporan && (
          <button
            onClick={this.handleDelete}
            disabled={isDeleting || isUpdating}
            className="w-full py-3.5 rounded-2xl bg-rose-500/10 text-rose-400 font-semibold text-sm hover:bg-rose-500/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? <LoadingSpinner size="sm" /> : 'Hapus Laporan'}
          </button>
        )}
        {canSendClaim && (
          <button
            onClick={() => this.setState({ inquirySheet: 'claim' })}
            className="w-full py-4 rounded-2xl bg-brand-accent text-brand-bg font-bold text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all duration-200"
          >
            Ajukan Klaim
          </button>
        )}
        {canSendFound && (
          <button
            onClick={() => this.setState({ inquirySheet: 'found' })}
            className="w-full py-4 rounded-2xl bg-brand-accent text-brand-bg font-bold text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all duration-200"
          >
            Laporkan Temuan
          </button>
        )}
      </div>
    ) : null;

    return (
      <div className="min-h-screen bg-brand-bg flex flex-col lg:pl-14">
        {this.renderInquirySheet()}
        {this.renderUpdateSheet()}

        <div className="flex items-center gap-3 px-4 pt-5 pb-4 lg:px-8 lg:pt-8 lg:max-w-5xl lg:mx-auto lg:w-full">
          <button onClick={() => this.props.navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-brand-surface-alt text-brand-muted hover:text-brand-text transition-colors" aria-label="Kembali">
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-brand-text font-bold text-base lg:text-xl flex-1 truncate">Detail Laporan</h1>
        </div>

        <div className="lg:hidden flex flex-col flex-1">
          <div className="mx-4 h-56">{photoBlock}</div>
          <div className="flex gap-2 px-4 pt-4">{badgesBlock}</div>
          <div className="px-4 pt-3">
            <h2 className="text-brand-text font-bold text-xl">{barang.name}</h2>
          </div>
          <div className="px-4 pt-4 flex flex-col gap-6 pb-32">
            {infoBlock}
            {inquiryBlock}
          </div>
          {ctaBlock && (
            <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-brand-bg border-t border-white/5">
              {ctaBlock}
            </div>
          )}
        </div>

        <div className="hidden lg:flex gap-8 px-8 pb-12 max-w-5xl mx-auto w-full flex-1">

          <div className="w-[400px] flex-shrink-0">
            <div className="h-[420px] sticky top-8">{photoBlock}</div>
          </div>

          <div className="flex-1 flex flex-col gap-5 min-w-0">
            {badgesBlock}
            <h2 className="text-brand-text font-bold text-3xl leading-tight">{barang.name}</h2>
            {infoBlock}
            {inquiryBlock}
            {ctaBlock && <div className="pt-2">{ctaBlock}</div>}
          </div>
        </div>
      </div>
    );
  }
}

export const LaporanDetailPage = withRouter(LaporanDetailPageBase);
