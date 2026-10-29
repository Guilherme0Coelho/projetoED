import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/products" className="text-xl font-bold text-primary">Loja ED</Link>
        {user && (
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden sm:inline text-slate-600">Olá, {user.name}</span>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
