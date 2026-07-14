import LoginForm from '../components/LoginForm.jsx';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-1 text-center">
          Sistema de Eventos
        </h1>
        <p className="text-sm text-slate-500 text-center mb-6">
          Inicia sesión para continuar
        </p>

        <LoginForm />
      </div>
    </div>
  );
}
