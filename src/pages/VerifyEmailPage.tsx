import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from '../router/withRouter';
import type { RouterProps } from '../router/withRouter';
import { AuthApi } from '../api/AuthApi';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// ── Types ────────────────────────────────────────────────────────────────────

type VerifyStatus = 'loading' | 'success' | 'error';

interface State {
  status: VerifyStatus;
  message: string;
}

// ── Component ────────────────────────────────────────────────────────────────

class VerifyEmailPageBase extends React.Component<RouterProps, State> {
  state: State = { status: 'loading', message: '' };

  async componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const token = params.get('token');

    if (!token) {
      this.setState({ status: 'error', message: 'Token verifikasi tidak ditemukan.' });
      return;
    }

    try {
      const res = await AuthApi.verifyEmail(token);
      this.setState({ status: 'success', message: res.message });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Verifikasi gagal. Token mungkin sudah kedaluwarsa.';
      this.setState({ status: 'error', message: msg });
    }
  }

  // ── Render helpers ────────────────────────────────────────────────────────

  private renderLoading() {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <LoadingSpinner size="lg" />
        <p className="text-gray-500 font-medium">Memverifikasi email Anda...</p>
      </div>
    );
  }

  private renderSuccess() {
    return (
      <div className="flex flex-col items-center gap-5 py-4">
        <div className="w-20 h-20 rounded-full bg-brand-lighter flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#79D7F0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">Email Terverifikasi!</h2>
          <p className="text-sm text-gray-500 mt-1">{this.state.message}</p>
        </div>
        <Link to="/login" className="mt-2 px-8 py-3 rounded-xl bg-brand-primary text-white font-bold text-sm hover:bg-brand-secondary active:scale-95 transition-all shadow-lg shadow-brand-primary/25">
          Masuk Sekarang
        </Link>
      </div>
    );
  }

  private renderError() {
    return (
      <div className="flex flex-col items-center gap-5 py-4">
        <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">Verifikasi Gagal</h2>
          <p className="text-sm text-gray-500 mt-1">{this.state.message}</p>
        </div>
        <Link to="/login" className="mt-2 px-8 py-3 rounded-xl border-2 border-brand-primary text-brand-primary font-bold text-sm hover:bg-brand-bg active:scale-95 transition-all">
          Kembali ke Halaman Masuk
        </Link>
      </div>
    );
  }

  render() {
    const { status } = this.state;

    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center px-5">
        <div className="bg-white rounded-3xl shadow-xl shadow-brand-primary/10 p-8 w-full max-w-sm">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center shadow-md shadow-brand-primary/30 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h1 className="text-lg font-extrabold text-gray-800">Verifikasi Email</h1>
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
