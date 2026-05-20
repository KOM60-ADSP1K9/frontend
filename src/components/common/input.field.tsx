import React from 'react';

interface Props {
  label: string;
  labelRight?: React.ReactNode;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rightElement?: React.ReactNode;
}

export class InputField extends React.Component<Props> {
  render() {
    const { label, labelRight, name, type = 'text', value, placeholder, error, required, autoComplete, onChange, rightElement } = this.props;

    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor={name} className="text-xs font-semibold tracking-widest uppercase text-brand-muted">
            {label}
            {required && <span className="text-rose-400 ml-0.5">*</span>}
          </label>
          {labelRight && <span>{labelRight}</span>}
        </div>

        <div className="relative">
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            placeholder={placeholder}
            autoComplete={autoComplete}
            onChange={onChange}
            className={[
              'w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200',
              'bg-brand-surface-alt text-brand-text placeholder:text-brand-muted',
              'border focus:ring-2',
              error
                ? 'border-rose-500/50 focus:border-rose-500/70 focus:ring-rose-500/10'
                : 'border-brand-muted/20 focus:border-brand-accent/50 focus:ring-brand-accent/10',
              rightElement ? 'pr-11' : '',
            ].join(' ')}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted">
              {rightElement}
            </div>
          )}
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
