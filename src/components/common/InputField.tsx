import React from 'react';

interface Props {
  label: string;
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
    const { label, name, type = 'text', value, placeholder, error, required, autoComplete, onChange, rightElement } = this.props;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={name} className="text-sm font-semibold text-gray-600">
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>

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
              'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200',
              'bg-white border placeholder:text-gray-300',
              'focus:ring-2 focus:ring-brand-primary/25',
              error ? 'border-rose-400 focus:border-rose-400' : 'border-brand-light focus:border-brand-primary',
              rightElement ? 'pr-11' : '',
            ].join(' ')}
          />
          {rightElement && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>}
        </div>

        {error && (
          <p className="text-xs text-rose-500 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
      </div>
    );
  }
}
