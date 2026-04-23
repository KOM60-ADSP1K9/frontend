import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from '../../router/withRouter';
import type { RouterProps } from '../../router/withRouter';
import { InputField } from '../common/InputField';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { AuthApi } from '../../api/AuthApi';
import { Toast } from '../../utils/toast';
import { Alert } from '../../utils/alert';

// ── State ────────────────────────────────────────────────────────────────────

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

// ── Component ────────────────────────────────────────────────────────────────

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

  // ── Handlers ──────────────────────────────────────────────────────────────

  private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState((prev) => ({
      ...prev,
      [name]: value,
      errors: { ...prev.errors, [name]: undefined },
    }));
  };

  private togglePassword = () => this.setState((p) => ({ showPassword: !p.showPassword }));

  private toggleConfirm = () => this.setState((p) => ({ showConfirm: !p.showConfirm }));

  private validate(): boolean {
    const { email, password, confirmPassword, nim, fakultas, departemen } = this.state;
    const errors: State['errors'] = {};

    if (!email) errors.email = 'Email wajib diisi';
    else if (!email.endsWith('@apps.ipb.ac.id')) errors.email = 'Hanya email @apps.ipb.ac.id yang diperbolehkan';

    if (!password) errors.password = 'Password wajib diisi';
    else if (password.length < 8) errors.password = 'Password minimal 8 karakter';

    if (!confirmPassword) errors.confirmPassword = 'Konfirmasi password wajib diisi';
    else if (password !== confirmPassword) errors.confirmPassword = 'Password tidak cocok';

    if (!nim) errors.nim = 'NIM wajib diisi';
    if (!fakultas) errors.fakultas = 'Fakultas wajib diisi';
    if (!departemen) errors.departemen = 'Departemen wajib diisi';

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
      await Alert.success('Pendaftaran Berhasil! 🎉', 'Silakan cek email Anda untuk memverifikasi akun sebelum masuk.');
      this.props.navigate('/login');
    } catch (err: unknown) {
      Toast.dismiss(toastId);
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Pendaftaran gagal, coba lagi.';
      Alert.error('Pendaftaran Gagal', msg);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  private eyeIcon(visible: boolean) {
    return visible ? (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  render() {
    const { email, password, confirmPassword, nim, fakultas, departemen, isLoading, showPassword, showConfirm, errors } = this.state;

    return (
      <form onSubmit={this.handleSubmit} noValidate className="flex flex-col gap-4">
        {/* Email */}
        <InputField label="Email IPB" name="email" type="email" value={email} placeholder="nim@apps.ipb.ac.id" autoComplete="email" error={errors.email} required onChange={this.handleChange} />

        {/* Password */}
        <InputField
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          placeholder="Min. 8 karakter"
          autoComplete="new-password"
          error={errors.password}
          required
          onChange={this.handleChange}
          rightElement={
            <button type="button" onClick={this.togglePassword} className="text-gray-400 hover:text-brand-primary transition-colors">
              {this.eyeIcon(showPassword)}
            </button>
          }
        />

        {/* Confirm Password */}
        <InputField
          label="Konfirmasi Password"
          name="confirmPassword"
          type={showConfirm ? 'text' : 'password'}
          value={confirmPassword}
          placeholder="Ulangi password"
          autoComplete="new-password"
          error={errors.confirmPassword}
          required
          onChange={this.handleChange}
          rightElement={
            <button type="button" onClick={this.toggleConfirm} className="text-gray-400 hover:text-brand-primary transition-colors">
              {this.eyeIcon(showConfirm)}
            </button>
          }
        />

        {/* NIM */}
        <InputField label="NIM" name="nim" value={nim} placeholder="Contoh: G6401211001" error={errors.nim} required onChange={this.handleChange} />

        {/* Fakultas */}
        <InputField label="Fakultas" name="fakultas" value={fakultas} placeholder="Contoh: FMIPA" error={errors.fakultas} required onChange={this.handleChange} />

        {/* Departemen */}
        <InputField label="Departemen" name="departemen" value={departemen} placeholder="Contoh: Ilmu Komputer" error={errors.departemen} required onChange={this.handleChange} />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 mt-2 rounded-xl bg-brand-primary text-white font-bold text-sm tracking-wide hover:bg-brand-secondary active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/25"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" /> Mendaftar...
            </>
          ) : (
            'Daftar Sekarang'
          )}
        </button>

        <p className="text-center text-sm text-gray-500">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-brand-primary font-semibold hover:underline">
            Masuk di sini
          </Link>
        </p>
      </form>
    );
  }
}

export const RegisterForm = withRouter(RegisterFormBase);
