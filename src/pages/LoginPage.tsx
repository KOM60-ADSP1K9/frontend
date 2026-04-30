import React from 'react';
import logoLogin from '../assets/logo-login.png';
import { LoginForm } from '../components/auth/LoginForm';

export class LoginPage extends React.Component {
  render() {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-brand-surface-alt flex items-center justify-center mb-6 shadow-lg">
              <img src={logoLogin} alt="IPB Logo" className="w-10 h-10 object-contain" />
            </div>
            <h1 className="text-4xl  text-brand-accent tracking-tight font-bold">Login</h1>
          </div>

          {/* Card */}
          <div className="bg-brand-surface rounded-3xl p-6">
            <LoginForm />
          </div>
        </div>
      </div>
    );
  }
}
