import React from 'react';
import { withRouter } from '../router/withRouter';
import type { RouterProps } from '../router/withRouter';
import { AuthApi } from '../api/AuthApi';
import { Toast } from '../utils/toast';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { BottomNavbar } from '../components/common/BottomNavbar';
import type { User } from '../types/auth.types';

// ── Types ────────────────────────────────────────────────────────────────────

interface State {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// ── Helper: info row ──────────────────────────────────────────────────────────

interface InfoRowProps {
  label: string;
  value: string | null | undefined;
  icon: React.ReactNode;
}

class InfoRow extends React.Component<InfoRowProps> {
  render() {
    const { label, value, icon } = this.props;
    return (
      <div className="flex items-center gap-3 py-3 border-b border-brand-bg last:border-0">
        <span className="text-brand-primary">{icon}</span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
          <p className="text-sm font-medium text-gray-700 truncate">{value ?? <span className="text-gray-300 italic">—</span>}</p>
        </div>
      </div>
    );
  }
}

// ── Main component ────────────────────────────────────────────────────────────

class ProfilePageBase extends React.Component<RouterProps, State> {
  state: State = { user: null, isLoading: true, error: null };

  async componentDidMount() {
    try {
      const res = await AuthApi.me();
      this.setState({ user: res.data, isLoading: false });
    } catch {
      Toast.error('Sesi berakhir, silakan masuk kembali.');
      localStorage.removeItem('access_token');
      this.props.navigate('/login');
    }
  }

  private formatDate(iso: string | null): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  private renderBadge(role: string) {
    const map: Record<string, { label: string; className: string }> = {
      MAHASISWA: {
        label: 'Mahasiswa',
        className: 'bg-brand-lighter text-brand-primary',
      },
      STAFF: { label: 'Staff', className: 'bg-amber-50 text-amber-500' },
      ADMIN: { label: 'Admin', className: 'bg-purple-50 text-purple-500' },
    };
    const cfg = map[role] ?? { label: role, className: 'bg-gray-100 text-gray-500' };
    return <span className={`text-xs font-bold px-3 py-1 rounded-full ${cfg.className}`}>{cfg.label}</span>;
  }

  render() {
    const { user, isLoading, error } = this.state;

    if (isLoading) {
      return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    if (error || !user) {
      return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center px-5">
          <p className="text-gray-400">{error ?? 'Terjadi kesalahan.'}</p>
        </div>
      );
    }

    const initials = user.email.slice(0, 2).toUpperCase();
    const isVerified = !!user.email_verified_at;

    return (
      <div className="min-h-screen bg-brand-bg flex flex-col">
        {/* ── Top gradient strip ──────────────────────────────────────────── */}
        <div className="h-36 bg-gradient-to-br from-brand-primary to-brand-secondary" />

        {/* ── Avatar floating over strip ─────────────────────────────────── */}
        <main className="flex-1 px-5 -mt-16 pb-28 max-w-md mx-auto w-full">
          {/* Avatar card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-brand-primary/10 p-5 mb-4 flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-2xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/30 text-white text-3xl font-extrabold">{initials}</div>

            <div className="text-center">
              <h2 className="text-lg font-extrabold text-gray-800 break-all">{user.email}</h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                {this.renderBadge(user.role)}
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isVerified ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>{isVerified ? '✓ Terverifikasi' : '⚠ Belum diverifikasi'}</span>
              </div>
            </div>
          </div>

          {/* Detail card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-brand-primary/10 p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-1">Informasi Akun</h3>

            <InfoRow
              label="NIM"
              value={user.nim}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
              }
            />
            <InfoRow
              label="Fakultas"
              value={user.fakultas}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              }
            />
            <InfoRow
              label="Departemen"
              value={user.departemen}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              }
            />
            <InfoRow
              label="NIP"
              value={user.nip}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }
            />
            <InfoRow
              label="Email Diverifikasi"
              value={this.formatDate(user.email_verified_at)}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              }
            />
            <InfoRow
              label="Bergabung Sejak"
              value={this.formatDate(user.created_at)}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              }
            />
          </div>
        </main>

        <BottomNavbar />
      </div>
    );
  }
}

export const ProfilePage = withRouter(ProfilePageBase);
