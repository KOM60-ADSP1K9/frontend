import React from 'react';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export class LoadingSpinner extends React.Component<Props> {
  static defaultProps: Props = { size: 'md' };

  private readonly sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
  };

  render() {
    const { size = 'md', className = '' } = this.props;
    return <span role="status" aria-label="Memuat..." className={`inline-block rounded-full border-brand-light border-t-brand-primary animate-spin ${this.sizeMap[size]} ${className}`} />;
  }
}
