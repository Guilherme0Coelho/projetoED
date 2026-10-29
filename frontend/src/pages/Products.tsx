import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { Page, Product } from '../types';

export default function Products() {
  const [data, setData] = useState<Page<Product> | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState(''); // termo efetivamente enviado (debounce)
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<string[]>('/products/categories').then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  // Debounce: só consulta a API 400ms após parar de digitar
  useEffect(() => {
    const t = setTimeout(() => { setQuery(search); setPage(0); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get<Page<Product>>('/products', {
        params: { search: query || undefined, category: category || undefined, page, size: 8 },
      })
      .then((res) => setData(res.data))
      .catch(() => setError('Erro ao carregar produtos.'))
      .finally(() => setLoading(false));
  }, [query, category, page]);

  const chip = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-sm border transition ${
      active ? 'bg-primary text-white border-primary' : 'bg-white border-slate-300 hover:bg-slate-100'
    }`;

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h1 className="text-2xl font-bold">Catálogo</h1>
          <input
            type="search"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filtro de categorias">
          <button className={chip(category === '')} onClick={() => { setCategory(''); setPage(0); }}>Todos</button>
          {categories.map((c) => (
            <button key={c} className={chip(category === c)} onClick={() => { setCategory(c); setPage(0); }}>
              {c}
            </button>
          ))}
        </div>

        {error && <p className="text-red-600">{error}</p>}
        {loading && <p className="text-slate-500">Carregando...</p>}
        {!loading && !error && data?.content.length === 0 && (
          <p className="text-slate-500">Nenhum produto encontrado.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data?.content.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 rounded-lg border border-slate-300 bg-white disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="text-sm text-slate-600">Página {page + 1} de {data.totalPages}</span>
            <button
              disabled={page + 1 >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-lg border border-slate-300 bg-white disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        )}
      </main>
    </>
  );
}
