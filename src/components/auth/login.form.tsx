import React from 'react';
import { Link } from 'react-router-dom';
import { User, Eye, EyeOff } from 'lucide-react';
import { withRouter } from '../../router/with.router';
import type { RouterProps } from '../../router/with.router';
import { InputField } from '../common/input.field';
import { LoadingSpinner } from '../common/loading.spinner';
import { AuthApi } from '../../api/auth.api';
import { Toast } from '../../utils/toast';
import { Alert } from '../../utils/alert';

interface State {
  email: string;
  password: string;
  isLoading: boolean;
  showPassword: boolean;
  errors: { email?: string; password?: string };
}

class LoginFormBase extends React.Component<RouterProps, State> {
  state: State = {
    email: '',
    password: '',
    isLoading: false,
    showPassword: false,
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
      if (res.status !== 'success') {
        Toast.dismiss(toastId);
        Alert.error('Login Gagal', res.error);
        return;
      }
      localStorage.setItem('access_token', res.data.access_token);
      Toast.dismiss(toastId);
      Toast.success('Login berhasil! Selamat datang 👋');
      this.props.navigate('/');
    } catch (err: unknown) {
      Toast.dismiss(toastId);
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Login gagal, periksa kembali email dan password Anda.';
      Alert.error('Login Gagal', msg);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { email, password, isLoading, showPassword, errors } = this.state;

    return (
      <form onSubmit={this.handleSubmit} noValidate className="flex flex-col gap-5">
        <InputField label="Student ID or Email" name="email" type="email" value={email} placeholder="nim@apps.ipb.ac.id" autoComplete="email" error={errors.email} required onChange={this.handleChange} rightElement={<User size={18} />} />

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
          labelRight={
            <Link to="/forgot-password" className="text-xs font-semibold text-brand-accent hover:opacity-80 transition-opacity">
              Forgot Password?
            </Link>
          }
          rightElement={
            <button type="button" onClick={this.togglePassword} className="text-brand-muted hover:text-brand-accent transition-colors" aria-label="Toggle password visibility">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 mt-1 rounded-2xl bg-brand-accent text-brand-bg font-bold text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : <>Login →</>}
        </button>

        <p className="text-center text-sm text-brand-muted pt-1">
          Belum punya akun?{' '}
          <Link to="/register" className="text-brand-accent font-semibold hover:opacity-80 transition-opacity">
            Buat Akun
          </Link>
        </p>
      </form>
    );
  }
}

export const LoginForm = withRouter(LoginFormBase);
