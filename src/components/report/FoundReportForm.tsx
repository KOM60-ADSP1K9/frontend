import React from 'react';
import { withRouter } from '../../router/withRouter';
import type { RouterProps } from '../../router/withRouter';
import { InputField } from '../common/InputField';
import { SelectField } from '../common/SelectField';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ReportApi } from '../../api/ReportApi';
import { LokasiApi } from '../../api/LokasiApi';
import { KategoriApi } from '../../api/KategoriApi';
import { AuthApi } from '../../api/AuthApi';
import { Toast } from '../../utils/toast';
import { Alert } from '../../utils/alert';
import type { Lokasi, KategoriBarang } from '../../types/report.types';

// ── Helpers ────────────────────────────────────────────────────────────────

function isMobileDevice(): boolean {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// ── Icons ──────────────────────────────────────────────────────────────────

class CameraIcon extends React.Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    );
  }
}

class ImageIcon extends React.Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    );
  }
}

// ── State ──────────────────────────────────────────────────────────────────

interface State {
  barang_name: string;
  barang_description: string;
  kategori_barang_id: string;
  found_at_location_id: string;
  found_at_date: string;
  photo: File | null;
  photoPreview: string | null;
  isLoading: boolean;
  isFetchingData: boolean;
  isMobile: boolean;
  isStaff: boolean;
  lokasi: Lokasi[];
  kategori: KategoriBarang[];
  errors: {
    photo?: string;
    barang_name?: string;
    barang_description?: string;
    kategori_barang_id?: string;
    found_at_location_id?: string;
    found_at_date?: string;
  };
}

// ── Component ──────────────────────────────────────────────────────────────

class FoundReportFormBase extends React.Component<RouterProps, State> {
  private cameraInputRef = React.createRef<HTMLInputElement>();
  private galleryInputRef = React.createRef<HTMLInputElement>();

  state: State = {
    barang_name: '',
    barang_description: '',
    kategori_barang_id: '',
    found_at_location_id: '',
    found_at_date: '',
    photo: null,
    photoPreview: null,
    isLoading: false,
    isFetchingData: true,
    isMobile: false,
    isStaff: false,
    lokasi: [],
    kategori: [],
    errors: {},
  };

  async componentDidMount() {
    this.setState({ isMobile: isMobileDevice() });
    await Promise.all([this.fetchLokasi(), this.fetchKategori(), this.fetchUserRole()]);
  }

  componentWillUnmount() {
    if (this.state.photoPreview) URL.revokeObjectURL(this.state.photoPreview);
  }

  private async fetchLokasi() {
    try {
      const res = await LokasiApi.getAll();
      if (res.status === 'success') this.setState({ lokasi: res.data });
    } catch {
      Toast.error('Gagal memuat daftar lokasi');
    }
  }

  private async fetchKategori() {
    try {
      const res = await KategoriApi.getAll();
      if (res.status === 'success') this.setState({ kategori: res.data });
    } catch {
      Toast.error('Gagal memuat kategori barang');
    } finally {
      this.setState({ isFetchingData: false });
    }
  }

  private async fetchUserRole() {
    try {
      const res = await AuthApi.me();
      if (res.status === 'success') {
        this.setState({ isStaff: res.data.role === 'STAFF' });
      }
    } catch {
      // default mahasiswa
    }
  }

