import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from '../../router/withRouter';
import type { RouterProps } from '../../router/withRouter';
import { Alert } from '../../utils/alert';

// ── Icon components ──────────────────────────────────────────────────────────

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const LoginIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

const RegisterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="16" y1="11" x2="22" y2="11" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// ── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface State {
  isLoggedIn: boolean;
}

// ── Component ────────────────────────────────────────────────────────────────

class BottomNavbarBase extends React.Component<RouterProps, State> {
  constructor(props: RouterProps) {
    super(props);
    this.state = {
      isLoggedIn: !!localStorage.getItem('access_token'),
    };
  }

  handleLogout = async () => {
    const confirmed = await Alert.confirm('Keluar?', 'Apakah kamu yakin ingin keluar dari akun ini?');
    if (!confirmed) return;

    localStorage.removeItem('access_token');
    this.setState({ isLoggedIn: false });
    this.props.navigate('/login');
  };

  private readonly guestItems: NavItem[] = [
    { path: '/login', label: 'Masuk', icon: <LoginIcon /> },
    { path: '/register', label: 'Daftar', icon: <RegisterIcon /> },
  ];

  private readonly authItems: NavItem[] = [{ path: '/profile', label: 'Profil', icon: <ProfileIcon /> }];

  render() {
    const { location } = this.props;
    const { isLoggedIn } = this.state;
    const currentPath = location.pathname;
    const items = isLoggedIn ? this.authItems : this.guestItems;

    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-brand-lighter shadow-[0_-4px_24px_rgba(121,215,240,0.15)]">
        <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
          {/* Home always visible */}
          <Link to="/" className={`nav-item flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-200 ${currentPath === '/' ? 'text-brand-primary bg-brand-bg' : 'text-gray-400 hover:text-brand-primary'}`}>
            <HomeIcon />
            <span className="text-[10px] font-semibold tracking-wide">Beranda</span>
          </Link>

          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-200 ${currentPath === item.path ? 'text-brand-primary bg-brand-bg' : 'text-gray-400 hover:text-brand-primary'}`}
            >
              {item.icon}
              <span className="text-[10px] font-semibold tracking-wide">{item.label}</span>
            </Link>
          ))}

          {isLoggedIn && (
            <button onClick={this.handleLogout} className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl text-gray-400 hover:text-rose-400 transition-all duration-200">
              <LogoutIcon />
              <span className="text-[10px] font-semibold tracking-wide">Keluar</span>
            </button>
          )}
        </div>
      </nav>
    );
  }
}

export const BottomNavbar = withRouter(BottomNavbarBase);
