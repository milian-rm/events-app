import { useState } from 'react';
import LoginForm from '../components/LoginForm.jsx';
import RegisterForm from '../components/RegisterForm.jsx';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-1 text-center">
          Sistema de Eventos
        </h1>
        <p className="text-sm text-slate-500 text-center mb-6">
          {mode === 'login' ? 'Inicia sesión para continuar' : 'Crea tu cuenta'}
        </p>

        {mode === 'login' ? (
          <LoginForm onSwitchToRegister={() => setMode('register')} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setMode('login')} />
        )}
      </div>
    </div>
  );
}