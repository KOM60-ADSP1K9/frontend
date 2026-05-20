export const ThemeManager = {
  get(): 'dark' | 'light' {
    return (localStorage.getItem('theme') as 'dark' | 'light') ?? 'dark';
  },
  set(theme: 'dark' | 'light'): void {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  },
  toggle(): 'dark' | 'light' {
    const next = this.get() === 'dark' ? 'light' : 'dark';
    this.set(next);
    return next;
  },
  init(): void {
    document.documentElement.setAttribute('data-theme', this.get());
  },
};
