import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { BottomNavbar } from '../components/common/BottomNavbar';

/**
 * LoginPage – class component that composes LoginForm + layout.
 */
export class LoginPage extends React.Component {
  render() {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="pt-14 pb-8 px-6 flex flex-col items-center">
          {/* Logo mark */}
          <div className="w-16 h-16 rounded-2xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/30 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M11 8v3l2 2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">IPB Lost & Found</h1>
          <p className="text-sm text-gray-400 mt-1">Temukan barang hilangmu</p>
        </header>

        {/* ── Card ───────────────────────────────────────────────────────── */}
        <main className="flex-1 px-5">
          <div className="bg-white rounded-3xl shadow-xl shadow-brand-primary/10 p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Selamat datang! 👋</h2>
            <p className="text-sm text-gray-400 mb-6">Masuk dengan akun IPB Anda</p>
            <LoginForm />
          </div>
        </main>

        {/* ── Spacer for bottom nav ───────────────────────────────────────── */}
        <div className="pb-24" />

        <BottomNavbar />
      </div>
    );
  }
}
