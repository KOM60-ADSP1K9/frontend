import React from 'react';
import { withRouter } from '../router/withRouter';
import type { RouterProps } from '../router/withRouter';
import { AuthApi } from '../api/AuthApi';
import { Toast } from '../utils/toast';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { BottomNavbar } from '../components/common/BottomNavbar';
import { MenuCard } from '../components/common/MenuCard';
import type { User } from '../types/auth.types';

// ── Types ────────────────────────────────────────────────────────────────────

interface State {
  user: User | null;
  isLoading: boolean;
}

// ── Icons ────────────────────────────────────────────────────────────────────

class ReportIcon extends React.Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    );
  }
}

class ClaimIcon extends React.Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    );
  }
}

class BellIcon extends React.Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    );
  }
}

class SettingsIcon extends React.Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }
}

// ── Main component ────────────────────────────────────────────────────────────

class ProfilePageBase extends React.Component<RouterProps, State> {
  state: State = { user: null, isLoading: true };

  async componentDidMount() {
    try {
      const res = await AuthApi.me();
      if (res.status !== 'success') {
        Toast.error('Sesi berakhir, silakan masuk kembali.');
        localStorage.removeItem('access_token');
        this.props.navigate('/login');
        return;
      }
      this.setState({ user: res.data, isLoading: false });
    } catch {
      Toast.error('Sesi berakhir, silakan masuk kembali.');
      localStorage.removeItem('access_token');
      this.props.navigate('/login');
    }
  }

  private getInitial(user: User): string {
    if (user.nim) return user.nim[0].toUpperCase();
    return user.email[0].toUpperCase();
  }

  private getDisplayName(user: User): string {
    return user.email.split('@')[0];
  }

  private getSubtitle(user: User): string {
    const parts: string[] = [];
    if (user.nim) parts.push(user.nim);
    if (user.departemen) parts.push(user.departemen.toUpperCase());
    return parts.join(' · ');
  }

  render() {
    const { user, isLoading } = this.state;

    if (isLoading) {
      return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    if (!user) return null;

    return (
      <div className="min-h-screen bg-brand-bg flex flex-col">
        <main className="flex-1 px-5 pt-12 pb-24 max-w-lg mx-auto w-full">
          {/* Title */}
          <h1 className="text-base font-semibold text-white mb-6">Profile</h1>

          {/* Avatar + identity */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-red-800 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
              {this.getInitial(user)}
            </div>
            <h2 className="text-xl font-bold text-white">{this.getDisplayName(user)}</h2>
            <p className="text-sm text-brand-muted mt-1">{this.getSubtitle(user)}</p>
          </div>

          {/* Menu */}
          <div className="flex flex-col gap-3">
            <MenuCard
              icon={<ReportIcon />}
              title="Laporan saya"
              onClick={() => this.props.navigate('/riwayat')}
            />
            <MenuCard
              icon={<ClaimIcon />}
              title="Riwayat klaim"
              onClick={() => this.props.navigate('/riwayat')}
            />
            <MenuCard
              icon={<BellIcon />}
              title="Notifikasi"
              onClick={() => this.props.navigate('/notifikasi')}
            />
            <MenuCard
              icon={<SettingsIcon />}
              title="Pengaturan akun"
              onClick={() => this.props.navigate('/pengaturan')}
            />
          </div>
        </main>

        <BottomNavbar />
      </div>
    );
  }
}

export const ProfilePage = withRouter(ProfilePageBase);
