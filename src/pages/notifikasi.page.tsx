import React from 'react';
import { withRouter } from '../router/with.router';
import type { RouterProps } from '../router/with.router';
import { NotificationApi } from '../api/notification.api';
import { LoadingSpinner } from '../components/common/loading.spinner';
import { BottomNavbar } from '../components/common/bottom.navbar';
import type { NotificationItem } from '../types/notification.types';

// ── Date grouping helpers ──────────────────────────────────────────────────

const MONTH_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const DAY_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function toDateKey(iso: string | null): string {
  if (!iso) return 'lainnya';
  return iso.slice(0, 10); // YYYY-MM-DD
}

function groupLabel(dateKey: string): string {
  const today = new Date().toLocaleDateString('sv-SE');
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('sv-SE');
  if (dateKey === today) return 'Hari Ini';
  if (dateKey === yesterday) return 'Kemarin';
  if (dateKey === 'lainnya') return 'Lainnya';
  const d = new Date(dateKey + 'T00:00:00');
  return `${DAY_ID[d.getDay()]}, ${d.getDate()} ${MONTH_ID[d.getMonth()]} ${d.getFullYear()}`;
}

function timeAgo(iso: string | null): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins} mnt lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
}

function groupNotifications(notifications: NotificationItem[]): { label: string; items: NotificationItem[] }[] {
  const map = new Map<string, NotificationItem[]>();
  for (const n of notifications) {
    const key = toDateKey(n.created_at);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(n);
  }
  return Array.from(map.entries()).map(([key, items]) => ({ label: groupLabel(key), items }));
}

function typeIcon(type: NotificationItem['type']) {
  if (type === 'inquiry_received') {
    return (
      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
}

// ── State ──────────────────────────────────────────────────────────────────

interface State {
  notifications: NotificationItem[];
  isLoading: boolean;
  isMarkingAll: boolean;
}

// ── Component ──────────────────────────────────────────────────────────────

class NotifikasiPageBase extends React.Component<RouterProps, State> {
  state: State = {
    notifications: [],
    isLoading: true,
    isMarkingAll: false,
  };

  async componentDidMount() {
    try {
      const res = await NotificationApi.getAll();
      if (res.status === 'success') {
        this.setState({ notifications: res.data.notifications });
      }
    } catch { /* silently fail */ } finally {
      this.setState({ isLoading: false });
    }
  }

  private handleItemClick = async (item: NotificationItem) => {
    if (!item.is_read) {
      this.setState((prev) => ({
        notifications: prev.notifications.map((n) =>
          n.id === item.id ? { ...n, is_read: true } : n,
        ),
      }));
      NotificationApi.markRead(item.id).catch(() => {});
    }
    if (item.laporan_id) {
      this.props.navigate(`/laporan/${item.laporan_id}`);
    }
  };

  private handleMarkAllRead = async () => {
    const unread = this.state.notifications.filter((n) => !n.is_read);
    if (unread.length === 0) return;

    this.setState((prev) => ({
      isMarkingAll: true,
      notifications: prev.notifications.map((n) => ({ ...n, is_read: true })),
    }));

    await Promise.allSettled(unread.map((n) => NotificationApi.markRead(n.id)));
    this.setState({ isMarkingAll: false });
  };

  render() {
    const { notifications, isLoading, isMarkingAll } = this.state;
    const hasUnread = notifications.some((n) => !n.is_read);
    const groups = groupNotifications(notifications);

    return (
      <div className="min-h-screen bg-brand-bg flex flex-col lg:pl-14">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-5 pb-4 lg:px-8 lg:pt-8 lg:max-w-2xl lg:mx-auto lg:w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => this.props.navigate(-1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-brand-surface-alt text-brand-muted hover:text-brand-text transition-colors"
              aria-label="Kembali"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h1 className="text-brand-text font-bold text-base lg:text-xl">Notifikasi</h1>
          </div>

          {hasUnread && (
            <button
              onClick={this.handleMarkAllRead}
              disabled={isMarkingAll}
              className="text-xs text-brand-accent font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              Tandai semua terbaca
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 lg:max-w-2xl lg:mx-auto lg:w-full">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-brand-surface-alt flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-muted">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <div>
                <p className="text-brand-text font-semibold text-sm">Belum ada notifikasi</p>
                <p className="text-brand-muted text-xs mt-1">Notifikasi akan muncul saat ada activity baru</p>
              </div>
            </div>
          ) : (
            <div className="pb-24 lg:pb-8">
              {groups.map((group) => (
                <div key={group.label}>
                  {/* Date group header */}
                  <p className="text-brand-muted text-xs font-semibold tracking-widest uppercase px-4 py-3 lg:px-8">
                    {group.label}
                  </p>

                  {/* Items */}
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => this.handleItemClick(item)}
                      className={[
                        'w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors duration-150 lg:px-8',
                        !item.is_read ? 'bg-brand-accent/5 hover:bg-brand-accent/10' : 'hover:bg-brand-surface-alt/50',
                      ].join(' ')}
                    >
                      {typeIcon(item.type)}

                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug ${!item.is_read ? 'text-brand-text font-semibold' : 'text-brand-text font-medium'}`}>
                          {item.title}
                        </p>
                        <p className="text-brand-muted text-xs mt-0.5 leading-snug line-clamp-2">
                          {item.message}
                        </p>
                        <p className="text-brand-muted text-[10px] mt-1.5">
                          {timeAgo(item.created_at)}
                        </p>
                      </div>

                      {!item.is_read && (
                        <span className="w-2 h-2 rounded-full bg-brand-accent flex-shrink-0 mt-2" />
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <BottomNavbar />
      </div>
    );
  }
}

export const NotifikasiPage = withRouter(NotifikasiPageBase);
