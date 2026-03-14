import toast from 'react-hot-toast';

const BASE_STYLE: React.CSSProperties = {
  fontWeight: '600',
  borderRadius: '12px',
  fontSize: '14px',
};

export class Toast {
  static success(message: string) {
    toast.success(message, {
      style: { ...BASE_STYLE, background: '#79D7F0', color: '#fff' },
      duration: 3000,
    });
  }

  static error(message: string) {
    toast.error(message, {
      style: { ...BASE_STYLE, background: '#ef4444', color: '#fff' },
      duration: 4000,
    });
  }

  static loading(message: string): string {
    return toast.loading(message, {
      style: { ...BASE_STYLE, background: '#92DFF3', color: '#fff' },
    });
  }

  static dismiss(id?: string) {
    toast.dismiss(id);
  }
}
