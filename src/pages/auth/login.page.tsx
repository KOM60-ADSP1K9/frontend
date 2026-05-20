import React from 'react';
import logoLogin from '../../assets/logo-login.png';
import { LoginForm } from '../../components/auth/login.form';

export class LoginPage extends React.Component {
  render() {
    return (
      <div className="min-h-screen bg-brand-bg flex">

        <div className="hidden md:flex md:w-1/2 lg:w-3/5 flex-col items-center justify-center relative overflow-hidden bg-brand-surface px-12">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-accent/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-brand-accent/8 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-md text-center">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-3xl bg-brand-surface-alt flex items-center justify-center shadow-2xl shadow-black/40 border border-white/5">
                <img src={logoLogin} alt="IPB Logo" className="w-14 h-14 object-contain" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-brand-text mb-3 tracking-tight">
              Lost &amp; Found IPB
            </h1>
            <p className="text-brand-muted text-lg leading-relaxed mb-10">
              Temukan barang hilangmu,<br />laporkan temuanmu.
            </p>

            <div className="flex flex-col gap-3 text-left">
              {[
                { title: 'Lapor Kehilangan', desc: 'Buat laporan barang hilang agar orang lain bisa membantu' },
                { title: 'Lapor Temuan', desc: 'Laporkan barang temuan agar bisa dikembalikan ke pemiliknya' },
                { title: 'Real-time Feed', desc: 'Pantau laporan terbaru dari seluruh kampus IPB' },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-3.5 bg-brand-surface-alt/60 rounded-2xl px-4 py-3.5 border border-white/5">
                  <div>
                    <p className="text-brand-text text-sm font-semibold leading-tight">{f.title}</p>
                    <p className="text-brand-muted text-xs mt-0.5 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-5 py-12 md:px-10 lg:px-16">
          <div className="w-full max-w-sm">

            <div className="flex flex-col items-center mb-8 md:hidden">
              <div className="w-20 h-20 rounded-2xl bg-brand-surface-alt flex items-center justify-center mb-6 shadow-lg">
                <img src={logoLogin} alt="IPB Logo" className="w-10 h-10 object-contain" />
              </div>
              <h1 className="text-4xl text-brand-accent tracking-tight font-bold">Login</h1>
            </div>

            <div className="hidden md:block mb-8">
              <h2 className="text-3xl font-bold text-brand-text tracking-tight">Selamat datang</h2>
              <p className="text-brand-muted text-sm mt-1.5">Masuk untuk melanjutkan ke Lost &amp; Found IPB</p>
            </div>

            <div className="bg-brand-surface rounded-3xl p-6 shadow-xl shadow-black/20">
              <LoginForm />
            </div>
          </div>
        </div>

      </div>
    );
  }
}
