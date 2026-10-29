import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/products';

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Durante o envio (loading) não redireciona, para exibir o feedback de sucesso
  if (user && !loading) return <Navigate to="/products" replace />;

  // Validação básica no cliente; a validação definitiva é a do backend.
  const fieldErrors = {
    name: mode === 'register' && name.trim().length < 2 ? 'Informe seu nome (mín. 2 caracteres).' : '',
    email: !/^\S+@\S+\.\S+$/.test(email) ? 'E-mail inválido.' : '',
    password: password.length < 6 ? 'A senha deve ter ao menos 6 caracteres.' : '',
  };
  const shownError = (f: keyof typeof fieldErrors) => (submitted ? fieldErrors[f] : '');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (fieldErrors.name || fieldErrors.email || fieldErrors.password) return;
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') await login(email, password);
      else await register(name, email, password);
      setSuccess(true); // feedback de sucesso antes de redirecionar
      await new Promise((r) => setTimeout(r, 600));
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Não foi possível conectar ao servidor.',
      );
    } finally {
      setLoading(false);
    }
  };

  // Borda vermelha = inválido (após tentar enviar); verde = válido
  const input = (f: keyof typeof fieldErrors) =>
    `w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${
      !submitted ? 'border-slate-300' : fieldErrors[f] ? 'border-red-500 bg-red-50' : 'border-green-500'
    }`;
  const hint = (f: keyof typeof fieldErrors) =>
    shownError(f) && <p className="text-xs text-red-600 mt-1">{shownError(f)}</p>;

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white rounded-2xl shadow-md border border-slate-200 p-8 space-y-4">
        <h1 className="text-2xl font-bold text-center text-primary">Loja ED</h1>
        <p className="text-center text-sm text-slate-500">
          {mode === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}
        </p>

        {success && (
          <div role="status" className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-3 py-2">
            {mode === 'login' ? 'Login realizado!' : 'Conta criada com sucesso!'} Redirecionando...
          </div>
        )}
        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {mode === 'register' && (
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">Nome</label>
            <input id="name" className={input('name')} value={name} onChange={(e) => setName(e.target.value)} />
            {hint('name')}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">E-mail</label>
          <input id="email" type="email" className={input('email')} value={email} onChange={(e) => setEmail(e.target.value)} />
          {hint('email')}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">Senha</label>
          <input id="password" type="password" className={input('password')} value={password} onChange={(e) => setPassword(e.target.value)} />
          {hint('password')}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-medium rounded-lg py-2"
        >
          {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
        </button>

        <p className="text-center text-sm text-slate-600">
          {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
          <button
            type="button"
            className="text-primary font-medium hover:underline"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSubmitted(false); }}
          >
            {mode === 'login' ? 'Cadastre-se' : 'Entrar'}
          </button>
        </p>
      </form>
    </main>
  );
}
