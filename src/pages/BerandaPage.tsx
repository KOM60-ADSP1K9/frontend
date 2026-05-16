import React from 'react';
import { Megaphone, CheckCircle, Search, History, Inbox } from 'lucide-react';
import { withRouter } from '../router/withRouter';
import type { RouterProps } from '../router/withRouter';
import { BottomNavbar } from '../components/common/BottomNavbar';
import { LaporanCard } from '../components/report/LaporanCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { HomepageApi } from '../api/HomepageApi';
import { LokasiApi } from '../api/LokasiApi';
import { AuthApi } from '../api/AuthApi';
import { Toast } from '../utils/toast';
import type { HomepageLaporanItem, LaporanType } from '../types/report.types';
import type { User } from '../types/auth.types';

type TypeFilter = 'semua' | LaporanType;

// ── Date helpers ───────────────────────────────────────────────────────────

const DAY_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function toLocalDateStr(date: Date): string {
  return date.toLocaleDateString('sv-SE'); // yyyy-mm-dd
}

function buildDateStrip(): { label: string; dayNum: number; dateStr: string }[] {
  const days: { label: string; dayNum: number; dateStr: string }[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({
      label: DAY_SHORT[d.getDay()],
      dayNum: d.getDate(),
      dateStr: toLocalDateStr(d),
    });
  }
  return days;
}

// ── State ──────────────────────────────────────────────────────────────────

interface State {
  user: User | null;
  allLaporan: HomepageLaporanItem[];
  lokasiMap: Record<string, string>;
  isLoading: boolean;
  selectedDate: string;
  typeFilter: TypeFilter;
}

// ── Icons ──────────────────────────────────────────────────────────────────

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

// ── Component ──────────────────────────────────────────────────────────────

const DATE_STRIP = buildDateStrip();
const TODAY_STR = toLocalDateStr(new Date());

class BerandaPageBase extends React.Component<RouterProps, State> {
  state: State = {
    user: null,
    allLaporan: [],
    lokasiMap: {},
    isLoading: true,
    selectedDate: TODAY_STR,
    typeFilter: 'semua',
  };

