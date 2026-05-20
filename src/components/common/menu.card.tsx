import React from 'react';

interface Props {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
}

export class MenuCard extends React.Component<Props> {
  render() {
    const { icon, title, subtitle, onClick } = this.props;
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center gap-4 bg-brand-surface-alt rounded-2xl px-4 py-4 text-left hover:opacity-80 active:scale-[0.98] transition-all duration-200"
      >
        <div className="w-10 h-10 rounded-xl bg-brand-bg flex items-center justify-center flex-shrink-0 text-brand-accent">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-brand-text">{title}</p>
          {subtitle && <p className="text-xs text-brand-muted mt-0.5">{subtitle}</p>}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-muted flex-shrink-0">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    );
  }
}
