import React from 'react';
import { ClipboardList, LogOut, ChevronDown, ChevronUp, User, Mail, Hash, Building2, BookOpen, MapPin, BadgeCheck, Sun, Moon } from 'lucide-react';
import { withRouter } from '../../router/with.router';
import type { RouterProps } from '../../router/with.router';
import { AuthApi } from '../../api/auth.api';
import { Alert } from '../../utils/alert';
import { Toast } from '../../utils/toast';
import { LoadingSpinner } from '../../components/common/loading.spinner';
import { BottomNavbar } from '../../components/common/bottom.navbar';
import { ThemeManager } from '../../utils/theme';
import type { User as UserType } from '../../types/auth.types';

interface State {
  user: UserType | null;
  isLoading: boolean;
  accordionOpen: boolean;
  theme: 'dark' | 'light';
}

class ProfilePageBase extends React.Component<RouterProps, State> {
  state: State = { user: null, isLoading: true, accordionOpen: false, theme: ThemeManager.get() };

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

  private handleLogout = async () => {
    const confirmed = await Alert.confirm('Keluar', 'Yakin ingin keluar dari akun?');
    if (!confirmed) return;
    localStorage.removeItem('access_token');
    this.props.navigate('/login');
  };

  private handleThemeToggle = () => {
    const theme = ThemeManager.toggle();
    this.setState({ theme });
  };

  private getInitial(user: UserType): string {
    return (user.nim ?? user.email)[0].toUpperCase();
  }

  private getDisplayName(user: UserType): string {
    return user.email.split('@')[0];
  }

  private getSubtitle(user: UserType): string {
    if (user.role === 'STAFF') return user.nip ? `NIP ${user.nip}` : 'Staff';
    const parts: string[] = [];
    if (user.nim) parts.push(user.nim);
    if (user.departemen) parts.push(user.departemen);
    return parts.join(' · ');
  }

  private renderInfoRow(icon: React.ReactNode, label: string, value: string | null | undefined, highlight?: boolean) {
    if (!value) return null;
    return (
      <div className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
        <span className="text-brand-muted flex-shrink-0">{icon}</span>
        <span className="text-brand-muted text-sm flex-shrink-0 w-24">{label}</span>
        <span className={`text-sm text-right flex-1 truncate ${highlight ? 'text-emerald-400 font-medium' : 'text-brand-text'}`}>{value}</span>
      </div>
    );
  }

  private renderAccordion(user: UserType) {
    const { accordionOpen } = this.state;
    const isMahasiswa = user.role === 'MAHASISWA';

    return (
      <div className="bg-brand-surface-alt rounded-2xl mb-5 overflow-hidden">
        <button onClick={() => this.setState((prev) => ({ accordionOpen: !prev.accordionOpen }))} className="w-full flex items-center justify-between px-4 py-4 hover:brightness-110 transition-all duration-200">
          <div className="flex items-center gap-2.5">
            <User size={16} className="text-brand-muted" />
            <span className="text-brand-text text-sm font-semibold">Data Diri</span>
          </div>
          {accordionOpen ? <ChevronUp size={16} className="text-brand-muted" /> : <ChevronDown size={16} className="text-brand-muted" />}
        </button>

        {accordionOpen && (
          <div className="px-4 pb-2 border-t border-white/5">
            {this.renderInfoRow(<Mail size={14} />, 'Email', user.email)}
            {isMahasiswa && this.renderInfoRow(<Hash size={14} />, 'NIM', user.nim)}
            {isMahasiswa && this.renderInfoRow(<Building2 size={14} />, 'Fakultas', user.fakultas)}
            {isMahasiswa && this.renderInfoRow(<BookOpen size={14} />, 'Departemen', user.departemen)}
            {!isMahasiswa && this.renderInfoRow(<Hash size={14} />, 'NIP', user.nip)}
            {!isMahasiswa && user.supervised_at && this.renderInfoRow(<MapPin size={14} />, 'Lokasi Tugas', user.supervised_at.name)}
            {this.renderInfoRow(<BadgeCheck size={14} />, 'Status Email', user.email_verified_at ? 'Terverifikasi' : 'Belum Terverifikasi', !!user.email_verified_at)}
          </div>
        )}
      </div>
    );
  }

  private renderMenuButton(icon: React.ReactNode, label: string, onClick: () => void, danger?: boolean) {
    return (
      <button onClick={onClick} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-brand-surface-alt hover:brightness-110 active:scale-[0.99] transition-all duration-200">
        <span className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${danger ? 'bg-rose-500/10 text-rose-400' : 'bg-brand-surface text-brand-muted'}`}>{icon}</span>
        <span className={`text-sm font-semibold flex-1 text-left ${danger ? 'text-rose-400' : 'text-brand-text'}`}>{label}</span>
        <ChevronDown size={14} className="text-brand-muted -rotate-90" />
      </button>
    );
  }

  render() {
    const { user, isLoading, theme } = this.state;

    if (isLoading) {
      return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    if (!user) return null;

    const isMahasiswa = user.role === 'MAHASISWA';

    return (
      <div className="min-h-screen bg-brand-bg flex flex-col">
        <main className="flex-1 px-5 pt-8 pb-24 max-w-lg mx-auto w-full">
          {/* Header */}
          <h1 className="text-lg font-bold text-brand-text mb-6">Profil</h1>

          {/* Avatar + identity */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-red-800 flex items-center justify-center text-white text-3xl font-bold mb-3 shadow-lg">{this.getInitial(user)}</div>
            <h2 className="text-lg font-bold text-brand-text leading-tight">{this.getDisplayName(user)}</h2>
            <p className="text-xs text-brand-muted mt-0.5">{this.getSubtitle(user)}</p>
            <span className={`mt-2 text-[10px] font-bold px-3 py-1 rounded-full tracking-widest ${isMahasiswa ? 'bg-sky-500/20 text-sky-400' : 'bg-violet-500/20 text-violet-400'}`}>{isMahasiswa ? 'MAHASISWA' : 'STAFF'}</span>
          </div>

          {/* Data Diri accordion */}
          {this.renderAccordion(user)}

          {/* Menu */}
          <div className="flex flex-col gap-3">
            {this.renderMenuButton(<ClipboardList size={18} />, 'Laporan saya', () => this.props.navigate('/laporan-saya'))}

            {/* Theme toggle — mobile only (desktop has sidebar toggle) */}
            <button onClick={this.handleThemeToggle} className="lg:hidden w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-brand-surface-alt hover:brightness-110 active:scale-[0.99] transition-all duration-200">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-brand-surface text-brand-muted">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </span>
              <span className="text-sm font-semibold flex-1 text-left text-brand-text">{theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}</span>
              <ChevronDown size={14} className="text-brand-muted -rotate-90" />
            </button>

            {this.renderMenuButton(<LogOut size={18} />, 'Keluar', this.handleLogout, true)}
          </div>
        </main>

        <BottomNavbar />
      </div>
    );
  }
}

export const ProfilePage = withRouter(ProfilePageBase);
