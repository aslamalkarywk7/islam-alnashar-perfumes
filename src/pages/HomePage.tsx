import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {ArrowLeft, ArrowRight, Headset, RotateCcw, ShieldCheck, Truck} from 'lucide-react';
import PerfumeCard from '@/components/PerfumeCard';
import {Spinner} from '@/components/ui';
import {api} from '@/lib/api';
import type {Category, Product, ProductListResponse} from '@/types';

const PERKS = [
  {icon: Truck, key: 'shipping'},
  {icon: Headset, key: 'support'},
  {icon: RotateCcw, key: 'returns'},
  {icon: ShieldCheck, key: 'secure'},
] as const;

export default function HomePage() {
  const {t, i18n} = useTranslation();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [families, setFamilies] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const Arrow = i18n.language === 'ar' ? ArrowLeft : ArrowRight;

  useEffect(() => {
    Promise.all([
      api<ProductListResponse>('/products?featured=true&per_page=8'),
      api<ProductListResponse>('/products?sort=newest&per_page=8'),
      api<{categories: Category[]}>('/categories'),
    ])
      .then(([f, n, c]) => {
        setFeatured(f.items);
        setNewArrivals(n.items);
        setFamilies(c.categories);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label={t('common.loading')} />;

  return (
    <div className="fade-up">
      {/* Hero */}
      <section className="relative h-[86vh] min-h-[560px] flex items-center justify-center overflow-hidden">
        <img
          src="/images/hero.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/30 to-sand" />
        <div className="relative z-10 text-center px-6 mt-10 max-w-4xl">
          <p className="text-[11px] md:text-xs uppercase tracking-[0.35em] text-sand/80 mb-6 font-medium">
            {t('home.hero_badge')}
          </p>
          <h1 className="serif-title text-5xl md:text-7xl lg:text-8xl text-sand leading-[0.95] mb-7 font-light">
            {t('home.hero_title')}
          </h1>
          <p className="text-sand/70 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-9">
            {t('home.hero_sub')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/perfumes"
              className="h-12 px-8 bg-sand text-ink text-[11px] uppercase tracking-[0.2em] font-semibold flex items-center gap-3 hover:bg-gold hover:text-ink transition"
            >
              {t('home.hero_cta')} <Arrow size={14} />
            </Link>
            <Link
              to="/perfumes"
              className="h-12 px-8 border border-sand/40 text-sand text-[11px] uppercase tracking-[0.2em] font-medium flex items-center hover:bg-sand/10 transition"
            >
              {t('home.hero_cta2')}
            </Link>
          </div>
        </div>
        <div className="absolute bottom-10 start-6 hidden md:block">
          <p className="vertical-text text-sand/40">Est. 2026 — Paris · Riyadh</p>
        </div>
      </section>

      {/* Perks */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-ink/10 border border-ink/10">
          {PERKS.map(({icon: Icon, key}) => (
            <div key={key} className="bg-sand p-5 flex items-center gap-3">
              <Icon size={20} strokeWidth={1.25} className="text-brand-600 shrink-0" />
              <div className="min-w-0">
                <h3 className="text-[11px] uppercase tracking-[0.15em] font-semibold">{t(`home.perk_${key}_title`)}</h3>
                <p className="text-[11px] text-ink/45 mt-0.5 truncate">{t(`home.perk_${key}_sub`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Families */}
      <section className="max-w-7xl mx-auto px-4 pt-20">
        <div className="text-center mb-10">
          <h2 className="serif-title text-3xl md:text-4xl font-light">{t('home.categories_title')}</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {families.map(f => (
            <Link
              key={f.id}
              to={`/perfumes?category=${f.slug}`}
              className="px-6 py-3 border border-ink/15 text-[11px] uppercase tracking-[0.2em] hover:bg-ink hover:text-sand transition-colors"
            >
              {i18n.language === 'ar' ? f.name_ar : f.name_en}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 pt-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="serif-title text-3xl md:text-4xl font-light">{t('home.featured')}</h2>
            <p className="text-xs text-ink/45 mt-2 max-w-md">
              {i18n.language === 'ar'
                ? 'توقيع الدار: عطور بتركيز عالٍ وثبات يدوم أكثر من 10 ساعات.'
                : "The maison's signature: high concentration, over 10 hours of presence."}
            </p>
          </div>
          <Link to="/perfumes" className="text-[11px] uppercase tracking-[0.2em] border-b border-ink/30 pb-1 hover:border-ink transition-colors flex items-center gap-2">
            {t('home.view_all')} <Arrow size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {featured.map(p => <PerfumeCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Story */}
      <section className="mt-20 bg-ink text-sand py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
          <div className="relative aspect-square overflow-hidden" style={{clipPath: 'ellipse(45% 50% at 50% 50%)'}}>
            <img src="/images/perfumes/oud-royal.webp" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="max-w-lg">
            <p className="text-[11px] uppercase tracking-[0.25em] text-gold mb-5">{t('home.story_eyebrow')}</p>
            <h2 className="serif-title text-4xl md:text-5xl font-light leading-tight mb-7">
              {t('home.story_title')}
            </h2>
            <p className="text-sand/65 leading-relaxed mb-8 text-sm">{t('home.story_text')}</p>
            <Link
              to="/perfumes"
              className="inline-flex border border-sand/30 px-8 py-4 text-[11px] uppercase tracking-[0.2em] hover:bg-sand hover:text-ink transition-colors"
            >
              {t('home.story_cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="max-w-7xl mx-auto px-4 pt-20">
        <h2 className="serif-title text-3xl md:text-4xl font-light mb-8">{t('home.new_arrivals')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {newArrivals.slice(0, 4).map(p => <PerfumeCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
