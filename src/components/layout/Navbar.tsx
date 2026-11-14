import {useState} from 'react';
import {Link, NavLink, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {Menu, Search, ShoppingBag, X, LogOut, User as UserIcon, Heart, LayoutDashboard} from 'lucide-react';
import {useAuth} from '@/context/AuthContext';
import {useCart} from '@/context/CartContext';

export default function Navbar() {
  const {t, i18n} = useTranslation();
  const {user, logout} = useAuth();
  const {count} = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(query.trim() ? `/perfumes?q=${encodeURIComponent(query.trim())}` : '/perfumes');
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-sand/90 backdrop-blur-md border-b border-ink/10">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center gap-4">
        {/* Mobile menu */}
        <button className="md:hidden p-2 rounded-lg hover:bg-ink/5" onClick={() => setMobileOpen(o => !o)}>
          {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>

        {/* Links (desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-[11px] uppercase tracking-[0.18em]">
          <NavLink to="/" end className="hover:text-brand-600 transition-colors">{t('nav.home')}</NavLink>
          <NavLink to="/perfumes" className="hover:text-brand-600 transition-colors">{t('nav.products')}</NavLink>
        </nav>

        {/* Brand */}
        <Link to="/" className="flex-1 md:flex-none text-center mx-auto">
          <span className="serif-title block text-2xl md:text-[26px] tracking-[0.18em] uppercase leading-none">
            {i18n.language === 'ar' ? 'إسلام النشار' : 'Islam Al-Nashar'}
          </span>
          <span className="block text-[9px] uppercase tracking-[0.3em] text-ink/40 mt-1">{t('brand_tag')}</span>
        </Link>

        <div className="hidden md:block flex-1" />

        {/* Search */}
        <form onSubmit={submitSearch} className="hidden lg:flex relative w-56">
          <Search size={15} strokeWidth={1.5} className="absolute top-1/2 -translate-y-1/2 text-ink/40" style={{insetInlineStart: 10}} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('common.search')}
            className="w-full h-9 bg-transparent border border-ink/15 rounded-full ps-8 pe-3 text-xs focus:outline-none focus:border-ink transition"
          />
        </form>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')}
            className="px-2.5 h-9 text-[11px] uppercase tracking-[0.15em] font-medium hover:text-brand-600 transition"
          >
            {t('nav.language')}
          </button>

          <Link to="/cart" className="relative p-2.5 rounded-full hover:bg-ink/5 transition" aria-label={t('nav.cart')}>
            <ShoppingBag size={19} strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute -top-0 -end-0 min-w-[18px] h-[18px] px-1 bg-ink text-sand text-[10px] font-bold rounded-full flex items-center justify-center">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button onClick={() => setUserMenuOpen(o => !o)} className="w-9 h-9 rounded-full bg-ink text-sand text-xs font-bold flex items-center justify-center">
                {user.name.charAt(0).toUpperCase()}
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute top-full mt-2 end-0 z-20 w-52 bg-white rounded-xl shadow-xl border border-ink/10 py-1.5 fade-up">
                    <Link to="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-sand">
                      <UserIcon size={15} /> {t('nav.account')}
                    </Link>
                    <Link to="/account/wishlist" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-sand">
                      <Heart size={15} /> {t('nav.wishlist')}
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-700 font-medium hover:bg-sand">
                        <LayoutDashboard size={15} /> {t('nav.admin')}
                      </Link>
                    )}
                    <hr className="my-1.5 border-ink/10" />
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); navigate('/'); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={15} /> {t('nav.logout')}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/login" className="h-9 px-4 rounded-full border border-ink text-[11px] uppercase tracking-[0.15em] font-medium flex items-center hover:bg-ink hover:text-sand transition">
              {t('nav.login')}
            </Link>
          )}
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-ink/10 bg-sand px-4 py-3 space-y-2">
          <form onSubmit={submitSearch} className="relative">
            <Search size={15} strokeWidth={1.5} className="absolute top-1/2 -translate-y-1/2 text-ink/40" style={{insetInlineStart: 10}} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t('common.search')}
              className="w-full h-10 bg-white/60 border border-ink/15 rounded-xl ps-8 pe-3 text-sm focus:outline-none"
            />
          </form>
          <NavLink to="/" end onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm uppercase tracking-[0.15em] hover:bg-ink/5">
            {t('nav.home')}
          </NavLink>
          <NavLink to="/perfumes" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm uppercase tracking-[0.15em] hover:bg-ink/5">
            {t('nav.products')}
          </NavLink>
        </div>
      )}
    </header>
  );
}
