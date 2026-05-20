import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface Props {
  label: string;
  name: string;
  value: string;
  options: Option[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export class SelectField extends React.Component<Props> {
  render() {
    const { label, name, value, options, placeholder = 'Pilih...', error, required, onChange } = this.props;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={name} className="text-xs font-semibold tracking-widest uppercase text-brand-muted">
          {label}
          {required && <span className="text-rose-400 ml-0.5">*</span>}
        </label>

        <div className="relative">
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={[
              'w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 appearance-none',
              'bg-brand-surface-alt border',
              value ? 'text-brand-text' : 'text-brand-muted',
              'focus:ring-2',
              error
                ? 'border-rose-500/50 focus:border-rose-500/70 focus:ring-rose-500/10'
                : 'border-brand-muted/20 focus:border-brand-accent/50 focus:ring-brand-accent/10',
            ].join(' ')}
          >
            <option value="" disabled hidden>{placeholder}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-brand-surface text-brand-text">
                {opt.label}
              </option>
            ))}
          </select>

          {/* Chevron */}
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-400 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
      </div>
    );
  }
}
