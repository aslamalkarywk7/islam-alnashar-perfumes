import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {Droplets, Heart, Minus, Plus, ShoppingBag, Star} from 'lucide-react';
import PerfumeCard from '@/components/PerfumeCard';
import RatingStars from '@/components/RatingStars';
import {toast} from '@/components/Toast';
import {EmptyState, Spinner} from '@/components/ui';
import {useAuth} from '@/context/AuthContext';
import {useCart} from '@/context/CartContext';
import {api} from '@/lib/api';
import {formatMoney} from '@/lib/money';
import type {Product, Review} from '@/types';

interface ProductResponse {
  product: Product;
  related: Product[];
}

export default function PerfumePage() {
  const {slug} = useParams<{slug: string}>();
  const {t, i18n} = useTranslation();
  const {addItem} = useCart();
  const {user} = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({rating: 5, title: '', body: ''});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setQty(1);
    setActiveImage(0);
    api<ProductResponse>(`/products/${slug}`)
      .then(setData)
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!data) return;
    api<{reviews: Review[]}>(`/products/${data.product.id}/reviews`).then(r => setReviews(r.reviews));
  }, [data]);

  if (loading) return <Spinner label={t('common.loading')} />;
  if (!data) return <EmptyState title={t('notfound.title')} />;

  const {product, related} = data;
  const name = i18n.language === 'ar' ? product.name_ar : product.name_en;
  const description = i18n.language === 'ar' ? product.description_ar : product.description_en;
  const notes = i18n.language === 'ar' ? product.notes.ar : product.notes.en;

  const add = async (buyNow = false) => {
    if (product.stock <= 0) return;
    try {
      await addItem(product, qty);
      toast(t('toast.added_to_cart', {name}));
      if (buyNow) navigate('/cart');
    } catch {
      /* handled at checkout */
    }
  };

  const toggleWishlist = async () => {
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

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setSubmitting(true);
    try {
      await api(`/products/${product.id}/reviews`, {method: 'POST', body: reviewForm});
      toast(t('product.review_submitted'));
      setReviewForm({rating: 5, title: '', body: ''});
      const r = await api<{reviews: Review[]}>(`/products/${product.id}/reviews`);
      setReviews(r.reviews);
      const refreshed = await api<ProductResponse>(`/products/${slug}`);
      setData(refreshed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 fade-up">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="aspect-[3/4] overflow-hidden bg-sand-dark">
            {product.images[activeImage] && (
              <img src={product.images[activeImage]} alt={name} className="w-full h-full object-cover" />
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 overflow-hidden border-2 transition ${i === activeImage ? 'border-ink' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-brand-600 font-semibold">
            {i18n.language === 'ar' ? product.category.name_ar : product.category.name_en} · {product.brand}
          </p>
          <h1 className="serif-title text-4xl md:text-5xl font-light mt-3 leading-tight">{name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <RatingStars rating={product.rating_avg} showValue count={product.rating_count} size={15} />
            <span className="text-ink/20">|</span>
            <span className={`text-[11px] uppercase tracking-[0.15em] font-semibold ${product.stock > 0 ? 'text-emerald-700' : 'text-red-500'}`}>
              {product.stock > 0
                ? product.stock <= 5
                  ? t('product.stock_left', {count: product.stock})
                  : t('product.in_stock')
                : t('product.out_of_stock')}
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-semibold">{formatMoney(product.price, i18n.language)}</span>
            {product.compare_at_price && (
              <span className="text-base text-ink/35 line-through">{formatMoney(product.compare_at_price, i18n.language)}</span>
            )}
          </div>

          {/* Notes */}
          {notes.length > 0 && (
            <div className="mt-7">
              <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 flex items-center gap-2">
                <Droplets size={14} strokeWidth={1.5} /> {t('product.notes')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {notes.map(n => (
                  <span key={n} className="px-3 py-1.5 border border-ink/15 text-xs text-ink/70">{n}</span>
                ))}
              </div>
            </div>
          )}

          {/* Qty + actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center border border-ink/15 h-12">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1} className="w-11 h-full flex items-center justify-center text-ink/60 hover:text-ink disabled:opacity-30">
                <Minus size={15} />
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock || 1, q + 1))} disabled={qty >= product.stock} className="w-11 h-full flex items-center justify-center text-ink/60 hover:text-ink disabled:opacity-30">
                <Plus size={15} />
              </button>
            </div>
            <button
              onClick={() => add(false)}
              disabled={product.stock <= 0}
              className="h-12 px-7 bg-ink text-sand text-[11px] uppercase tracking-[0.2em] font-semibold flex items-center gap-2 hover:bg-ink-light disabled:opacity-40 transition"
            >
              <ShoppingBag size={15} strokeWidth={1.5} /> {t('product.add_to_cart')}
            </button>
            <button
              onClick={() => add(true)}
              disabled={product.stock <= 0}
              className="h-12 px-7 border border-ink text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-ink hover:text-sand disabled:opacity-40 transition"
            >
              {t('product.buy_now')}
            </button>
            <button
              onClick={toggleWishlist}
              aria-label={t('nav.wishlist')}
              className="w-12 h-12 border border-ink/15 flex items-center justify-center text-ink/50 hover:text-red-500 hover:border-red-200 transition"
            >
              <Heart size={17} strokeWidth={1.5} />
            </button>
          </div>

          {/* Meta */}
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm max-w-md">
            <dt className="text-ink/40 uppercase text-[10px] tracking-[0.15em] self-center">{t('product.size')}</dt>
            <dd className="font-medium">{product.size_ml} ml</dd>
            <dt className="text-ink/40 uppercase text-[10px] tracking-[0.15em] self-center">{t('product.concentration')}</dt>
            <dd className="font-medium">{product.concentration}</dd>
            <dt className="text-ink/40 uppercase text-[10px] tracking-[0.15em] self-center">{t('product.family')}</dt>
            <dd className="font-medium">
              <Link to={`/perfumes?category=${product.category.slug}`} className="text-brand-700 hover:underline">
                {i18n.language === 'ar' ? product.category.name_ar : product.category.name_en}
              </Link>
            </dd>
            <dt className="text-ink/40 uppercase text-[10px] tracking-[0.15em] self-center">{t('product.sku')}</dt>
            <dd className="font-medium" dir="ltr">{product.sku}</dd>
          </dl>

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-3">{t('product.description')}</h2>
            <p className="text-ink/60 leading-relaxed text-sm">{description}</p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16 max-w-3xl">
        <h2 className="serif-title text-2xl font-light mb-6">{t('product.reviews', {count: reviews.length})}</h2>

        {reviews.length === 0 && <p className="text-sm text-ink/40 mb-6">{t('product.no_reviews')}</p>}

        <div className="space-y-3">
          {reviews.map(r => (
            <article key={r.id} className="bg-white/50 border border-ink/10 p-5">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-ink text-sand text-sm font-bold flex items-center justify-center">
                    {r.user_name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{r.user_name}</p>
                    <RatingStars rating={r.rating} size={12} />
                  </div>
                </div>
                <time className="text-[11px] text-ink/35">{new Date(r.created_at).toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US')}</time>
              </div>
              {r.title && <h3 className="font-semibold text-sm mb-1">{r.title}</h3>}
              {r.body && <p className="text-sm text-ink/55 leading-relaxed">{r.body}</p>}
            </article>
          ))}
        </div>

        <form onSubmit={submitReview} className="mt-8 bg-white/50 border border-ink/10 p-6">
          <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-4">{t('product.write_review')}</h3>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-ink/50">{t('product.your_rating')}:</span>
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} type="button" onClick={() => setReviewForm(f => ({...f, rating: n}))} className={n <= reviewForm.rating ? 'text-amber-400' : 'text-ink/20 hover:text-amber-200'}>
                <Star size={20} fill="currentColor" strokeWidth={0} />
              </button>
            ))}
          </div>
          <input
            value={reviewForm.title}
            onChange={e => setReviewForm(f => ({...f, title: e.target.value}))}
            placeholder={t('product.review_title')}
            className="w-full h-11 px-4 border border-ink/15 bg-transparent text-sm focus:outline-none focus:border-ink mb-3"
          />
          <textarea
            value={reviewForm.body}
            onChange={e => setReviewForm(f => ({...f, body: e.target.value}))}
            placeholder={t('product.review_body')}
            rows={3}
            className="w-full px-4 py-3 border border-ink/15 bg-transparent text-sm focus:outline-none focus:border-ink mb-4 resize-none"
          />
          <button disabled={submitting} className="h-11 px-7 bg-ink text-sand text-[11px] uppercase tracking-[0.18em] font-semibold hover:bg-ink-light disabled:opacity-50 transition">
            {t('product.submit_review')}
          </button>
        </form>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="serif-title text-2xl font-light mb-8">{t('product.related')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {related.map(p => <PerfumeCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
