import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useSearchParams} from 'react-router-dom';
import {SlidersHorizontal} from 'lucide-react';
import Pagination from '@/components/Pagination';
import PerfumeCard from '@/components/PerfumeCard';
import {EmptyState, Spinner} from '@/components/ui';
import {formatMoney} from '@/lib/money';
import {api} from '@/lib/api';
import type {Category, ProductListResponse} from '@/types';

const SORTS = ['newest', 'price_asc', 'price_desc', 'rating', 'name'] as const;

export default function CatalogPage() {
  const {t, i18n} = useTranslation();
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState<ProductListResponse | null>(null);
  const [families, setFamilies] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [minInput, setMinInput] = useState(params.get('price_min') ?? '');
  const [maxInput, setMaxInput] = useState(params.get('price_max') ?? '');

  const q = params.get('q') ?? '';
  const category = params.get('category') ?? '';
  const sort = params.get('sort') ?? 'newest';
  const page = Number(params.get('page')) || 1;
  const featured = params.get('featured') === 'true';
  const priceMin = params.get('price_min') ?? '';
  const priceMax = params.get('price_max') ?? '';

  useEffect(() => {
    api<{categories: Category[]}>('/categories').then(r => setFamilies(r.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    setMinInput(params.get('price_min') ?? '');
    setMaxInput(params.get('price_max') ?? '');
  }, [params]);

  useEffect(() => {
    setLoading(true);
    const usp = new URLSearchParams();
    if (q) usp.set('q', q);
    if (category) usp.set('category', category);
    if (sort) usp.set('sort', sort);
    if (featured) usp.set('featured', 'true');
    if (priceMin) usp.set('price_min', String(Number(priceMin) * 100));
    if (priceMax) usp.set('price_max', String(Number(priceMax) * 100));
    usp.set('page', String(page));
    usp.set('per_page', '12');
    api<ProductListResponse>(`/products?${usp.toString()}`)
      .then(setData)
      .finally(() => setLoading(false));
  }, [q, category, sort, page, featured, priceMin, priceMax]);

  const patch = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === '') next.delete(k);
      else next.set(k, v);
    }
    if (!('page' in updates)) next.delete('page');
    setParams(next);
  };

  const activeFamily = families.find(c => c.slug === category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 fade-up">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="serif-title text-3xl md:text-4xl font-light">
            {featured ? t('home.featured') : activeFamily ? (i18n.language === 'ar' ? activeFamily.name_ar : activeFamily.name_en) : t('catalog.title')}
          </h1>
          {data && <p className="text-[11px] uppercase tracking-[0.2em] text-ink/40 mt-2">{t('catalog.results_count', {total: data.total})}</p>}
        </div>
        <div className="flex items-center gap-3">
          <SlidersHorizontal size={15} strokeWidth={1.5} className="text-ink/40" />
          <select
            value={sort}
            onChange={e => patch({sort: e.target.value})}
            className="h-10 px-3 rounded-none border border-ink/15 bg-transparent text-xs uppercase tracking-[0.1em] focus:outline-none focus:border-ink"
          >
            {SORTS.map(s => <option key={s} value={s}>{t(`catalog.sort_${s}`)}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Filters */}
        <aside className="lg:w-60 shrink-0 space-y-8">
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-4">{t('catalog.categories')}</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <button
                  onClick={() => patch({category: null, featured: null})}
                  className={`w-full text-start px-3 py-2 transition ${!category && !featured ? 'bg-ink text-sand' : 'text-ink/60 hover:bg-ink/5'}`}
                >
                  {t('catalog.all_categories')}
                </button>
              </li>
              {families.map(c => (
                <li key={c.id}>
                  <button
                    onClick={() => patch({category: c.slug, featured: null})}
                    className={`w-full text-start px-3 py-2 transition ${category === c.slug ? 'bg-ink text-sand' : 'text-ink/60 hover:bg-ink/5'}`}
                  >
                    {i18n.language === 'ar' ? c.name_ar : c.name_en}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-4">{t('catalog.price_range')}</h3>
            <div className="flex items-center gap-2">
              <input
                type="number" min={0} value={minInput} onChange={e => setMinInput(e.target.value)}
                placeholder={t('catalog.min_price')}
                className="w-full h-10 px-3 border border-ink/15 bg-transparent text-sm focus:outline-none focus:border-ink"
              />
              <span className="text-ink/30">—</span>
              <input
                type="number" min={0} value={maxInput} onChange={e => setMaxInput(e.target.value)}
                placeholder={t('catalog.max_price')}
                className="w-full h-10 px-3 border border-ink/15 bg-transparent text-sm focus:outline-none focus:border-ink"
              />
            </div>
            <p className="text-[10px] text-ink/35 mt-2">{formatMoney(0, i18n.language)} – {formatMoney(100000, i18n.language)}</p>
            <button
              onClick={() => patch({price_min: minInput, price_max: maxInput})}
              className="mt-3 w-full h-10 bg-ink text-sand text-[11px] uppercase tracking-[0.15em] hover:bg-ink-light transition"
            >
              {t('catalog.apply')}
            </button>
            {(category || q || priceMin || priceMax || featured) && (
              <button
                onClick={() => { setMinInput(''); setMaxInput(''); setParams(new URLSearchParams()); }}
                className="mt-2 w-full h-10 border border-ink/15 text-ink/60 text-[11px] uppercase tracking-[0.15em] hover:bg-ink/5 transition"
              >
                {t('catalog.clear')}
              </button>
            )}
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {loading ? (
            <Spinner label={t('common.loading')} />
          ) : data && data.items.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
                {data.items.map(p => <PerfumeCard key={p.id} product={p} />)}
              </div>
              <Pagination page={data.page} pages={data.pages} onPage={p => patch({page: String(p)})} />
            </>
          ) : (
            <EmptyState
              title={t('catalog.no_results')}
              sub={t('catalog.no_results_sub')}
              action={
                <Link to="/perfumes" className="mt-2 h-10 px-6 bg-ink text-sand text-[11px] uppercase tracking-[0.15em] flex items-center">
                  {t('catalog.clear')}
                </Link>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
