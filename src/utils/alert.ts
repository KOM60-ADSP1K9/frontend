import Swal from 'sweetalert2';

const CANCEL_COLOR = '#ef4444';

function baseConfig() {
  const isDark = (document.documentElement.getAttribute('data-theme') ?? 'dark') === 'dark';
  return {
    background: isDark ? '#111625' : '#ffffff',
    color: isDark ? '#ffffff' : '#0f172a',
    confirmButtonColor: isDark ? '#BFDBFE' : '#2563EB',
    customClass: { confirmButton: 'swal-confirm-btn', cancelButton: 'swal-cancel-btn' },
  };
}

export class Alert {
  static success(title: string, text?: string) {
    return Swal.fire({
      ...baseConfig(),
      icon: 'success',
      title,
      text,
      timer: 3500,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }

  static error(title: string, text?: string) {
    return Swal.fire({ ...baseConfig(), icon: 'error', title, text });
  }

  static warning(title: string, text?: string) {
    return Swal.fire({ ...baseConfig(), icon: 'warning', title, text });
  }

  static info(title: string, text?: string) {
    return Swal.fire({ ...baseConfig(), icon: 'info', title, text });
  }

  static async confirm(title: string, text: string): Promise<boolean> {
    const result = await Swal.fire({
      ...baseConfig(),
      icon: 'question',
      title,
      text,
      showCancelButton: true,
      cancelButtonColor: CANCEL_COLOR,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
    });
    return result.isConfirmed;
  }
}
