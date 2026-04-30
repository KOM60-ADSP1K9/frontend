import React from 'react';
import { Home, ClipboardList, ScanLine, UserCircle } from 'lucide-react';
import { withRouter } from '../../router/withRouter';
import type { RouterProps } from '../../router/withRouter';

// ── Types ────────────────────────────────────────────────────────────────────

interface NavTab {
  path: string;
  label: string;
  icon: React.ReactNode;
  special?: boolean;
}

// ── Component ────────────────────────────────────────────────────────────────

class BottomNavbarBase extends React.Component<RouterProps> {
  private readonly tabs: NavTab[] = [
    { path: '/', label: 'BERANDA', icon: <Home size={22} /> },
    { path: '/riwayat', label: 'RIWAYAT', icon: <ClipboardList size={22} /> },
    { path: '/lapor', label: 'LAPOR', icon: <ScanLine size={22} /> },
    { path: '/profile', label: 'PROFIL', icon: <UserCircle size={22} /> },
  ];

  private handleNav = (path: string) => {
    this.props.navigate(path);
  };

  render() {
    const currentPath = this.props.location.pathname;

    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-brand-surface border-t border-white/5">
        <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
          {this.tabs.map((tab) => {
            const isActive = currentPath === tab.path;

            if (tab.special) {
              return (
                <button
                  key={tab.path}
                  type="button"
                  onClick={() => this.handleNav(tab.path)}
                  className="flex flex-col items-center gap-0.5 px-3 py-2"
                >
                  <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-colors duration-200 ${isActive ? 'border-brand-accent' : 'border-brand-muted'}`}>
                    {tab.icon}
                  </div>
                  <span className={`text-[9px] font-bold tracking-widest transition-colors duration-200 ${isActive ? 'text-brand-accent' : 'text-brand-muted'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={tab.path}
                type="button"
                onClick={() => this.handleNav(tab.path)}
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
    );
  }
}

export const BottomNavbar = withRouter(BottomNavbarBase);
