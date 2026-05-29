import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from '../../router/with.router';
import type { RouterProps } from '../../router/with.router';
import { InputField } from '../common/input.field';
import { SelectField } from '../common/select.field';
import { LoadingSpinner } from '../common/loading.spinner';
import { AuthApi } from '../../api/auth.api';
import { Toast } from '../../utils/toast';
import { Alert } from '../../utils/alert';

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
  fakultasOptions: { value: string; label: string }[];
  departemenOptions: { value: string; label: string }[];
  loadingFakultas: boolean;
  loadingDepartemen: boolean;
}

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
    fakultasOptions: [],
    departemenOptions: [],
    loadingFakultas: true,
    loadingDepartemen: false,
  };

  async componentDidMount() {
    try {
      const res = await AuthApi.getFakultas();
      if (res.status === 'success') {
        this.setState({
          fakultasOptions: res.data.map((f) => ({ value: f, label: f })),
        });
      }
    } catch {
      // silently fail — user can't pick fakultas but form still renders
    } finally {
      this.setState({ loadingFakultas: false });
    }
  }

  private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState((prev) => ({
      ...prev,
      [name]: value,
      errors: { ...prev.errors, [name]: undefined },
    }));
  };

  private handleSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'fakultas') {
      this.setState({
        fakultas: value,
        departemen: '',
        departemenOptions: [],
        errors: { ...this.state.errors, fakultas: undefined, departemen: undefined },
        loadingDepartemen: true,
      });

      try {
        const res = await AuthApi.getDepartemen(value);
        if (res.status === 'success') {
          this.setState({
            departemenOptions: res.data.map((d) => ({ value: d, label: d })),
          });
        }
      } catch {
        // silently fail
      } finally {
        this.setState({ loadingDepartemen: false });
      }
    } else {
      this.setState((prev) => ({
        ...prev,
        [name]: value,
        errors: { ...prev.errors, [name]: undefined },
      }));
    }
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
    const {
      email, password, confirmPassword, nim, fakultas, departemen,
      isLoading, showPassword, showConfirm, errors,
      fakultasOptions, departemenOptions, loadingFakultas, loadingDepartemen,
    } = this.state;

    return (
      <form onSubmit={this.handleSubmit} noValidate className="flex flex-col gap-4">
        <InputField label="Email IPB" name="email" type="email" value={email} placeholder="student@apps.ipb.ac.id" autoComplete="email" error={errors.email} required onChange={this.handleChange} />

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

        <InputField label="NIM" name="nim" value={nim} placeholder="G641XXXXX" error={errors.nim} required onChange={this.handleChange} />

        <div className="grid grid-cols-2 gap-3">
          <SelectField
            label="Fakultas"
            name="fakultas"
            value={fakultas}
            options={fakultasOptions}
            placeholder={loadingFakultas ? 'Memuat...' : 'Pilih...'}
            error={errors.fakultas}
            required
            onChange={this.handleSelect}
          />
          <SelectField
            label="Departemen"
            name="departemen"
            value={departemen}
            options={departemenOptions}
            placeholder={loadingDepartemen ? 'Memuat...' : fakultas ? 'Pilih...' : 'Pilih fakultas dulu'}
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