  private handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    this.setState((prev) => ({
      ...prev,
      [name]: value,
      errors: { ...prev.errors, [name]: undefined },
    }));
  };

  private handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    this.setState((prev) => ({
      ...prev,
      [name]: value,
      errors: { ...prev.errors, [name]: undefined },
    }));
  };

  private handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (this.state.photoPreview) URL.revokeObjectURL(this.state.photoPreview);
    const preview = URL.createObjectURL(file);
    this.setState({ photo: file, photoPreview: preview, errors: { ...this.state.errors, photo: undefined } });
  };

  private handleRemovePhoto = () => {
    if (this.state.photoPreview) URL.revokeObjectURL(this.state.photoPreview);
    this.setState({ photo: null, photoPreview: null });
    if (this.cameraInputRef.current) this.cameraInputRef.current.value = '';
    if (this.galleryInputRef.current) this.galleryInputRef.current.value = '';
  };

  private validate(): boolean {
    const { photo, barang_name, barang_description, kategori_barang_id, found_at_location_id, found_at_date, isStaff } = this.state;
    const errors: State['errors'] = {};
    if (!photo) errors.photo = 'Foto barang wajib diupload';
    if (!barang_name.trim()) errors.barang_name = 'Nama barang wajib diisi';
    if (!barang_description.trim()) errors.barang_description = 'Deskripsi wajib diisi';
    if (!kategori_barang_id) errors.kategori_barang_id = 'Kategori barang wajib dipilih';
    if (!isStaff && !found_at_location_id) errors.found_at_location_id = 'Lokasi ditemukan wajib dipilih';
    if (!found_at_date) errors.found_at_date = 'Tanggal ditemukan wajib diisi';
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  private handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!this.validate()) return;

    const { photo, barang_name, barang_description, kategori_barang_id, found_at_location_id, found_at_date, isStaff } = this.state;
    this.setState({ isLoading: true });
    const toastId = Toast.loading('Mengirim laporan...');

    try {
      const res = await ReportApi.createFoundReport({
        photo: photo!,
        barang_name,
        barang_description,
        kategori_barang_id,
        found_at_location_id: isStaff ? null : found_at_location_id,
        found_at_date,
      });

      Toast.dismiss(toastId);

      if (res.status !== 'success') {
        Alert.error('Gagal Membuat Laporan', res.error);
        return;
      }

      Toast.success('Laporan temuan berhasil dibuat!');
      this.props.navigate('/riwayat');
    } catch (err: unknown) {
      Toast.dismiss(toastId);
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Gagal membuat laporan. Coba lagi.';
      Alert.error('Gagal Membuat Laporan', msg);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  private renderPhotoUpload() {
    const { photo, photoPreview, isMobile, errors } = this.state;

    if (photoPreview) {
      return (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-widest uppercase text-brand-muted">
            Foto Barang <span className="text-rose-400">*</span>
          </span>
          <div className="relative rounded-xl overflow-hidden border border-brand-muted/20">
            <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover" />
            <button
              type="button"
              onClick={this.handleRemovePhoto}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-black/80 transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-brand-muted">{photo?.name}</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold tracking-widest uppercase text-brand-muted">
          Foto Barang <span className="text-rose-400">*</span>
        </span>

        {isMobile ? (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => this.cameraInputRef.current?.click()}
              className="flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border border-dashed border-brand-muted/40 bg-brand-surface-alt text-brand-muted hover:border-brand-accent/60 hover:text-brand-accent transition-colors"
            >
              <CameraIcon />
              <span className="text-xs font-medium">Ambil Foto</span>
            </button>
            <button
              type="button"
              onClick={() => this.galleryInputRef.current?.click()}
              className="flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border border-dashed border-brand-muted/40 bg-brand-surface-alt text-brand-muted hover:border-brand-accent/60 hover:text-brand-accent transition-colors"
            >
              <ImageIcon />
              <span className="text-xs font-medium">Pilih File</span>
            </button>
            <input ref={this.cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={this.handlePhotoChange} />
            <input ref={this.galleryInputRef} type="file" accept="image/*" className="hidden" onChange={this.handlePhotoChange} />
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => this.galleryInputRef.current?.click()}
              className="w-full flex flex-col items-center gap-2 py-6 rounded-xl border border-dashed border-brand-muted/40 bg-brand-surface-alt text-brand-muted hover:border-brand-accent/60 hover:text-brand-accent transition-colors"
            >
              <ImageIcon />
              <span className="text-xs font-medium">Klik untuk memilih foto</span>
              <span className="text-xs opacity-60">JPG, PNG, WEBP — maks. 5 MB</span>
            </button>
            <input ref={this.galleryInputRef} type="file" accept="image/*" className="hidden" onChange={this.handlePhotoChange} />
          </div>
        )}

        {errors.photo && (
          <p className="text-xs text-rose-400 flex items-center gap-1">
            <span>⚠</span> {errors.photo}
          </p>
        )}
      </div>
    );
  }

  render() {
    const {
      barang_name,
      barang_description,
      kategori_barang_id,
      found_at_location_id,
      found_at_date,
      isLoading,
      isFetchingData,
      isStaff,
      lokasi,
      kategori,
      errors,
    } = this.state;

    const lokasiOptions = lokasi.map((l) => ({ value: l.id, label: l.name }));
    const kategoriOptions = kategori.map((k) => ({ value: k.id, label: k.name }));

    if (isFetchingData) {
      return (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      );
    }

    return (
      <form onSubmit={this.handleSubmit} noValidate className="flex flex-col gap-5">
        {this.renderPhotoUpload()}

        <InputField
          label="Nama Barang"
          name="barang_name"
          value={barang_name}
          placeholder="Contoh: Tas ransel hitam"
          error={errors.barang_name}
          required
          onChange={this.handleTextChange}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="barang_description" className="text-xs font-semibold tracking-widest uppercase text-brand-muted">
            Deskripsi <span className="text-rose-400">*</span>
          </label>
          <textarea
            id="barang_description"
            name="barang_description"
            value={barang_description}
            placeholder="Ciri-ciri barang, warna, merek, kondisi, dsb."
            rows={3}
            onChange={this.handleTextChange}
            className={[
              'w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 resize-none',
              'bg-brand-surface-alt text-white placeholder:text-brand-muted',
              'border focus:ring-2',
              errors.barang_description
                ? 'border-rose-500/50 focus:border-rose-500/70 focus:ring-rose-500/10'
                : 'border-brand-muted/20 focus:border-brand-accent/50 focus:ring-brand-accent/10',
            ].join(' ')}
          />
          {errors.barang_description && (
            <p className="text-xs text-rose-400 flex items-center gap-1"><span>⚠</span> {errors.barang_description}</p>
          )}
        </div>

        <SelectField
          label="Kategori Barang"
          name="kategori_barang_id"
          value={kategori_barang_id}
          options={kategoriOptions}
          placeholder="Pilih kategori..."
          error={errors.kategori_barang_id}
          required
          onChange={this.handleSelectChange}
        />

        {!isStaff && (
          <SelectField
            label="Lokasi Ditemukan"
            name="found_at_location_id"
            value={found_at_location_id}
            options={lokasiOptions}
            placeholder="Pilih lokasi..."
            error={errors.found_at_location_id}
            required
            onChange={this.handleSelectChange}
          />
        )}

        {isStaff && (
          <div className="px-4 py-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
            <p className="text-sky-400 text-xs font-medium">
              Lokasi ditemukan otomatis diisi berdasarkan lokasi tugas kamu.
            </p>
          </div>
        )}

        <InputField
          label="Tanggal Ditemukan"
          name="found_at_date"
          type="date"
          value={found_at_date}
          error={errors.found_at_date}
          required
          onChange={this.handleTextChange}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 mt-1 rounded-2xl bg-brand-accent text-brand-bg font-bold text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : 'Kirim Laporan'}
        </button>
      </form>
    );
  }
}

export const FoundReportForm = withRouter(FoundReportFormBase);
