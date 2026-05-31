import React from 'react';
import { InquiryApi } from '../../api/inquiry.api';
import { LoadingSpinner } from '../common/loading.spinner';
import { Alert } from '../../utils/alert';
import { Toast } from '../../utils/toast';
import { validateFile } from '../../utils/file.validation';

interface Props {
  laporanId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface State {
  message: string;
  contact: string;
  photoFile: File | null;
  isLoading: boolean;
  errors: { message?: string; contact?: string; photo?: string };
}

export class FoundInquiryForm extends React.Component<Props, State> {
  state: State = {
    message: '',
    contact: '',
    photoFile: null,
    isLoading: false,
    errors: {},
  };

  private photoRef = React.createRef<HTMLInputElement>();

  private handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    const err = validateFile(file);
    if (err) {
      this.setState((prev) => ({ errors: { ...prev.errors, photo: err } }));
      e.target.value = '';
      return;
    }
    this.setState((prev) => ({ photoFile: file, errors: { ...prev.errors, photo: undefined } }));
  };

  private validate(): boolean {
    const { message, contact, photoFile } = this.state;
    const errors: State['errors'] = {};
    if (!message.trim()) errors.message = 'Wajib diisi';
    if (!contact.trim()) errors.contact = 'Wajib diisi';
    if (!photoFile) errors.photo = 'Upload foto temuan';
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  private handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!this.validate()) return;

    const { message, contact, photoFile } = this.state;
    this.setState({ isLoading: true });
    const toastId = Toast.loading('Mengirim laporan temuan...');

    try {
      const res = await InquiryApi.createFoundInquiry({
        laporan_id: this.props.laporanId,
        message_content: message,
        finder_contact: contact,
        photo: photoFile!,
      });
      Toast.dismiss(toastId);
      if (res.status !== 'success') {
        Alert.error('Gagal', res.error);
        this.setState({ isLoading: false });
        return;
      }
      Toast.success('Laporan temuan berhasil dikirim');
      this.props.onSuccess();
    } catch {
      Toast.dismiss(toastId);
      Alert.error('Gagal', 'Terjadi kesalahan. Coba lagi.');
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { message, contact, photoFile, isLoading, errors } = this.state;

    return (
      <form onSubmit={this.handleSubmit} className="flex flex-col gap-4">

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold tracking-widest uppercase text-brand-muted">
            Pesan <span className="text-rose-400">*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => this.setState({ message: e.target.value, errors: { ...errors, message: undefined } })}
            placeholder="Ceritakan di mana dan kapan Anda menemukan barang ini..."
            rows={3}
            className={[
              'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 resize-none',
              'bg-brand-surface-alt border',
              errors.message ? 'border-rose-500/50' : 'border-brand-muted/20 focus:border-brand-accent/50',
              'text-brand-text placeholder:text-brand-muted',
            ].join(' ')}
          />
          {errors.message && <p className="text-xs text-rose-400">⚠ {errors.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold tracking-widest uppercase text-brand-muted">
            Kontak Penemu <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={contact}
            onChange={(e) => this.setState({ contact: e.target.value, errors: { ...errors, contact: undefined } })}
            placeholder="No. HP / LINE / Instagram"
            className={[
              'w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200',
              'bg-brand-surface-alt border',
              errors.contact ? 'border-rose-500/50' : 'border-brand-muted/20 focus:border-brand-accent/50',
              'text-brand-text placeholder:text-brand-muted',
            ].join(' ')}
          />
          {errors.contact && <p className="text-xs text-rose-400">⚠ {errors.contact}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold tracking-widest uppercase text-brand-muted">
            Foto Temuan <span className="text-rose-400">*</span>
          </label>
          <button
            type="button"
            onClick={() => this.photoRef.current?.click()}
            className={[
              'w-full px-4 py-3 rounded-xl text-sm text-left transition-all duration-200 border',
              errors.photo
                ? 'border-rose-500/50 text-rose-400'
                : 'border-brand-muted/20 text-brand-muted hover:border-brand-accent/40',
            ].join(' ')}
          >
            {photoFile ? photoFile.name : 'Pilih gambar...'}
          </button>
          <input
            ref={this.photoRef}
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={this.handleFileChange}
          />
          {errors.photo && <p className="text-xs text-rose-400">⚠ {errors.photo}</p>}
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={this.props.onCancel}
            disabled={isLoading}
            className="flex-1 py-3.5 rounded-2xl bg-brand-surface-alt text-brand-muted text-sm font-semibold hover:text-brand-text transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-3.5 rounded-2xl bg-brand-accent text-brand-bg font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Kirim'}
          </button>
        </div>
      </form>
    );
  }
}
