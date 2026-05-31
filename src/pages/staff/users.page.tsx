import React from 'react';
import { Search, Users } from 'lucide-react';
import { withRouter } from '../../router/with.router';
import type { RouterProps } from '../../router/with.router';
import { BottomNavbar } from '../../components/common/bottom.navbar';
import { LoadingSpinner } from '../../components/common/loading.spinner';
import { UserApi } from '../../api/user.api';
import { UserCache } from '../../utils/user.cache';
import { Toast } from '../../utils/toast';
import type { User } from '../../types/auth.types';

type RoleFilter = 'semua' | 'MAHASISWA' | 'STAFF';

interface State {
  users: User[];
  isLoading: boolean;
  search: string;
  roleFilter: RoleFilter;
}

class UsersPageBase extends React.Component<RouterProps, State> {
  state: State = { users: [], isLoading: true, search: '', roleFilter: 'semua' };

  async componentDidMount() {
    if (UserCache.getRole() !== 'STAFF') {
      this.props.navigate('/');
      return;
    }

    const res = await UserApi.getAll();
    if (res.status === 'success') {
      this.setState({ users: res.data, isLoading: false });
    } else {
      Toast.error('Gagal memuat data pengguna');
      this.setState({ isLoading: false });
    }
  }

  private getFiltered(): User[] {
    const { users, search, roleFilter } = this.state;
    return users.filter((u) => {
      const matchRole = roleFilter === 'semua' || u.role === roleFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        u.email.toLowerCase().includes(q) ||
        (u.nim ?? '').toLowerCase().includes(q) ||
        (u.nip ?? '').toLowerCase().includes(q);
      return matchRole && matchSearch;
    });
  }

  private getInitial(user: User): string {
    return user.email[0].toUpperCase();
  }

  private renderCard(user: User) {
    const isMahasiswa = user.role === 'MAHASISWA';
    const sub = isMahasiswa
      ? [user.nim, user.departemen].filter(Boolean).join(' · ')
      : user.supervised_at?.name ?? (user.nip ? `NIP ${user.nip}` : 'Staff');

    return (
      <div key={user.id} className="flex items-center gap-3 p-4 rounded-2xl bg-brand-surface-alt">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${isMahasiswa ? 'bg-sky-700' : 'bg-violet-700'}`}>
          {this.getInitial(user)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-brand-text text-sm font-semibold truncate">{user.email.split('@')[0]}</p>
          <p className="text-brand-muted text-xs truncate">{sub || user.email}</p>
        </div>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${isMahasiswa ? 'bg-sky-500/20 text-sky-400' : 'bg-violet-500/20 text-violet-400'}`}>
          {isMahasiswa ? 'MHS' : 'STAFF'}
        </span>
      </div>
    );
  }

  render() {
    const { isLoading, search, roleFilter } = this.state;
    const filtered = this.getFiltered();

    const tabs: { key: RoleFilter; label: string }[] = [
      { key: 'semua', label: 'Semua' },
      { key: 'MAHASISWA', label: 'Mahasiswa' },
      { key: 'STAFF', label: 'Staff' },
    ];

    return (
      <div className="min-h-screen bg-brand-bg flex flex-col lg:pl-14">
        <main className="flex-1 pb-24 max-w-lg mx-auto w-full px-5 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-bold text-brand-text">Daftar Pengguna</h1>
            {!isLoading && (
              <span className="text-brand-muted text-xs">{filtered.length} pengguna</span>
            )}
          </div>

          <div className="flex items-center gap-2 bg-brand-surface-alt rounded-xl px-3 mb-4">
            <Search size={15} className="text-brand-muted flex-shrink-0" />
            <input
              type="text"
              placeholder="Cari email, NIM, atau NIP..."
              value={search}
              onChange={(e) => this.setState({ search: e.target.value })}
              className="flex-1 bg-transparent py-3 text-sm text-brand-text placeholder:text-brand-muted outline-none"
            />
          </div>

          <div className="flex gap-2 mb-5">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => this.setState({ roleFilter: t.key })}
                className={[
                  'px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200',
                  roleFilter === t.key
                    ? 'bg-brand-accent text-brand-bg'
                    : 'bg-brand-surface-alt text-brand-muted hover:text-brand-text',
                ].join(' ')}
              >
                {t.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Users size={36} className="text-brand-muted" />
              <div>
                <p className="text-brand-text text-sm font-semibold">Tidak ada pengguna</p>
                <p className="text-brand-muted text-xs mt-0.5">Coba ubah filter atau kata kunci</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {filtered.map((u) => this.renderCard(u))}
            </div>
          )}
        </main>

        <BottomNavbar />
      </div>
    );
  }
}

export const UsersPage = withRouter(UsersPageBase);
