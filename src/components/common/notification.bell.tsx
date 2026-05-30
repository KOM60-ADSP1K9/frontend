import React from 'react';
import { NotificationApi } from '../../api/notification.api';

interface Props {
  navigate: (to: string) => void;
}

interface State {
  unreadCount: number;
}

const POLL_INTERVAL_MS = 60_000;

export class NotificationBell extends React.Component<Props, State> {
  state: State = { unreadCount: 0 };

  private pollTimer: ReturnType<typeof setInterval> | null = null;

  async componentDidMount() {
    await this.fetchUnreadCount();
    this.pollTimer = setInterval(this.fetchUnreadCount, POLL_INTERVAL_MS);
  }

  componentWillUnmount() {
    if (this.pollTimer) clearInterval(this.pollTimer);
  }

  private fetchUnreadCount = async () => {
    try {
      const res = await NotificationApi.getAll();
      if (res.status === 'success') {
        this.setState({ unreadCount: res.data.unread_count });
      }
    } catch { /* silently fail */ }
  };

  render() {
    const { unreadCount } = this.state;

    return (
      <button
        onClick={() => this.props.navigate('/notifikasi')}
        className="relative text-brand-muted hover:text-brand-text transition-colors"
        aria-label="Notifikasi"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-accent rounded-full flex items-center justify-center text-[9px] font-bold text-brand-bg">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    );
  }
}
