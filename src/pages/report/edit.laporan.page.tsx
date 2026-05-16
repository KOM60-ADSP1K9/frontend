import React from 'react';
import { withRouter } from '../../router/with.router';
import type { RouterProps } from '../../router/with.router';
import { InputField } from '../../components/common/input.field';
import { SelectField } from '../../components/common/select.field';
import { LoadingSpinner } from '../../components/common/loading.spinner';
import { LaporanApi } from '../../api/laporan.api';
import { LokasiApi } from '../../api/lokasi.api';
import { KategoriApi } from '../../api/kategori.api';
import { Alert } from '../../utils/alert';
import { Toast } from '../../utils/toast';
import type { HomepageLaporanItem, Lokasi, KategoriBarang } from '../../types/report.types';

// ── State ──────────────────────────────────────────────────────────────────

interface State {
  barang_name: string;
  barang_description: string;
  kategori_barang_id: string;
  location_id: string;
  date: string;
  photo: File | null;
  photoPreview: string | null;
  existingPhotoUrl: string;
  lokasi: Lokasi[];
  kategori: KategoriBarang[];
  isFetchingData: boolean;
  isSubmitting: boolean;
  errors: {
    barang_name?: string;
    barang_description?: string;
    kategori_barang_id?: string;
    location_id?: string;
    date?: string;
  };
}

// ── Component ──────────────────────────────────────────────────────────────

class EditLaporanPageBase extends React.Component<RouterProps, State> {
  private galleryInputRef = React.createRef<HTMLInputElement>();

  state: State = {
    barang_name: '',
    barang_description: '',
    kategori_barang_id: '',
    location_id: '',
    date: '',
    photo: null,
    photoPreview: null,
    existingPhotoUrl: '',
    lokasi: [],
    kategori: [],
    isFetchingData: true,
    isSubmitting: false,
    errors: {},
  };

  async componentDidMount() {
    const passed = (this.props.location.state as { laporan?: HomepageLaporanItem } | null)?.laporan;

    if (!passed) {
      Alert.error('Data tidak ditemukan', 'Buka halaman edit dari detail laporan.');
      this.props.navigate(-1);
      return;
    }

    const [lokasiRes, kategoriRes] = await Promise.allSettled([LokasiApi.getAll(), KategoriApi.getAll()]);

    const lokasi = lokasiRes.status === 'fulfilled' && lokasiRes.value.status === 'success' ? lokasiRes.value.data : [];
    const kategori = kategoriRes.status === 'fulfilled' && kategoriRes.value.status === 'success' ? kategoriRes.value.data : [];

    const locationId = passed.type === 'hilang' ? (passed.lost_at_location_id ?? '') : (passed.found_at_location_id ?? '');

    const date = passed.type === 'hilang' ? (passed.lost_at_date ?? '') : (passed.found_at_date ?? '');

    this.setState({
      barang_name: passed.barang.name,
      barang_description: passed.barang.description,
      kategori_barang_id: passed.barang.kategori_barang_id ?? '',
      location_id: locationId,
      date,
      existingPhotoUrl: passed.barang.photo,
      lokasi,
      kategori,
      isFetchingData: false,
    });
  }

  componentWillUnmount() {
    if (this.state.photoPreview) URL.revokeObjectURL(this.state.photoPreview);
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
    this.setState({ photo: file, photoPreview: URL.createObjectURL(file) });
  };

  private handleRemoveNewPhoto = () => {
    if (this.state.photoPreview) URL.revokeObjectURL(this.state.photoPreview);
    this.setState({ photo: null, photoPreview: null });
    if (this.galleryInputRef.current) this.galleryInputRef.current.value = '';
  };

  private validate(): boolean {
    const { barang_name, barang_description, kategori_barang_id, location_id, date } = this.state;
    const errors: State['errors'] = {};
    if (!barang_name.trim()) errors.barang_name = 'Nama barang wajib diisi';
    if (!barang_description.trim()) errors.barang_description = 'Deskripsi wajib diisi';
    if (!kategori_barang_id) errors.kategori_barang_id = 'Kategori wajib dipilih';
    if (!location_id) errors.location_id = 'Lokasi wajib dipilih';
    if (!date) errors.date = 'Tanggal wajib diisi';
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  private handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!this.validate()) return;

    const passed = (this.props.location.state as { laporan?: HomepageLaporanItem } | null)?.laporan;
    if (!passed) return;

    const { barang_name, barang_description, kategori_barang_id, location_id, date, photo } = this.state;
    this.setState({ isSubmitting: true });
    const toastId = Toast.loading('Menyimpan perubahan...');