  async componentDidMount() {
    const [userRes, lokasiRes, laporanRes] = await Promise.allSettled([
      AuthApi.me(),
      LokasiApi.getAll(),
      HomepageApi.getAllLaporan({ limit: 100 }),
    ]);

    const nextState: Partial<State> = { isLoading: false };

    if (userRes.status === 'fulfilled' && userRes.value.status === 'success') {
      nextState.user = userRes.value.data;
    }

    if (lokasiRes.status === 'fulfilled' && lokasiRes.value.status === 'success') {
      const map: Record<string, string> = {};
      lokasiRes.value.data.forEach((l) => { map[l.id] = l.name; });
      nextState.lokasiMap = map;
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

  private getFilteredLaporan(): HomepageLaporanItem[] {
    const { allLaporan, selectedDate, typeFilter } = this.state;
    let list = allLaporan;
    if (typeFilter !== 'semua') list = list.filter((l) => l.type === typeFilter);
    return list.filter((l) => {
      const eventDate = l.type === 'hilang' ? l.lost_at_date : l.found_at_date;
      return eventDate === selectedDate;
    });
  }

  private handleTypeFilter = (typeFilter: TypeFilter) => {
    this.setState({ typeFilter, selectedDate: TODAY_STR });
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
          <div className="w-11 h-11 rounded-full bg-rose-700 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
            {user ? this.getInitial(user) : '?'}
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">
              {user ? this.getDisplayName(user) : '...'}
            </p>
            <p className="text-brand-muted text-xs mt-0.5">
              {user ? this.getSubtitle(user) : ''}
            </p>
          </div>
        </div>
        <button className="text-brand-muted hover:text-white transition-colors relative">
          <BellIcon />
        </button>
      </div>
    );
  }

  private renderQuickActions() {
    const actions: { label: string; icon: React.ReactNode; bg: string; iconColor: string; onClick: () => void }[] = [
      {
        label: 'Lapor Hilang',
        icon: <Megaphone size={22} />,
        bg: 'bg-rose-900/70',
        iconColor: 'text-rose-300',
        onClick: () => this.props.navigate('/lapor?mode=hilang'),
      },
      {
        label: 'Lapor Temuan',
        icon: <CheckCircle size={22} />,
        bg: 'bg-emerald-900/70',
        iconColor: 'text-emerald-300',
        onClick: () => this.props.navigate('/lapor?mode=temuan'),
      },
      {
        label: 'Cari Barang',
        icon: <Search size={22} />,
        bg: 'bg-sky-900/70',
        iconColor: 'text-sky-300',
        onClick: () => this.props.navigate('/riwayat'),
      },
      {
        label: 'Riwayat',
        icon: <History size={22} />,
        bg: 'bg-violet-900/70',
        iconColor: 'text-violet-300',
        onClick: () => this.props.navigate('/laporan-saya'),
      },
    ];

    return (
      <div className="mx-4 mb-4 p-4 rounded-2xl bg-brand-surface-alt">
        <div className="grid grid-cols-4 gap-2">
          {actions.map((a) => (
            <button
              key={a.label}
              onClick={a.onClick}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`w-12 h-12 rounded-2xl ${a.bg} ${a.iconColor} flex items-center justify-center group-hover:brightness-125 transition-all duration-200`}>
                {a.icon}
              </div>
              <span className="text-brand-muted text-[10px] font-medium text-center leading-tight">
                {a.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  private renderTypeFilter() {
    const { typeFilter } = this.state;
    const tabs: { key: TypeFilter; label: string }[] = [
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
            className={[
              'px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex-shrink-0',
              typeFilter === t.key
                ? 'bg-brand-accent text-brand-bg'
                : 'bg-brand-surface-alt text-brand-muted hover:text-white',
            ].join(' ')}
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
      <div className="flex gap-1.5 px-4 pb-4 overflow-x-auto scrollbar-none">
        {DATE_STRIP.map((d) => {
          const isActive = d.dateStr === selectedDate;
          return (
            <button
              key={d.dateStr}
              onClick={() => this.handleDateSelect(d.dateStr)}
              className={[
                'flex flex-col items-center gap-0.5 px-3.5 py-2.5 rounded-xl flex-shrink-0 transition-all duration-200',
                isActive
                  ? 'bg-brand-accent text-brand-bg'
                  : 'bg-brand-surface-alt text-brand-muted hover:text-white',
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
    const { isLoading, lokasiMap, selectedDate } = this.state;
    const filtered = this.getFilteredLaporan();

    const sectionTitle = selectedDate === TODAY_STR ? 'Laporan Terbaru' : `Laporan ${selectedDate}`;

    return (
      <div className="min-h-screen bg-brand-bg flex flex-col">
        {/* Header */}
        {this.renderHeader()}

        {/* Quick actions */}
        {this.renderQuickActions()}

        {/* Type filter */}
        {this.renderTypeFilter()}

        {/* Date strip */}
        {this.renderDateStrip()}

        {/* List section */}
        <div className="flex-1 px-4 pb-24">
          <div className="mb-3">
            <h2 className="text-white font-bold text-base">{sectionTitle}</h2>
          </div>

          {isLoading ? (
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
            <div className="flex flex-col gap-2.5 max-w-lg mx-auto">
              {filtered.map((item) => (
                <LaporanCard
                  key={item.id}
                  laporan={item}
                  lokasiMap={lokasiMap}
                  showStatus
                  onClick={(l) => this.props.navigate(`/laporan/${l.id}`, { state: { laporan: l } })}
                />
              ))}
            </div>
          )}
        </div>

        <BottomNavbar />
      </div>
    );
  }
}

export const BerandaPage = withRouter(BerandaPageBase);
