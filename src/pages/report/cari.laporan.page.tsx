import React from 'react';
import { Inbox, SearchX, Search, X, ListFilter, MoreVertical } from 'lucide-react';
import { withRouter } from '../../router/with.router';
import type { RouterProps } from '../../router/with.router';
import { BottomNavbar } from '../../components/common/bottom.navbar';
import { LaporanCard } from '../../components/report/report.card';
import { LoadingSpinner } from '../../components/common/loading.spinner';
import { LaporanApi } from '../../api/laporan.api';
import { LokasiApi } from '../../api/lokasi.api';
import { KategoriApi } from '../../api/kategori.api';
import { Alert } from '../../utils/alert';
import { Toast } from '../../utils/toast';
import { LaporanService } from '../../services/laporan.service';
import type { HomepageLaporanItem, LaporanStatus, KategoriBarang, UpdateStatusValue } from '../../types/report.types';
import type { LaporanFilterType, ActiveFilters } from '../../types/ui.types';

interface State {
  laporan: HomepageLaporanItem[];
  lokasiMap: Record<string, string>;
  kategoriMap: Record<string, string>;
  kategoriList: KategoriBarang[];
  isLoading: boolean;
  typeFilter: LaporanFilterType;
  search: string;
  activeFilters: ActiveFilters;
  pendingFilters: ActiveFilters;
  filterSheetOpen: boolean;
  updatingId: string | null;
  sheetLaporan: HomepageLaporanItem | null;
}

const EMPTY_FILTERS: ActiveFilters = { date_from: '', date_to: '', kategoriId: '', lokasiId: '', status: '' };

const STATUS_OPTIONS: { value: LaporanStatus; label: string }[] = [
  { value: 'active', label: 'Aktif' },
  { value: 'draft', label: 'Draft' },
  { value: 'claim pending', label: 'Diklaim' },
  { value: 'resolved', label: 'Ditemukan' },
  { value: 'self-resolved', label: 'Ditemukan Sendiri' },
  { value: 'closed', label: 'Ditutup' },
];

class RiwayatPageBase extends React.Component<RouterProps, State> {
  state: State = {
    laporan: [],
    lokasiMap: {},
    kategoriMap: {},
    kategoriList: [],
    isLoading: true,
    typeFilter: 'semua',
    search: '',
    activeFilters: { ...EMPTY_FILTERS },
    pendingFilters: { ...EMPTY_FILTERS },
    filterSheetOpen: false,
    updatingId: null,
    sheetLaporan: null,
  };

  async componentDidMount() {
    const [laporanRes, lokasiRes, kategoriRes] = await Promise.allSettled([LaporanApi.getAllLaporan({ limit: 100 }), LokasiApi.getAll(), KategoriApi.getAll()]);

    const next: Partial<State> = { isLoading: false };

    if (laporanRes.status === 'fulfilled' && laporanRes.value.status === 'success') {
      next.laporan = [...laporanRes.value.data].sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime());
    } else {
      Toast.error('Gagal memuat laporan');
    }

    if (lokasiRes.status === 'fulfilled' && lokasiRes.value.status === 'success') {
      const map: Record<string, string> = {};
      lokasiRes.value.data.forEach((l) => {
        map[l.id] = l.name;
      });
      next.lokasiMap = map;
    }

    if (kategoriRes.status === 'fulfilled' && kategoriRes.value.status === 'success') {
      next.kategoriList = kategoriRes.value.data;
      const kMap: Record<string, string> = {};
      kategoriRes.value.data.forEach((k) => { kMap[k.id] = k.name; });
      next.kategoriMap = kMap;
    }

