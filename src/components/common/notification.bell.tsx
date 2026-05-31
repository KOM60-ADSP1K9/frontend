import React from 'react';
import { Bell } from 'lucide-react';
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
    } catch {  }
  };

  render() {
    const { unreadCount } = this.state;

    return (
      <button
        onClick={() => this.props.navigate('/notifikasi')}
        className="relative text-brand-muted hover:text-brand-text transition-colors"
        aria-label="Notifikasi"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-accent rounded-full flex items-center justify-center text-[9px] font-bold text-brand-bg">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    );
  }
}