    try {
      const [barangRes, detailsRes] = await Promise.allSettled([
        LaporanApi.updateBarang(passed.id, { barang_name, barang_description, kategori_barang_id, photo: photo ?? undefined }),
        LaporanApi.updateDetails(passed.id, { location_id, date }),
      ]);

      Toast.dismiss(toastId);

      const barangOk = barangRes.status === 'fulfilled' && barangRes.value.status === 'success';
      const detailsOk = detailsRes.status === 'fulfilled' && detailsRes.value.status === 'success';

      if (!barangOk || !detailsOk) {
        let errMsg = 'Gagal menyimpan perubahan';
        if (!barangOk && barangRes.status === 'fulfilled' && barangRes.value.status === 'error') {
          errMsg = barangRes.value.error;
        } else if (!detailsOk && detailsRes.status === 'fulfilled' && detailsRes.value.status === 'error') {
          errMsg = detailsRes.value.error;
        }
        Alert.error('Gagal Menyimpan', errMsg);
        this.setState({ isSubmitting: false });
        return;
      }

      Toast.success('Laporan berhasil diperbarui');
      this.props.navigate(-1);
    } catch {
      Toast.dismiss(toastId);
      Alert.error('Gagal Menyimpan', 'Terjadi kesalahan. Coba lagi.');
      this.setState({ isSubmitting: false });
    }
  };

  render() {
    const { barang_name, barang_description, kategori_barang_id, location_id, date, photoPreview, existingPhotoUrl, lokasi, kategori, isFetchingData, isSubmitting, errors } = this.state;

    const passed = (this.props.location.state as { laporan?: HomepageLaporanItem } | null)?.laporan;
    const isHilang = passed?.type === 'hilang';

    if (isFetchingData) {
      return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center">
          <LoadingSpinner />
        </div>
      );
    }

    const lokasiOptions = lokasi.map((l) => ({ value: l.id, label: l.name }));
    const kategoriOptions = kategori.map((k) => ({ value: k.id, label: k.name }));

    return (
      <div className="min-h-screen bg-brand-bg flex flex-col lg:pl-14">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-5 pb-4 lg:pt-8 lg:max-w-2xl lg:mx-auto lg:w-full">
          <button onClick={() => this.props.navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-brand-surface-alt text-brand-muted hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h1 className="text-white font-bold text-base">Edit Laporan</h1>
        </div>

        <form onSubmit={this.handleSubmit} noValidate className="flex-1 px-4 pb-8 lg:pb-12 max-w-3xl mx-auto w-full flex flex-col gap-5 lg:flex-row lg:gap-8 lg:items-start">
          {/* Kiri: foto (sticky di desktop) */}
          <div className="lg:w-72 lg:flex-shrink-0 lg:sticky lg:top-8 flex flex-col gap-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-muted">Foto Barang</span>
            {photoPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-brand-muted/20">
                <img src={photoPreview} alt="Preview baru" className="w-full h-48 lg:h-56 object-cover" />
                <button type="button" onClick={this.handleRemoveNewPhoto} className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-black/80">
                  ✕
                </button>
                <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-full">Foto baru</span>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-brand-muted/20">
                <img
                  src={existingPhotoUrl}
                  alt="Foto saat ini"
                  className="w-full h-48 lg:h-56 object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                <button type="button" onClick={() => this.galleryInputRef.current?.click()} className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full hover:bg-black/90 transition-colors">
                  Ganti Foto
                </button>
              </div>
            )}
            <input ref={this.galleryInputRef} type="file" accept="image/*" className="hidden" onChange={this.handlePhotoChange} />
            <p className="text-xs text-brand-muted">Kosongkan jika tidak ingin mengganti foto</p>
          </div>

          {/* Kanan: field-field + CTA */}
          <div className="flex flex-col gap-5 flex-1 pb-24 lg:pb-0">
            <InputField label="Nama Barang" name="barang_name" value={barang_name} error={errors.barang_name} required onChange={this.handleTextChange} />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="barang_description" className="text-xs font-semibold tracking-widest uppercase text-brand-muted">
                Deskripsi <span className="text-rose-400">*</span>
              </label>
              <textarea
                id="barang_description"
                name="barang_description"
                value={barang_description}
                rows={4}
                onChange={this.handleTextChange}
                className={[
                  'w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 resize-none',
                  'bg-brand-surface-alt text-white placeholder:text-brand-muted border focus:ring-2',
                  errors.barang_description ? 'border-rose-500/50 focus:border-rose-500/70 focus:ring-rose-500/10' : 'border-brand-muted/20 focus:border-brand-accent/50 focus:ring-brand-accent/10',
                ].join(' ')}
              />
              {errors.barang_description && (
                <p className="text-xs text-rose-400 flex items-center gap-1">
                  <span>⚠</span> {errors.barang_description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <SelectField label="Kategori Barang" name="kategori_barang_id" value={kategori_barang_id} options={kategoriOptions} placeholder="Pilih kategori..." error={errors.kategori_barang_id} required onChange={this.handleSelectChange} />
              <SelectField
                label={isHilang ? 'Lokasi Kehilangan' : 'Lokasi Ditemukan'}
                name="location_id"
                value={location_id}
                options={lokasiOptions}
                placeholder="Pilih lokasi..."
                error={errors.location_id}
                required
                onChange={this.handleSelectChange}
              />
            </div>

            <div className="lg:w-1/2">
              <InputField label={isHilang ? 'Tanggal Kehilangan' : 'Tanggal Ditemukan'} name="date" type="date" value={date} error={errors.date} required onChange={this.handleTextChange} />
            </div>

            {/* Submit inline di desktop */}
            <button
              onClick={this.handleSubmit}
              disabled={isSubmitting}
              className="hidden lg:flex w-full py-4 rounded-2xl bg-brand-accent text-brand-bg font-bold text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 items-center justify-center gap-2"
            >
              {isSubmitting ? <LoadingSpinner size="sm" /> : 'Simpan Perubahan'}
            </button>
          </div>
        </form>

        {/* Submit CTA — mobile only */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-brand-bg border-t border-white/5">
          <button
            onClick={this.handleSubmit}
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-brand-accent text-brand-bg font-bold text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? <LoadingSpinner size="sm" /> : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    );
  }
}

export const EditLaporanPage = withRouter(EditLaporanPageBase);
