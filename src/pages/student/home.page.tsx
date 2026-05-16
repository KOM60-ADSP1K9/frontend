import React from 'react';
import { Inbox, X } from 'lucide-react';
import { withRouter } from '../../router/with.router';
import type { RouterProps } from '../../router/with.router';
import { BottomNavbar } from '../../components/common/bottom.navbar';
import { LaporanCard } from '../../components/report/report.card';
import { LaporanMap } from '../../components/report/laporan.map';
import { LoadingSpinner } from '../../components/common/loading.spinner';
import { LaporanApi } from '../../api/laporan.api';
import { AuthApi } from '../../api/auth.api';
import { Toast } from '../../utils/toast';
import type { HomepageLaporanItem } from '../../types/report.types';
import type { User } from '../../types/auth.types';
import type { LaporanFilterType } from '../../types/ui.types';

const DAY_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const DAY_FULL = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MONTH_FULL = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${DAY_FULL[d.getDay()]}, ${d.getDate()} ${MONTH_FULL[d.getMonth()]} ${d.getFullYear()}`;
}
const DAYS_BEFORE = 14;
const DAYS_AFTER = 0;

function toLocalDateStr(date: Date): string {
  return date.toLocaleDateString('sv-SE');
}

function buildDateStrip(): { label: string; dayNum: number; dateStr: string }[] {
  const days: { label: string; dayNum: number; dateStr: string }[] = [];
  const today = new Date();
  for (let i = -DAYS_BEFORE; i <= DAYS_AFTER; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      label: DAY_SHORT[d.getDay()],
      dayNum: d.getDate(),
      dateStr: toLocalDateStr(d),
    });
  }
  return days;
}

interface State {
  user: User | null;
  allLaporan: HomepageLaporanItem[];
  isLoading: boolean;
  selectedDate: string;
  typeFilter: LaporanFilterType;
  selectedLocationLaporan: HomepageLaporanItem[] | null;
}

class BellIcon extends React.Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    );
  }
}

const DATE_STRIP = buildDateStrip();
const TODAY_STR = toLocalDateStr(new Date());

// date_from = 15 days ago, date_to = 15 days from now
function getWindowBounds(): { date_from: string; date_to: string } {
  const today = new Date();
  const from = new Date(today);
  from.setDate(today.getDate() - DAYS_BEFORE);
  const to = new Date(today);
  to.setDate(today.getDate() + DAYS_AFTER);
  return { date_from: toLocalDateStr(from), date_to: toLocalDateStr(to) };
}

class BerandaPageBase extends React.Component<RouterProps, State> {
  private todayBtnRef = React.createRef<HTMLButtonElement>();
  private dateStripRef = React.createRef<HTMLDivElement>();

  state: State = {
    user: null,
    allLaporan: [],
    isLoading: true,
    selectedDate: TODAY_STR,
    typeFilter: 'semua',
    selectedLocationLaporan: null,
  };

  async componentDidMount() {
    // Scroll to today immediately — the date strip is rendered on first mount
    requestAnimationFrame(() => this.scrollToToday('auto'));

    const { date_from, date_to } = getWindowBounds();

    const [userRes, laporanRes] = await Promise.allSettled([AuthApi.me(), LaporanApi.getAllLaporan({ limit: 200, date_from, date_to })]);

    const nextState: Partial<State> = { isLoading: false };

    if (userRes.status === 'fulfilled' && userRes.value.status === 'success') {
      nextState.user = userRes.value.data;
    }

    if (laporanRes.status === 'fulfilled' && laporanRes.value.status === 'success') {
      const sorted = [...laporanRes.value.data].sort((a, b) => {
        return new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime();
      });
      nextState.allLaporan = sorted;
    } else {
      Toast.error('Gagal memuat laporan');
    }

    this.setState(nextState as State);
  }

  private scrollToToday(behavior: ScrollBehavior = 'auto') {
    const container = this.dateStripRef.current;
    const btn = this.todayBtnRef.current;
    if (!container || !btn) return;
    // Today's right edge flush with the container's right edge (+ 16px strip padding)
    const scrollLeft = btn.offsetLeft + btn.offsetWidth - container.clientWidth + 16;
    container.scrollTo({ left: Math.max(0, scrollLeft), behavior });
  }

  private getFilteredLaporan(): HomepageLaporanItem[] {
    const { allLaporan, selectedDate, typeFilter } = this.state;
    let list = allLaporan;
    if (typeFilter !== 'semua') list = list.filter((l) => l.type === typeFilter);
    return list.filter((l) => {
      const eventDate = l.type === 'hilang' ? l.lost_at_date : l.found_at_date;
      return eventDate === selectedDate;
    });
  }

  private handleTypeFilter = (typeFilter: LaporanFilterType) => {
    this.setState({ typeFilter, selectedDate: TODAY_STR }, () => {
      this.scrollToToday('smooth');
    });
  };

  private handleDateSelect = (dateStr: string) => {
    this.setState({ selectedDate: dateStr });
  };

  private getInitial(user: User): string {
    return (user.nim ?? user.email)[0].toUpperCase();
  }

  private getDisplayName(user: User): string {
    return user.email.split('@')[0];
  }

  private getSubtitle(user: User): string {
    const parts: string[] = [];
    if (user.nim) parts.push(user.nim);
    if (user.departemen) parts.push(user.departemen);
    return parts.join(' · ');
  }

  private renderHeader() {
    const { user } = this.state;
    return (
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-rose-700 flex items-center justify-center text-white font-bold text-base flex-shrink-0">{user ? this.getInitial(user) : '?'}</div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">{user ? this.getDisplayName(user) : '...'}</p>
            <p className="text-brand-muted text-xs mt-0.5">{user ? this.getSubtitle(user) : ''}</p>
          </div>
        </div>
        <button className="text-brand-muted hover:text-white transition-colors relative">
          <BellIcon />
        </button>
      </div>
    );
  }

  private getMapLaporan(): HomepageLaporanItem[] {
    const { allLaporan, typeFilter } = this.state;
    if (typeFilter === 'semua') return allLaporan;
    return allLaporan.filter((l) => l.type === typeFilter);
  }

  private handleMapMarkerClick = (items: HomepageLaporanItem[]) => {
    this.setState({ selectedLocationLaporan: items });
  };

  private handlePanelClose = () => {
    this.setState({ selectedLocationLaporan: null });
  };

  private renderLocationPanel() {
    const { selectedLocationLaporan } = this.state;
    if (!selectedLocationLaporan) return null;

    const first = selectedLocationLaporan[0];
    const loc = first?.type === 'hilang' ? first?.lost_at_location : first?.found_at_location;

    return (
      <div className="fixed inset-0 z-40 bg-black/50 lg:flex lg:items-center lg:justify-center" onClick={this.handlePanelClose}>
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-brand-bg rounded-t-3xl max-h-[60vh] flex flex-col shadow-xl lg:static lg:z-auto lg:w-[520px] lg:rounded-2xl lg:max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-center pt-3 pb-1 lg:hidden">
            <div className="w-10 h-1 rounded-full bg-brand-muted/40" />
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="text-white font-semibold text-sm">{loc?.name ?? 'Lokasi'}</p>
              <p className="text-brand-muted text-xs">{selectedLocationLaporan.length} laporan</p>
            </div>
            <button onClick={this.handlePanelClose} className="text-brand-muted hover:text-white p-1">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-8 flex flex-col gap-2.5">
            {selectedLocationLaporan.map((item) => (
              <LaporanCard
                key={item.id}
                laporan={item}
                showStatus
                onClick={(l) => {
                  this.setState({ selectedLocationLaporan: null });
                  this.props.navigate(`/laporan/${l.id}`, { state: { laporan: l } });
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  private renderMap() {
    return (
      <div>
        <div className="mx-4 mb-1 rounded-2xl overflow-hidden" style={{ height: 220 }}>
          <LaporanMap laporan={this.getMapLaporan()} onMarkerClick={this.handleMapMarkerClick} />
        </div>
        <p className="text-brand-muted text-[12px] px-5 mb-3">Menampilkan laporan 2 minggu terakhir</p>
      </div>
    );
  }

  private renderTypeFilter() {
    const { typeFilter } = this.state;
    const tabs: { key: LaporanFilterType; label: string }[] = [
      { key: 'semua', label: 'Semua' },
      { key: 'hilang', label: 'Hilang' },
      { key: 'temuan', label: 'Temuan' },
    ];
    return (
      <div className="flex gap-2 px-4 pb-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => this.handleTypeFilter(t.key)}
            className={['px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex-shrink-0', typeFilter === t.key ? 'bg-brand-accent text-brand-bg' : 'bg-brand-surface-alt text-brand-muted hover:text-white'].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </div>
    );
  }

  private renderDateStrip() {
    const { selectedDate } = this.state;

    return (
      <div ref={this.dateStripRef} className="flex gap-1.5 px-4 pb-4 overflow-x-auto scrollbar-none">
        {DATE_STRIP.map((d) => {
          const isToday = d.dateStr === TODAY_STR;
          const isActive = d.dateStr === selectedDate;
          return (
            <button
              key={d.dateStr}
              ref={isToday ? this.todayBtnRef : undefined}
              onClick={() => this.handleDateSelect(d.dateStr)}
              className={[
                'flex flex-col items-center gap-0.5 w-14 py-2.5 rounded-xl flex-shrink-0 transition-all duration-200',
                isActive ? 'bg-brand-accent text-brand-bg' : isToday ? 'bg-brand-surface-alt text-white ring-1 ring-brand-accent/50' : 'bg-brand-surface-alt text-brand-muted hover:text-white',
              ].join(' ')}
            >
              <span className="text-[10px] font-semibold tracking-wide">{d.label}</span>
              <span className="text-base font-bold">{d.dayNum}</span>
            </button>
          );
        })}
      </div>
    );
  }

  render() {
    const { isLoading, selectedDate } = this.state;
    const filtered = this.getFilteredLaporan();
    const sectionTitle = selectedDate === TODAY_STR ? 'Laporan Terbaru' : `Laporan ${formatDisplayDate(selectedDate)}`;

    const laporanListContent = isLoading ? (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    ) : filtered.length === 0 ? (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <Inbox size={36} className="text-brand-muted" />
        <div>
          <p className="text-white text-sm font-semibold">Tidak ada laporan</p>
          <p className="text-brand-muted text-xs mt-0.5">Tidak ada laporan pada tanggal ini</p>
        </div>
      </div>
    ) : (
      <div className="flex flex-col gap-2.5">
        {filtered.map((item) => (
          <LaporanCard key={item.id} laporan={item} showStatus onClick={(l) => this.props.navigate(`/laporan/${l.id}`, { state: { laporan: l } })} />
        ))}
      </div>
    );

    return (
      <div className="bg-brand-bg">
        {/* ── Mobile layout ───────────────────────────────────── */}
        <div className="flex flex-col min-h-screen lg:hidden">
          {this.renderHeader()}
          {this.renderMap()}
          {this.renderTypeFilter()}
          {this.renderDateStrip()}
          <div className="flex-1 px-4 pb-24">
            <div className="mb-3">
              <h2 className="text-white font-bold text-base">{sectionTitle}</h2>
            </div>
            {laporanListContent}
          </div>
        </div>

        {/* ── Desktop layout ──────────────────────────────────── */}
        <div className="hidden lg:flex pl-14 min-h-screen">
          {/* Left: scrollable main content */}
          <div className="flex-1 flex flex-col h-screen overflow-y-auto">
            {this.renderHeader()}
            <div className="flex items-center justify-between px-5 mb-3">
              <h2 className="text-white font-bold text-lg">{sectionTitle}</h2>
              <button onClick={() => this.props.navigate('/laporan')} className="text-brand-accent text-sm font-semibold hover:underline">
                Lihat Semua ›
              </button>
            </div>
            {this.renderTypeFilter()}
            {this.renderDateStrip()}
            <div className="flex-1 px-5 pb-6">{laporanListContent}</div>
          </div>

          {/* Right: sticky map panel */}
          <div className="w-88 flex-shrink-0 border-l border-white/5 sticky top-0 h-screen">
            <div className="px-5 pt-5 pb-1">
              <p className="text-white font-semibold text-lg">Peta Laporan 
              <span className="text-brand-muted text-[14px] mt-0.5"> - 2 minggu terakhir</span></p>
            </div>
            <div className="mx-4 rounded-2xl overflow-hidden" style={{ height: 400 }}>
              <LaporanMap laporan={this.getMapLaporan()} onMarkerClick={this.handleMapMarkerClick} />
            </div>
          </div>
        </div>

        <BottomNavbar />
        {this.renderLocationPanel()}
      </div>
    );
  }
}

export const BerandaPage = withRouter(BerandaPageBase);
