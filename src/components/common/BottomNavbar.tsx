import React from 'react';
import { Home, ClipboardList, ScanLine, UserCircle } from 'lucide-react';
import { withRouter } from '../../router/withRouter';
import type { RouterProps } from '../../router/withRouter';
import { LaporBottomSheet } from './LaporBottomSheet';

// ── Types ────────────────────────────────────────────────────────────────────

interface NavTab {
  key: string;
  path?: string;
  label: string;
  icon: React.ReactNode;
}

interface State {
  sheetOpen: boolean;
}

// ── Component ────────────────────────────────────────────────────────────────

class BottomNavbarBase extends React.Component<RouterProps, State> {
  state: State = { sheetOpen: false };

  private readonly tabs: NavTab[] = [
    { key: 'beranda', path: '/', label: 'BERANDA', icon: <Home size={22} /> },
    { key: 'riwayat', path: '/riwayat', label: 'RIWAYAT', icon: <ClipboardList size={22} /> },
    { key: 'lapor', label: 'LAPOR', icon: <ScanLine size={22} /> },
    { key: 'profile', path: '/profile', label: 'PROFIL', icon: <UserCircle size={22} /> },
  ];

  private handleNav = (tab: NavTab) => {
    if (tab.key === 'lapor') {
      this.setState({ sheetOpen: true });
      return;
    }
    if (tab.path) this.props.navigate(tab.path);
  };

  private handleSheetClose = () => this.setState({ sheetOpen: false });

  private handleSelectHilang = () => {
    this.setState({ sheetOpen: false });
    this.props.navigate('/lapor?mode=hilang');
  };

  private handleSelectTemuan = () => {
    this.setState({ sheetOpen: false });
    this.props.navigate('/lapor?mode=temuan');
  };

  render() {
    const currentPath = this.props.location.pathname;
    const { sheetOpen } = this.state;

    return (
      <>
        <LaporBottomSheet
          isOpen={sheetOpen}
          onClose={this.handleSheetClose}
          onSelectHilang={this.handleSelectHilang}
          onSelectTemuan={this.handleSelectTemuan}
        />

        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-brand-surface border-t border-white/5">
          <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
            {this.tabs.map((tab) => {
              const isActive = tab.path
                ? tab.path === '/'
                  ? currentPath === '/'
                  : currentPath === tab.path || currentPath.startsWith(tab.path + '/') || currentPath.startsWith(tab.path + '?')
                : false;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => this.handleNav(tab)}
                  className="flex flex-col items-center gap-0.5 px-3 py-2"
                >
                  <span className={`transition-colors duration-200 ${isActive ? 'text-brand-accent' : 'text-brand-muted'}`}>
                    {tab.icon}
                  </span>
                  <span className={`text-[9px] font-bold tracking-widest transition-colors duration-200 ${isActive ? 'text-brand-accent' : 'text-brand-muted'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </>
    );
  }
}

export const BottomNavbar = withRouter(BottomNavbarBase);
