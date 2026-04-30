import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from '../../router/withRouter';
import type { RouterProps } from '../../router/withRouter';
import { InputField } from '../common/InputField';
import { SelectField } from '../common/SelectField';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { AuthApi } from '../../api/AuthApi';
import { Toast } from '../../utils/toast';
import { Alert } from '../../utils/alert';

// ── Static data ───────────────────────────────────────────────────────────────

const FAKULTAS_OPTIONS = [
  { value: 'FAPERTA', label: 'FAPERTA — Pertanian' },
  { value: 'FKH', label: 'FKH — Kedokteran Hewan' },
  { value: 'FPIK', label: 'FPIK — Perikanan & Kelautan' },
  { value: 'FAPET', label: 'FAPET — Peternakan' },
  { value: 'FAHUTAN', label: 'FAHUTAN — Kehutanan' },
  { value: 'FATETA', label: 'FATETA — Teknologi Pertanian' },
  { value: 'FMIPA', label: 'FMIPA — Matematika & IPA' },
  { value: 'FEM', label: 'FEM — Ekonomi & Manajemen' },
  { value: 'FEMA', label: 'FEMA — Ekologi Manusia' },
  { value: 'SV', label: 'SV — Sekolah Vokasi' },
  { value: 'SSMI', label: 'SSMI — Sekolah Sains Data, Matematika, dan Informatika'}
];

const DEPARTEMEN_OPTIONS: Record<string, { value: string; label: string }[]> = {
  FMIPA: [
    { value: 'Fisika', label: 'Fisika' },
    { value: 'Kimia', label: 'Kimia' },
    { value: 'Biologi', label: 'Biologi' },
    { value: 'Biokimia', label: 'Biokimia' },
  ],
  FATETA: [
    { value: 'Teknik Mesin & Biosistem', label: 'Teknik Mesin & Biosistem' },
    { value: 'Teknik Sipil & Lingkungan', label: 'Teknik Sipil & Lingkungan' },
    { value: 'Teknologi Industri Pertanian', label: 'Teknologi Industri Pertanian' },
    { value: 'Ilmu & Teknologi Pangan', label: 'Ilmu & Teknologi Pangan' },
  ],
  FAPERTA: [
    { value: 'Agronomi & Hortikultura', label: 'Agronomi & Hortikultura' },
    { value: 'Ilmu Tanah', label: 'Ilmu Tanah' },
    { value: 'Proteksi Tanaman', label: 'Proteksi Tanaman' },
    { value: 'Arsitektur Lanskap', label: 'Arsitektur Lanskap' },
  ],
  FEM: [
    { value: 'Manajemen', label: 'Manajemen' },
    { value: 'Ekonomi Sumberdaya & Lingkungan', label: 'Ekonomi Sumberdaya & Lingkungan' },
    { value: 'Agribisnis', label: 'Agribisnis' },
    { value: 'Ekonomi Pembangunan', label: 'Ekonomi Pembangunan' },
  ],
  SSMI: [
    { value: 'Ilmu Komputer', label: 'Ilmu Komputer' },
    { value: 'Matematika', label: 'Matematika' },
    { value: 'Statistika', label: 'Statistika' },
    { value: 'Aktuaria', label: 'Aktuaria' },
  ],
};

// Fallback untuk fakultas yang belum punya mapping
const getAllDepartemen = () => [
  { value: 'Lainnya', label: 'Lainnya' },
];

// ── State ─────────────────────────────────────────────────────────────────────

interface FormFields {
  email: string;
  password: string;
  confirmPassword: string;
  nim: string;
  fakultas: string;
  departemen: string;
}

interface State extends FormFields {
  isLoading: boolean;
  showPassword: boolean;
  showConfirm: boolean;
  errors: Partial<FormFields>;
}

// ── Component ─────────────────────────────────────────────────────────────────

class RegisterFormBase extends React.Component<RouterProps, State> {
  state: State = {
    email: '',
    password: '',
    confirmPassword: '',
    nim: '',
    fakultas: '',
    departemen: '',
    isLoading: false,
    showPassword: false,
    showConfirm: false,
    errors: {},
  };

