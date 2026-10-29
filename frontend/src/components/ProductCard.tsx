import { Link } from 'react-router-dom';
import { Product } from '../types';

export const formatPrice = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Status visual de estoque: esgotado / últimas unidades / disponível
export function StockBadge({ stock }: { stock: number }) {
  const [label, cls] =
    stock === 0
      ? ['Esgotado', 'bg-red-50 text-red-700 border-red-200']
      : stock <= 10
        ? [`Últimas ${stock} unidades`, 'bg-amber-50 text-amber-700 border-amber-200']
        : ['Em estoque', 'bg-green-50 text-green-700 border-green-200'];
  return <span className={`inline-block text-xs font-medium border rounded-full px-2 py-0.5 ${cls}`}>{label}</span>;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
      <div className="relative aspect-[3/2] bg-slate-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className={`h-full w-full object-cover ${product.stock === 0 ? 'opacity-60' : ''}`}
          loading="lazy"
        />
        {product.category && (
          <span className="absolute top-2 left-2 text-xs bg-white/90 rounded-full px-2 py-0.5 text-slate-700">
            {product.category}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1 gap-1">
        <h3 className="font-semibold leading-snug line-clamp-2 min-h-[2.75rem]">{product.name}</h3>
        <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
        <StockBadge stock={product.stock} />
        <Link to={`/products/${product.id}`} className="mt-auto pt-3">
          <span className="block text-center bg-primary hover:bg-primary-dark text-white rounded-lg py-2 text-sm font-medium">
            Ver detalhes
          </span>
        </Link>
      </div>
    </div>
  );
}
