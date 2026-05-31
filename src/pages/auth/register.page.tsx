import React from 'react';
import logoLogin from '../../assets/logo-login.png';
import { RegisterForm } from '../../components/auth/register.form';

export class RegisterPage extends React.Component {
  render() {
    return (
      <div className="min-h-screen bg-brand-bg flex">

        <div className="hidden md:flex md:w-2/5 lg:w-2/5 flex-col items-center justify-center relative overflow-hidden bg-brand-surface px-10">

          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-accent/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-brand-accent/8 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xs text-center">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-3xl bg-brand-surface-alt flex items-center justify-center shadow-2xl shadow-black/40 border border-white/5">
                <img src={logoLogin} alt="IPB Logo" className="w-14 h-14 object-contain" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-brand-text mb-3 tracking-tight">Lost &amp; Found IPB</h1>
            <p className="text-brand-muted text-base leading-relaxed mb-8">
              Bergabung dan bantu sesama civitas akademika IPB menemukan barang mereka.
            </p>

            <div className="flex flex-col gap-4 text-left">
              {[
                { step: '01', text: 'Daftar dengan email IPB kamu' },
                { step: '02', text: 'Verifikasi email untuk mengaktifkan akun' },
                { step: '03', text: 'Mulai lapor atau temukan barang' },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-3.5">
                  <span className="w-9 h-9 rounded-xl bg-brand-accent/15 text-brand-accent text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {s.step}
                  </span>
                  <p className="text-brand-text text-sm font-medium leading-tight">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 md:px-10 md:overflow-y-auto">
          <div className="w-full max-w-sm md:max-w-md">

            <div className="flex flex-col items-center mb-6 md:hidden">
              <div className="w-16 h-16 rounded-2xl bg-brand-surface-alt flex items-center justify-center mb-4 shadow-lg">
                <img src={logoLogin} alt="IPB Logo" className="w-9 h-9 object-contain" />
              </div>
            </div>

            <div className="hidden md:block mb-6">
              <h2 className="text-3xl font-bold text-brand-text tracking-tight">Buat Akun Baru</h2>
              <p className="text-brand-muted text-sm mt-1.5">Daftar menggunakan email IPB kamu</p>
            </div>

            <div className="bg-brand-surface rounded-3xl p-6 shadow-xl shadow-black/20">
              <h1 className="text-2xl font-bold text-brand-accent mb-5 text-center md:hidden">Create Account</h1>
              <RegisterForm />
            </div>
          </div>
        </div>

      </div>
    );
  }
}