  private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState((prev) => ({
      ...prev,
      [name]: value,
      errors: { ...prev.errors, [name]: undefined },
    }));
  };

  private handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const next: Partial<State> = { [name]: value, errors: { ...this.state.errors, [name]: undefined } };
    if (name === 'fakultas') next.departemen = '';
    this.setState((prev) => ({ ...prev, ...next }));
  };

  private togglePassword = () => this.setState((p) => ({ showPassword: !p.showPassword }));
  private toggleConfirm = () => this.setState((p) => ({ showConfirm: !p.showConfirm }));

  private validate(): boolean {
    const { email, password, confirmPassword, nim, fakultas, departemen } = this.state;
    const errors: State['errors'] = {};

    if (!email) errors.email = 'Email wajib diisi';
    else if (!email.endsWith('@apps.ipb.ac.id')) errors.email = 'Hanya email @apps.ipb.ac.id';

    if (!password) errors.password = 'Password wajib diisi';
    else if (password.length < 8) errors.password = 'Minimal 8 karakter';

    if (!confirmPassword) errors.confirmPassword = 'Wajib diisi';
    else if (password !== confirmPassword) errors.confirmPassword = 'Password tidak cocok';

    if (!nim) errors.nim = 'NIM wajib diisi';
    if (!fakultas) errors.fakultas = 'Pilih fakultas';
    if (!departemen) errors.departemen = 'Pilih departemen';

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  private handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!this.validate()) return;

    const { email, password, nim, fakultas, departemen } = this.state;
    this.setState({ isLoading: true });
    const toastId = Toast.loading('Mendaftarkan akun...');

    try {
      await AuthApi.register({ email, password, nim, fakultas, departemen });
      Toast.dismiss(toastId);
      await Alert.success('Pendaftaran Berhasil! 🎉', 'Silakan cek email Anda untuk verifikasi akun.');
      this.props.navigate('/login');
    } catch (err: unknown) {
      Toast.dismiss(toastId);
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Pendaftaran gagal, coba lagi.';
      Alert.error('Pendaftaran Gagal', msg);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  private eyeToggle(visible: boolean, onToggle: () => void) {
    return (
      <button type="button" onClick={onToggle} className="text-brand-muted hover:text-brand-accent transition-colors" aria-label="Toggle password visibility">
        {visible ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    );
  }

  render() {
    const { email, password, confirmPassword, nim, fakultas, departemen, isLoading, showPassword, showConfirm, errors } = this.state;

    const departemenOptions = fakultas
      ? (DEPARTEMEN_OPTIONS[fakultas] ?? getAllDepartemen())
      : [];

    return (
      <form onSubmit={this.handleSubmit} noValidate className="flex flex-col gap-4">
        <InputField
          label="Email IPB"
          name="email"
          type="email"
          value={email}
          placeholder="student@apps.ipb.ac.id"
          autoComplete="email"
          error={errors.email}
          required
          onChange={this.handleChange}
        />

        <InputField
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.password}
          required
          onChange={this.handleChange}
          rightElement={this.eyeToggle(showPassword, this.togglePassword)}
        />

        <InputField
          label="Konfirmasi Password"
          name="confirmPassword"
          type={showConfirm ? 'text' : 'password'}
          value={confirmPassword}
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.confirmPassword}
          required
          onChange={this.handleChange}
          rightElement={this.eyeToggle(showConfirm, this.toggleConfirm)}
        />

        <InputField
          label="NIM"
          name="nim"
          value={nim}
          placeholder="G641XXXXX"
          error={errors.nim}
          required
          onChange={this.handleChange}
        />

        {/* Fakultas & Departemen side by side */}
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            label="Fakultas"
            name="fakultas"
            value={fakultas}
            options={FAKULTAS_OPTIONS}
            error={errors.fakultas}
            required
            onChange={this.handleSelect}
          />
          <SelectField
            label="Departemen"
            name="departemen"
            value={departemen}
            options={departemenOptions}
            placeholder={fakultas ? 'Pilih...' : 'Pilih fakultas dulu'}
            error={errors.departemen}
            required
            onChange={this.handleSelect}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 mt-2 rounded-2xl bg-brand-accent text-brand-bg font-bold text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : <>Daftar Sekarang →</>}
        </button>

        <p className="text-center text-sm text-brand-muted pb-1">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-brand-accent font-semibold hover:opacity-80 transition-opacity">
            Login
          </Link>
        </p>
      </form>
    );
  }
}

export const RegisterForm = withRouter(RegisterFormBase);
