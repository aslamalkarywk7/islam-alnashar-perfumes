import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {Instagram, Twitter} from 'lucide-react';
import {api} from '@/lib/api';
import type {Category} from '@/types';

export default function Footer() {
  const {t, i18n} = useTranslation();
  const [families, setFamilies] = useState<Category[]>([]);

  useEffect(() => {
    api<{categories: Category[]}>('/categories').then(r => setFamilies(r.categories)).catch(() => {});
  }, []);

  return (
    <footer className="bg-ink text-sand mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <h3 className="serif-title text-3xl tracking-[0.2em] uppercase mb-5">
            {i18n.language === 'ar' ? 'إسلام النشار' : 'Islam Al-Nashar'}
          </h3>
          <p className="text-sm text-sand/60 max-w-sm leading-relaxed mb-7">{t('footer.tagline')}</p>
          <div className="flex gap-4 text-sand/60">
            <a href="#" className="hover:text-gold transition-colors"><Instagram size={19} strokeWidth={1.5} /></a>
            <a href="#" className="hover:text-gold transition-colors"><Twitter size={19} strokeWidth={1.5} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-5 text-sand/80">{t('footer.quick_links')}</h4>
          <ul className="space-y-3 text-sm text-sand/60">
            <li><Link to="/perfumes" className="hover:text-gold transition-colors">{t('nav.products')}</Link></li>
            <li><Link to="/cart" className="hover:text-gold transition-colors">{t('nav.cart')}</Link></li>
            <li><Link to="/account/orders" className="hover:text-gold transition-colors">{t('order.my_orders')}</Link></li>
            <li><Link to="/account/wishlist" className="hover:text-gold transition-colors">{t('nav.wishlist')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-5 text-sand/80">{t('footer.categories')}</h4>
          <ul className="space-y-3 text-sm text-sand/60">
            {families.slice(0, 5).map(c => (
              <li key={c.id}>
                <Link to={`/perfumes?category=${c.slug}`} className="hover:text-gold transition-colors">
                  {i18n.language === 'ar' ? c.name_ar : c.name_en}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-sand/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] uppercase tracking-[0.15em] text-sand/40">
          <p>{t('footer.rights', {year: new Date().getFullYear()})}</p>
          <div className="flex gap-6">
            <span className="hover:text-gold cursor-pointer transition-colors">{t('footer.terms')}</span>
            <span className="hover:text-gold cursor-pointer transition-colors">{t('footer.privacy')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
