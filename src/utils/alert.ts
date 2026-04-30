import Swal from 'sweetalert2';

const POPUP_BG = '#BFDBFE';
const POPUP_TEXT = '#000000';
const CONFIRM_COLOR = '#060E20';
const CANCEL_COLOR = '#ef4444';

const BASE_CONFIG = {
  background: POPUP_BG,
  color: POPUP_TEXT,
  confirmButtonColor: CONFIRM_COLOR,
  customClass: { confirmButton: 'swal-confirm-btn', cancelButton: 'swal-cancel-btn' },
};

export class Alert {
  static success(title: string, text?: string) {
    return Swal.fire({
      ...BASE_CONFIG,
      icon: 'success',
      title,
      text,
      timer: 3500,
      timerProgressBar: true,
      showConfirmButton: false,
      confirmButtonColor: CONFIRM_COLOR,
    });
  }

  static error(title: string, text?: string) {
    return Swal.fire({
      ...BASE_CONFIG,
      icon: 'error',
      title,
      text,
      confirmButtonColor: CONFIRM_COLOR,
    });
  }

  static warning(title: string, text?: string) {
    return Swal.fire({
      ...BASE_CONFIG,
      icon: 'warning',
      title,
      text,
    });
  }

  static info(title: string, text?: string) {
    return Swal.fire({
      ...BASE_CONFIG,
      icon: 'info',
      title,
      text,
    });
  }

  static async confirm(title: string, text: string): Promise<boolean> {
    const result = await Swal.fire({
      ...BASE_CONFIG,
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
