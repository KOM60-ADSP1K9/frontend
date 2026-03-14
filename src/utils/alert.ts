import Swal from 'sweetalert2';

const CONFIRM_COLOR = '#79D7F0';

export class Alert {
  static success(title: string, text?: string) {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: CONFIRM_COLOR,
      timer: 3500,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }

  static error(title: string, text?: string) {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: CONFIRM_COLOR,
    });
  }

  static warning(title: string, text?: string) {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonColor: CONFIRM_COLOR,
    });
  }

  static info(title: string, text?: string) {
    return Swal.fire({
      icon: 'info',
      title,
      text,
      confirmButtonColor: CONFIRM_COLOR,
    });
  }

  static async confirm(title: string, text: string): Promise<boolean> {
    const result = await Swal.fire({
      icon: 'question',
      title,
      text,
      showCancelButton: true,
      confirmButtonColor: CONFIRM_COLOR,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
    });
    return result.isConfirmed;
  }
}
