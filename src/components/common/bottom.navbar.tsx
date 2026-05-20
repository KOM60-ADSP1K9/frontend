import React from 'react';
import { Home, ClipboardList, ScanLine, UserCircle, Sun, Moon } from 'lucide-react';
import { withRouter } from '../../router/with.router';
import type { RouterProps } from '../../router/with.router';
import { LaporBottomSheet } from './lapor.bottom.sheet';
import { ThemeManager } from '../../utils/theme';

interface NavTab {
  key: string;
  path?: string;
  label: string;
  icon: React.ReactNode;
}

interface State {
  sheetOpen: boolean;
  theme: 'dark' | 'light';
}

class BottomNavbarBase extends React.Component<RouterProps, State> {
  state: State = { sheetOpen: false, theme: ThemeManager.get() };

  private readonly allTabs: NavTab[] = [
    { key: 'beranda', path: '/', label: 'BERANDA', icon: <Home size={22} /> },
    { key: 'riwayat', path: '/laporan', label: 'CARI LAPORAN', icon: <ClipboardList size={22} /> },
    { key: 'lapor', label: 'LAPOR', icon: <ScanLine size={22} /> },
    { key: 'profile', path: '/profile', label: 'PROFIL', icon: <UserCircle size={22} /> },
  ];

  private readonly sidebarTopTabs = this.allTabs.filter((t) => t.key !== 'profile');
  private readonly sidebarBottomTabs = this.allTabs.filter((t) => t.key === 'profile');

  private handleNav = (tab: NavTab) => {
    if (tab.key === 'lapor') {
      this.setState({ sheetOpen: true });
      return;
    }
    if (tab.path) this.props.navigate(tab.path);
  };

  private handleThemeToggle = () => {
    const theme = ThemeManager.toggle();
    this.setState({ theme });
  };

  private isTabActive(tab: NavTab): boolean {
    if (!tab.path) return false;
    const { pathname } = this.props.location;
    if (tab.path === '/') return pathname === '/';
    return pathname === tab.path || pathname.startsWith(tab.path + '/') || pathname.startsWith(tab.path + '?');
  }

  private renderBottomBarItem(tab: NavTab) {
    const active = this.isTabActive(tab);
    return (
      <button
        key={tab.key}
        type="button"
        onClick={() => this.handleNav(tab)}
        className="flex flex-col items-center gap-0.5 px-3 py-2"
      >
        <span className={`transition-colors duration-200 ${active ? 'text-brand-accent' : 'text-brand-muted'}`}>
          {tab.icon}
        </span>
        <span className={`text-[9px] font-bold tracking-widest transition-colors duration-200 ${active ? 'text-brand-accent' : 'text-brand-muted'}`}>
          {tab.label}
        </span>
      </button>
    );
  }

  private renderSidebarItem(tab: NavTab) {
    const active = this.isTabActive(tab);
    return (
      <button
        key={tab.key}
        type="button"
        onClick={() => this.handleNav(tab)}
        className={`flex flex-col items-center gap-1 py-3.5 w-full hover:bg-white/5 transition-colors ${active ? 'text-brand-accent' : 'text-brand-muted'}`}
      >
        {tab.icon}
        <span className="text-[7px] font-bold tracking-widest text-center leading-tight px-1">
          {tab.label}
        </span>
      </button>
    );
  }

  render() {
    const { sheetOpen, theme } = this.state;

    return (
      <>
        <LaporBottomSheet
          isOpen={sheetOpen}
          onClose={() => this.setState({ sheetOpen: false })}
          onSelectHilang={() => {
            this.setState({ sheetOpen: false });
            this.props.navigate('/lapor?mode=hilang');
          }}
          onSelectTemuan={() => {
            this.setState({ sheetOpen: false });
            this.props.navigate('/lapor?mode=temuan');
          }}
        />

        {/* Mobile: bottom navigation bar */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-brand-surface border-t border-white/5 lg:hidden">
          <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
            {this.allTabs.map((tab) => this.renderBottomBarItem(tab))}
          </div>
        </nav>

        {/* Desktop: left sidebar */}
        <nav className="hidden lg:flex fixed left-0 top-0 h-full w-14 z-40 bg-brand-surface border-r border-white/5 flex-col items-center py-2">
          <div className="flex flex-col w-full">
            {this.sidebarTopTabs.map((tab) => this.renderSidebarItem(tab))}
          </div>
          <div className="flex flex-col w-full mt-auto">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={this.handleThemeToggle}
              className="flex flex-col items-center gap-1 py-3.5 w-full hover:bg-white/5 transition-colors text-brand-muted"
              title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
            >
              {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
              <span className="text-[7px] font-bold tracking-widest">TEMA</span>
            </button>
            {this.sidebarBottomTabs.map((tab) => this.renderSidebarItem(tab))}
          </div>
        </nav>
      </>
    );
  }
}

export const BottomNavbar = withRouter(BottomNavbarBase);
