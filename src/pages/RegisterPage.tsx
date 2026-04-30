import React from 'react';
import { RegisterForm } from '../components/auth/RegisterForm';

export class RegisterPage extends React.Component {
  render() {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="bg-brand-surface rounded-3xl p-6">
            <h1 className="text-3xl font-bold text-brand-accent mb-6 text-center">Create Account</h1>
            <RegisterForm />
          </div>
        </div>
      </div>
    );
  }
}
