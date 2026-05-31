import React from 'react';
import { Link } from 'react-router-dom';
import { CircleCheck, CircleX, Mail } from 'lucide-react';
import { withRouter } from '../../router/with.router';
import type { RouterProps } from '../../router/with.router';
import { AuthApi } from '../../api/auth.api';
import { LoadingSpinner } from '../../components/common/loading.spinner';

type VerifyStatus = 'loading' | 'success' | 'error';

interface State {
  status: VerifyStatus;
  message: string;
}

class VerifyEmailPageBase extends React.Component<RouterProps, State> {
  state: State = { status: 'loading', message: '' };

  async componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const status = params.get('status');
    const message = params.get('message');

    if (status === 'success') {
      this.setState({ status: 'success', message: 'Email Anda telah berhasil diverifikasi.' });
      return;
    }
    if (status === 'error') {
      this.setState({ status: 'error', message: message ?? 'Verifikasi gagal.' });
      return;
    }

    const token = params.get('token');
    if (!token) {
      this.setState({ status: 'error', message: 'Token verifikasi tidak ditemukan.' });
      return;
    }

    try {
      const res = await AuthApi.verifyEmail(token);
      if (res.status === 'success') {
        this.setState({ status: 'success', message: res.message });
      } else {
        this.setState({ status: 'error', message: res.error });
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Verifikasi gagal. Token mungkin sudah kedaluwarsa.';
      this.setState({ status: 'error', message: msg });
    }
  }

  private renderLoading() {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <LoadingSpinner size="lg" />
        <p className="text-brand-muted font-medium">Memverifikasi email Anda...</p>
      </div>
    );
  }

  private renderSuccess() {
    return (
      <div className="flex flex-col items-center gap-5 py-4">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center">
          <CircleCheck size={40} className="text-emerald-400" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-brand-text">Email Terverifikasi!</h2>
          <p className="text-sm text-brand-muted mt-1">{this.state.message}</p>
        </div>
        <Link to="/login" className="mt-2 px-8 py-3 rounded-xl bg-brand-accent text-brand-bg font-bold text-sm hover:opacity-90 active:scale-95 transition-all">
          Masuk Sekarang
        </Link>
      </div>
    );
  }

  private renderError() {
    return (
      <div className="flex flex-col items-center gap-5 py-4">
        <div className="w-20 h-20 rounded-full bg-rose-500/15 flex items-center justify-center">
          <CircleX size={40} className="text-rose-400" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-brand-text">Verifikasi Gagal</h2>
          <p className="text-sm text-brand-muted mt-1">{this.state.message}</p>
        </div>
        <Link to="/login" className="mt-2 px-8 py-3 rounded-xl border-2 border-brand-accent text-brand-accent font-bold text-sm hover:bg-brand-surface-alt active:scale-95 transition-all">
          Kembali ke Halaman Masuk
        </Link>
      </div>
    );
  }

  render() {
    const { status } = this.state;

    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center px-5">
        <div className="bg-brand-surface rounded-3xl shadow-xl shadow-black/20 p-8 w-full max-w-sm">

          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-accent flex items-center justify-center shadow-md mb-3">
              <Mail size={24} className="text-white" />
            </div>
            <h1 className="text-lg font-extrabold text-brand-text">Verifikasi Email</h1>
          </div>

          {status === 'loading' && this.renderLoading()}
          {status === 'success' && this.renderSuccess()}
          {status === 'error' && this.renderError()}
        </div>
      </div>
    );
  }
}

export const VerifyEmailPage = withRouter(VerifyEmailPageBase);
