import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { formatPrice, StockBadge } from '../components/ProductCard';
import { Product } from '../types';

// Galeria: mesma foto em 3 enquadramentos (visão geral / zoom centro / zoom lateral).
// O catálogo possui 1 foto por produto; trocar por lista de URLs exige apenas mudar este array.
const VIEWS = [
  { label: 'Visão geral', cls: 'object-cover object-center scale-100' },
  { label: 'Zoom centro', cls: 'object-cover object-center scale-150' },
  { label: 'Zoom lateral', cls: 'object-cover object-right scale-150' },
];

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [view, setView] = useState(0);
  const [bought, setBought] = useState<number | null>(null);

  useEffect(() => {
    api
      .get<Product>(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError('Produto não encontrado.'));
  }, [id]);

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <nav aria-label="breadcrumb" className="text-sm text-slate-500">
          <Link to="/products" className="hover:underline">Catálogo</Link>
          {product?.category && <> <span>/</span> {product.category}</>}
          {product && <> <span>/</span> <span className="text-slate-800">{product.name}</span></>}
        </nav>

        {error && <p className="mt-6 text-red-600">{error}</p>}
        {!product && !error && <p className="mt-6 text-slate-500">Carregando...</p>}

        {product && (
          <div className="mt-6 grid md:grid-cols-2 gap-8 bg-white rounded-2xl border border-slate-200 p-6">
            <div>
              <div className="aspect-[3/2] overflow-hidden rounded-xl bg-slate-100">
                <img src={product.imageUrl} alt={product.name} className={`h-full w-full transition ${VIEWS[view].cls}`} />
              </div>
              <div className="mt-3 flex gap-2">
                {VIEWS.map((v, i) => (
                  <button
                    key={v.label}
                    onClick={() => setView(i)}
                    aria-label={v.label}
                    className={`h-16 w-20 overflow-hidden rounded-lg border-2 ${view === i ? 'border-primary' : 'border-slate-200'}`}
                  >
                    <img src={product.imageUrl} alt="" className={`h-full w-full ${v.cls}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
              <p className="text-2xl font-bold text-primary mt-2">{formatPrice(product.price)}</p>
              <div className="mt-2"><StockBadge stock={product.stock} /></div>
              <p className="mt-4 text-slate-600">{product.description}</p>

              {product.specs && (
                <div className="mt-4">
                  <h2 className="font-semibold mb-2">Especificações técnicas</h2>
                  <dl className="text-sm divide-y divide-slate-100 border border-slate-200 rounded-lg">
                    {product.specs.split('\n').map((line) => {
                      const [k, ...v] = line.split(':');
                      return (
                        <div key={line} className="flex px-3 py-2 gap-3">
                          <dt className="w-2/5 text-slate-500">{k}</dt>
                          <dd className="flex-1">{v.join(':').trim()}</dd>
                        </div>
                      );
                    })}
                  </dl>
                </div>
              )}

              {bought !== null && (
                <div role="status" className="mt-4 bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-2 text-sm">
                  Compra simulada realizada com sucesso! ({bought} {bought === 1 ? 'unidade' : 'unidades'})
                </div>
              )}

              <div className="mt-auto pt-6 flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-lg">
                  <button aria-label="Diminuir" disabled={qty <= 1} onClick={() => setQty(qty - 1)} className="px-3 py-2 disabled:opacity-40">−</button>
                  <span aria-live="polite" className="w-8 text-center">{qty}</span>
                  <button aria-label="Aumentar" disabled={qty >= product.stock} onClick={() => setQty(qty + 1)} className="px-3 py-2 disabled:opacity-40">+</button>
                </div>
                <button
                  disabled={product.stock === 0}
                  onClick={() => setBought(qty)} // compra simulada: sem chamada à API
                  className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-medium rounded-lg py-3"
                >
                  {product.stock === 0 ? 'Indisponível' : 'Comprar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