    this.setState(next as State);
  }

  private getFiltered(): HomepageLaporanItem[] {
    const { laporan, typeFilter, search, activeFilters } = this.state;
    const q = search.trim().toLowerCase();

    return laporan.filter((l) => {
      if (typeFilter !== 'semua' && l.type !== typeFilter) return false;

      if (q && !l.barang.name.toLowerCase().includes(q)) return false;

      if (activeFilters.date_from || activeFilters.date_to) {
        const eventDate = l.type === 'hilang' ? l.lost_at_date : l.found_at_date;
        if (!eventDate) return false;
        if (activeFilters.date_from && eventDate < activeFilters.date_from) return false;
        if (activeFilters.date_to && eventDate > activeFilters.date_to) return false;
      }

      if (activeFilters.kategoriId && l.barang.kategori_barang_id !== activeFilters.kategoriId) {
        return false;
      }

      if (activeFilters.lokasiId) {
        const loc = l.type === 'hilang' ? l.lost_at_location : l.found_at_location;
        if (loc?.id !== activeFilters.lokasiId) return false;
      }

      if (activeFilters.status && l.status !== activeFilters.status) return false;

      return true;
    });
  }

  private get activeFilterCount(): number {
    const { activeFilters } = this.state;
    const hasDate = !!(activeFilters.date_from || activeFilters.date_to);
    return [hasDate, !!activeFilters.kategoriId, !!activeFilters.lokasiId, !!activeFilters.status].filter(Boolean).length;
  }

  private handleCardClick = (laporan: HomepageLaporanItem) => {
    this.props.navigate(`/laporan/${laporan.id}`, { state: { laporan } });
  };

  private handleUpdateStatus = async (statusValue: UpdateStatusValue) => {
    const { sheetLaporan, laporan } = this.state;
    if (!sheetLaporan) return;

    this.setState({ updatingId: sheetLaporan.id, sheetLaporan: null });
    const toastId = Toast.loading('Memperbarui status...');

    try {
      const res = await LaporanApi.updateStatus(sheetLaporan.id, statusValue);
      Toast.dismiss(toastId);

      if (res.status !== 'success') {
        Alert.error('Gagal Update Status', res.error);
        this.setState({ updatingId: null });
        return;
      }

      const updated = laporan.map((l) => (l.id === sheetLaporan.id ? { ...l, status: res.data.status } : l));
      this.setState({ laporan: updated, updatingId: null });
      Toast.success('Status laporan diperbarui');
    } catch {
      Toast.dismiss(toastId);
      Alert.error('Gagal Update Status', 'Terjadi kesalahan. Coba lagi.');
      this.setState({ updatingId: null });
    }
  };

  private openFilterSheet = () => {
    this.setState((prev) => ({
      filterSheetOpen: true,
      pendingFilters: { ...prev.activeFilters },
    }));
  };

  private applyFilters = () => {
    this.setState((prev) => ({
      activeFilters: { ...prev.pendingFilters },
      filterSheetOpen: false,
    }));
  };

  private resetFilters = () => {
    this.setState({
      pendingFilters: { ...EMPTY_FILTERS },
      activeFilters: { ...EMPTY_FILTERS },
      filterSheetOpen: false,
    });
  };

  private setPendingFilter = <K extends keyof ActiveFilters>(key: K, value: ActiveFilters[K]) => {
    this.setState((prev) => ({
      pendingFilters: { ...prev.pendingFilters, [key]: value },
    }));
  };

  private renderSearchBar() {
    const { search } = this.state;
    const count = this.activeFilterCount;

    return (
      <div className="flex gap-2 px-4 pb-3">

        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => this.setState({ search: e.target.value })}
            placeholder="Cari nama barang..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-brand-surface-alt text-brand-text text-sm placeholder:text-brand-muted border border-brand-muted/20 focus:outline-none focus:border-brand-accent/50 transition-colors"
          />
          {search && (
            <button onClick={() => this.setState({ search: '' })} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text">
              <X size={14} />
            </button>
          )}
        </div>

        <button
          onClick={this.openFilterSheet}
          className={[
            'relative flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200',
            count > 0 ? 'bg-brand-accent text-brand-bg' : 'bg-brand-surface-alt text-brand-muted hover:text-brand-text',
          ].join(' ')}
        >
          <ListFilter size={14} />
          Filter
          {count > 0 && <span className="w-4 h-4 rounded-full bg-brand-bg text-brand-accent text-[10px] font-bold flex items-center justify-center">{count}</span>}
        </button>
      </div>
    );
  }

  private renderTypeTabs() {
    const { typeFilter } = this.state;
    const tabs: { key: LaporanFilterType; label: string }[] = [
      { key: 'semua', label: 'Semua' },
      { key: 'hilang', label: 'Hilang' },
      { key: 'temuan', label: 'Temuan' },
    ];

    return (
      <div className="flex gap-2 px-4 pb-4 overflow-x-auto scrollbar-none">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => this.setState({ typeFilter: t.key })}
            className={[
              'px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0',
              typeFilter === t.key ? 'bg-brand-accent text-brand-bg' : 'bg-brand-surface-alt text-brand-muted hover:text-brand-text',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </div>
    );
  }

  private renderFilterSheet() {
    const { filterSheetOpen, pendingFilters, kategoriList, lokasiMap } = this.state;
    if (!filterSheetOpen) return null;

    const lokasiEntries = Object.entries(lokasiMap).sort((a, b) => a[1].localeCompare(b[1]));

    return (
      <div className="fixed inset-0 z-[9999] bg-black/60 lg:flex lg:items-center lg:justify-center" onClick={() => this.setState({ filterSheetOpen: false })}>
        <div
          className="fixed bottom-0 left-0 right-0 z-[10000] bg-brand-surface rounded-t-3xl max-w-lg mx-auto max-h-[80vh] flex flex-col lg:static lg:z-auto lg:max-w-none lg:w-[600px] lg:rounded-2xl lg:max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >

          <div className="pt-4 pb-2 flex-shrink-0 lg:hidden">
            <div className="w-10 h-1 bg-brand-muted/30 rounded-full mx-auto" />
          </div>

          <div className="flex items-center justify-between px-6 py-3 flex-shrink-0">
            <p className="text-brand-text font-bold text-base">Filter</p>
            <button onClick={this.resetFilters} className="text-brand-muted text-xs hover:text-brand-text transition-colors">
              Reset
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-4 flex flex-col gap-5">

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-brand-muted text-xs font-semibold tracking-widest uppercase">Tanggal Kejadian</p>
                {(pendingFilters.date_from || pendingFilters.date_to) && (
                  <button
                    onClick={() => {
                      this.setPendingFilter('date_from', '');
                      this.setPendingFilter('date_to', '');
                    }}
                    className="text-xs text-brand-muted hover:text-brand-text transition-colors"
                  >
                    Hapus
                  </button>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-brand-muted text-[10px] font-semibold uppercase tracking-wide">Dari</span>
                  <input
                    type="date"
                    value={pendingFilters.date_from}
                    max={pendingFilters.date_to || undefined}
                    onChange={(e) => this.setPendingFilter('date_from', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-surface-alt text-brand-text text-sm border border-brand-muted/20 focus:outline-none focus:border-brand-accent/50 transition-colors"
                  />
                </div>
                <span className="text-brand-muted text-sm mt-5">–</span>
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-brand-muted text-[10px] font-semibold uppercase tracking-wide">Sampai</span>
                  <input
                    type="date"
                    value={pendingFilters.date_to}
                    min={pendingFilters.date_from || undefined}
                    onChange={(e) => this.setPendingFilter('date_to', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-brand-surface-alt text-brand-text text-sm border border-brand-muted/20 focus:outline-none focus:border-brand-accent/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="text-brand-muted text-xs font-semibold tracking-widest uppercase mb-2">Kategori Barang</p>
              <div className="flex flex-wrap gap-2">
                {kategoriList.map((k) => (
                  <button
                    key={k.id}
                    onClick={() => this.setPendingFilter('kategoriId', pendingFilters.kategoriId === k.id ? '' : k.id)}
                    className={[
                      'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200',
                      pendingFilters.kategoriId === k.id ? 'bg-brand-accent text-brand-bg' : 'bg-brand-surface-alt text-brand-muted hover:text-brand-text',
                    ].join(' ')}
                  >
                    {k.name}
                  </button>
                ))}
              </div>
            </div>

            {lokasiEntries.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-brand-muted text-xs font-semibold tracking-widest uppercase">Lokasi</p>
                  {pendingFilters.lokasiId && (
                    <button onClick={() => this.setPendingFilter('lokasiId', '')} className="text-xs text-brand-muted hover:text-brand-text transition-colors">
                      Hapus
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {lokasiEntries.map(([id, name]) => (
                    <button
                      key={id}
                      onClick={() => this.setPendingFilter('lokasiId', pendingFilters.lokasiId === id ? '' : id)}
                      className={[
                        'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200',
                        pendingFilters.lokasiId === id ? 'bg-brand-accent text-brand-bg' : 'bg-brand-surface-alt text-brand-muted hover:text-brand-text',
                      ].join(' ')}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-brand-muted text-xs font-semibold tracking-widest uppercase mb-2">Status Laporan</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => this.setPendingFilter('status', pendingFilters.status === s.value ? '' : s.value)}
                    className={[
                      'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200',
                      pendingFilters.status === s.value ? `${LaporanService.statusColor(s.value)} ring-1 ring-current` : 'bg-brand-surface-alt text-brand-muted hover:text-brand-text',
                    ].join(' ')}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 pb-8 pt-3 flex-shrink-0 border-t border-white/5">
            <button onClick={this.applyFilters} className="w-full py-4 rounded-2xl bg-brand-accent text-brand-bg font-bold text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all duration-200">
              Terapkan Filter
            </button>
          </div>
        </div>
      </div>
    );
  }

  private renderUpdateSheet() {
    const { sheetLaporan } = this.state;
    if (!sheetLaporan) return null;

    const options = LaporanService.nextStatusOptions(sheetLaporan.status, sheetLaporan.type);

    return (
      <div className="fixed inset-0 z-[9999] bg-black/60 lg:flex lg:items-center lg:justify-center" onClick={() => this.setState({ sheetLaporan: null })}>
        <div className="fixed bottom-0 left-0 right-0 z-[10000] bg-brand-surface rounded-t-3xl p-6 pb-10 lg:pb-6 max-w-lg mx-auto lg:static lg:z-auto lg:max-w-none lg:w-[500px] lg:rounded-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="w-10 h-1 bg-brand-muted/30 rounded-full mx-auto mb-5 lg:hidden" />
          <p className="text-brand-text font-bold text-base mb-1">{sheetLaporan.barang.name}</p>
          <p className="text-brand-muted text-xs mb-5">Pilih status baru untuk laporan ini</p>
          <div className="flex flex-col gap-3">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => this.handleUpdateStatus(opt.value)}
                className="w-full py-3.5 rounded-2xl bg-brand-surface-alt text-brand-text text-sm font-semibold hover:brightness-110 active:scale-[0.98] transition-all duration-200"
              >
                {opt.label}
              </button>
            ))}
            <button onClick={() => this.setState({ sheetLaporan: null })} className="w-full py-3.5 rounded-2xl text-brand-muted text-sm font-semibold hover:text-brand-text transition-colors">
              Batal
            </button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { isLoading, lokasiMap, kategoriMap, updatingId, search, activeFilters } = this.state;
    const filtered = this.getFiltered();
    const hasAnyFilter = search.trim() || activeFilters.date_from || activeFilters.date_to || activeFilters.kategoriId || activeFilters.lokasiId || activeFilters.status;

    return (
      <div className="min-h-screen bg-brand-bg flex flex-col lg:pl-14">
        {this.renderFilterSheet()}
        {this.renderUpdateSheet()}

        <div className="w-full max-w-3xl mx-auto flex flex-col flex-1">

          <div className="px-5 pt-5 pb-3 lg:pt-8">
            <h1 className="text-brand-text font-bold text-lg lg:text-2xl">Semua Laporan</h1>
            <p className="text-brand-muted text-xs mt-0.5">Feed laporan hilang & temuan</p>
          </div>

          {this.renderSearchBar()}

          {this.renderTypeTabs()}

          <div className="flex-1 px-4 pb-24">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <LoadingSpinner />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                {hasAnyFilter ? <SearchX size={40} className="text-brand-muted" /> : <Inbox size={40} className="text-brand-muted" />}
                <div>
                  <p className="text-brand-text text-sm font-semibold">{hasAnyFilter ? 'Tidak ada hasil' : 'Belum ada laporan'}</p>
                  <p className="text-brand-muted text-xs mt-0.5">{hasAnyFilter ? 'Coba ubah filter atau kata kunci pencarian' : 'Semua laporan akan muncul di sini'}</p>
                </div>
                {hasAnyFilter && (
                  <button onClick={this.resetFilters} className="mt-1 px-4 py-2 rounded-xl bg-brand-surface-alt text-brand-text text-xs font-semibold hover:brightness-110 transition-all">
                    Reset filter
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <p className="text-brand-muted text-xs mb-1">{filtered.length} laporan ditemukan</p>
                {filtered.map((item) => (
                  <div key={item.id} className="relative">
                    {updatingId === item.id && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/40">
                        <LoadingSpinner size="sm" />
                      </div>
                    )}
                    <LaporanCard laporan={item} lokasiMap={lokasiMap} kategoriMap={kategoriMap} showStatus onClick={this.handleCardClick} />
                    {item.is_owned && LaporanService.canUpdate(item.status) && (
                      <button onClick={() => this.setState({ sheetLaporan: item })} className="absolute top-3 right-3 text-brand-muted hover:text-brand-accent transition-colors" aria-label="Update status">
                        <MoreVertical size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <BottomNavbar />
      </div>
    );
  }
}

export const RiwayatPage = withRouter(RiwayatPageBase);
