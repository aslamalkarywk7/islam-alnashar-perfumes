import {useTranslation} from 'react-i18next';
import {Link, useNavigate} from 'react-router-dom';
import {Minus, Plus, ShoppingBag, Trash2} from 'lucide-react';
import {EmptyState} from '@/components/ui';
import {useCart} from '@/context/CartContext';
import {FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, formatMoney} from '@/lib/money';

export default function CartPage() {
  const {t, i18n} = useTranslation();
  const {lines, subtotal, setQty, removeItem} = useCart();
  const navigate = useNavigate();

  if (lines.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 fade-up">
        <EmptyState
          title={t('cart.empty')}
          sub={t('cart.empty_sub')}
          action={
            <Link to="/perfumes" className="mt-2 h-11 px-7 bg-ink text-sand text-[11px] uppercase tracking-[0.18em] font-semibold flex items-center hover:bg-ink-light transition">
              {t('cart.continue_shopping')}
            </Link>
          }
        />
      </div>
    );
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const nameOf = (p: (typeof lines)[0]['product']) => (i18n.language === 'ar' ? p.name_ar : p.name_en);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 fade-up">
      <h1 className="serif-title text-3xl font-light mb-8 flex items-center gap-3">
        <ShoppingBag size={24} strokeWidth={1.25} className="text-brand-600" /> {t('cart.title')}
      </h1>

      <div className="grid lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 space-y-3">
          {lines.map(({product, qty}) => (
            <div key={product.id} className="bg-white/50 border border-ink/10 p-4 flex gap-4 items-center">
              <Link to={`/perfumes/${product.slug}`} className="w-24 h-28 overflow-hidden bg-sand-dark shrink-0">
                {product.images[0] && <img src={product.images[0]} alt="" className="w-full h-full object-cover" />}
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/perfumes/${product.slug}`} className="serif-title text-lg line-clamp-1 hover:text-brand-700 transition">
                  {nameOf(product)}
                </Link>
                <p className="text-[11px] text-ink/40 mt-1">{product.size_ml} ml · {product.concentration}</p>
                <p className="text-xs text-ink/50 mt-1">{formatMoney(product.price, i18n.language)}</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center border border-ink/15 h-8">
                    <button onClick={() => setQty(product.id, qty - 1)} className="w-8 h-full flex items-center justify-center text-ink/50 hover:text-ink">
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                    <button onClick={() => setQty(product.id, Math.min(product.stock, qty + 1))} disabled={qty >= product.stock} className="w-8 h-full flex items-center justify-center text-ink/50 hover:text-ink disabled:opacity-30">
                      <Plus size={12} />
                    </button>
                  </div>
                  <button onClick={() => removeItem(product.id)} className="p-2 text-ink/35 hover:text-red-500 transition" aria-label={t('cart.remove')}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <div className="text-end shrink-0">
                <p className="font-semibold">{formatMoney(product.price * qty, i18n.language)}</p>
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-white/50 border border-ink/10 p-6 lg:sticky lg:top-24">
          <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-5">{t('cart.order_summary')}</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/50">{t('cart.subtotal')}</dt>
              <dd className="font-medium">{formatMoney(subtotal, i18n.language)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/50">{t('cart.shipping')}</dt>
              <dd className="font-medium">
                {shipping === 0 ? <span className="text-emerald-700 font-semibold">{t('cart.free')}</span> : formatMoney(shipping, i18n.language)}
              </dd>
            </div>
            <hr className="border-ink/10" />
            <div className="flex justify-between text-base">
              <dt className="font-semibold">{t('cart.grand_total')}</dt>
              <dd className="font-bold text-brand-700">{formatMoney(subtotal + shipping, i18n.language)}</dd>
            </div>
          </dl>
          <button
            onClick={() => navigate('/checkout')}
            className="mt-6 w-full h-12 bg-ink text-sand text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-ink-light transition"
          >
            {t('cart.checkout')}
          </button>
          <Link to="/perfumes" className="block text-center mt-3 text-xs text-ink/45 hover:text-ink transition">
            {t('cart.continue_shopping')}
          </Link>
        </aside>
      </div>
    </div>
  );
}
