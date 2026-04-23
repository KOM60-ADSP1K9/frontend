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

interface State {
  email: string;
  password: string;
  isLoading: boolean;
  showPassword: boolean;
  errors: { email?: string; password?: string };
}

// ── Component ────────────────────────────────────────────────────────────────

class LoginFormBase extends React.Component<RouterProps, State> {
  state: State = {
    email: '',
    password: '',
    isLoading: false,
    showPassword: false,
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

  private togglePassword = () => {
    this.setState((prev) => ({ showPassword: !prev.showPassword }));
  };

  private validate(): boolean {
    const { email, password } = this.state;
    const errors: State['errors'] = {};
    if (!email) errors.email = 'Email wajib diisi';
    if (!password) errors.password = 'Password wajib diisi';
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  private handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!this.validate()) return;

    const { email, password } = this.state;
    this.setState({ isLoading: true });
    const toastId = Toast.loading('Sedang masuk...');

    try {
      const res = await AuthApi.login({ email, password });
      localStorage.setItem('access_token', res.data.access_token);
      Toast.dismiss(toastId);
      Toast.success('Login berhasil! Selamat datang 👋');
      this.props.navigate('/profile');
    } catch (err: unknown) {
      Toast.dismiss(toastId);
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Login gagal, periksa kembali email dan password Anda.';
      Alert.error('Login Gagal', msg);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  render() {
    const { email, password, isLoading, showPassword, errors } = this.state;

    return (
      <form onSubmit={this.handleSubmit} noValidate className="flex flex-col gap-5">
        <InputField label="Email IPB" name="email" type="email" value={email} placeholder="nim@apps.ipb.ac.id" autoComplete="email" error={errors.email} required onChange={this.handleChange} />

        <InputField
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password}
          required
          onChange={this.handleChange}
          rightElement={
            <button type="button" onClick={this.togglePassword} className="text-gray-400 hover:text-brand-primary transition-colors" aria-label="Toggle password visibility">
              {showPassword ? (
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
              )}
            </button>
          }
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 mt-1 rounded-xl bg-brand-primary text-white font-bold text-sm tracking-wide hover:bg-brand-secondary active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/25"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" /> Sedang masuk...
            </>
          ) : (
            'Masuk'
          )}
        </button>

        <p className="text-center text-sm text-gray-500">
          Belum punya akun?{' '}
          <Link to="/register" className="text-brand-primary font-semibold hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </form>
    );
  }
}

export const LoginForm = withRouter(LoginFormBase);
