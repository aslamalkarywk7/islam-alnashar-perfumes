import {Link, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {Heart, ShoppingBag} from 'lucide-react';
import {toast} from './Toast';
import RatingStars from './RatingStars';
import {useAuth} from '@/context/AuthContext';
import {useCart} from '@/context/CartContext';
import {api} from '@/lib/api';
import {formatMoney} from '@/lib/money';
import type {Product} from '@/types';

/** Signature fragrance card — luxury editorial layout. */
export default function PerfumeCard({product}: {product: Product}) {
  const {t, i18n} = useTranslation();
  const {addItem} = useCart();
  const {user} = useAuth();
  const navigate = useNavigate();
  const name = i18n.language === 'ar' ? product.name_ar : product.name_en;
  const image = product.images[0];
  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    try {
      await addItem(product, 1);
      toast(t('toast.added_to_cart', {name}));
    } catch {
      /* handled at checkout */
    }
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await api('/wishlist', {method: 'POST', body: {product_id: product.id}});
      toast(t('product.added_to_wishlist'));
    } catch {
      /* duplicate is fine */
    }
  };

  return (
    <Link to={`/perfumes/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-sand-dark">
        {image ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
          />
        ) : (
          <div className="absolute inset-0 bg-ink/90 text-sand flex items-center justify-center p-6 text-center">
            <p className="serif-title text-xl leading-snug">{name}</p>
          </div>
        )}
        {discount > 0 && (
          <span className="absolute top-3 start-3 px-2.5 py-1 bg-ink text-sand text-[10px] font-bold tracking-[0.1em]">
            −{discount}%
          </span>
        )}
        <button
          onClick={toggleWishlist}
          aria-label={t('nav.wishlist')}
          className="absolute top-3 end-3 w-9 h-9 bg-sand/90 backdrop-blur rounded-full flex items-center justify-center text-ink/60 hover:text-red-500 transition"
        >
          <Heart size={15} strokeWidth={1.5} />
        </button>

        {/* Hover action */}
        <div className="absolute inset-0 bg-ink/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <button
            onClick={addToCart}
            disabled={product.stock <= 0}
            className="bg-sand text-ink px-6 py-3 text-[11px] uppercase tracking-[0.18em] translate-y-3 group-hover:translate-y-0 transition-all duration-500 hover:bg-ink hover:text-sand disabled:opacity-60 flex items-center gap-2"
          >
            <ShoppingBag size={14} strokeWidth={1.5} />
            {product.stock > 0 ? t('product.add_to_cart') : t('product.out_of_stock')}
          </button>
        </div>
      </div>

      <div className="text-center pt-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-brand-600 font-medium">
          {i18n.language === 'ar' ? product.category.name_ar : product.category.name_en}
        </p>
        <h3 className="serif-title text-xl mt-1.5 group-hover:text-brand-700 transition-colors">{name}</h3>
        <p className="text-[11px] text-ink/40 mt-1">{product.size_ml} ml · {product.concentration}</p>
        <div className="mt-1.5 flex justify-center">
          <RatingStars rating={product.rating_avg} showValue count={product.rating_count} size={12} />
        </div>
        <div className="mt-2 flex items-baseline justify-center gap-2">
          <span className="text-sm font-semibold">{formatMoney(product.price, i18n.language)}</span>
          {product.compare_at_price && (
            <span className="text-[11px] text-ink/35 line-through">{formatMoney(product.compare_at_price, i18n.language)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
