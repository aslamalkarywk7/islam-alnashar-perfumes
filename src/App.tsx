/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Menu, Search, ArrowRight, Instagram, Twitter } from 'lucide-react';

// Data
const PRODUCTS = [
  {
    id: 1,
    name: 'Oud Majestueux',
    price: '$280',
    notes: 'Agarwood, Rose, Amber',
    image: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Santal Blanc',
    price: '$210',
    notes: 'Sandalwood, Fig, Cardamom',
    image: 'https://images.unsplash.com/photo-1615397323389-918911571430?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Néroli Lumière',
    price: '$195',
    notes: 'Orange Blossom, Bergamot, Musk',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 4,
    name: 'Velvet Iris',
    price: '$240',
    notes: 'Iris, Vanilla, Leather',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop'
  }
];

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-sand text-ink selection:bg-gold selection:text-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-sand/90 backdrop-blur-md border-b border-ink-light py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button className="hover:opacity-70 transition-opacity"><Menu size={20} strokeWidth={1.5} /></button>
            <button className="hidden md:block hover:opacity-70 transition-opacity"><Search size={20} strokeWidth={1.5} /></button>
          </div>
          
          <a href="#" className="font-serif text-3xl tracking-widest uppercase">Aura</a>
          
          <div className="flex items-center gap-6">
            <button className="text-xs uppercase tracking-[0.2em] hidden md:block hover:opacity-70 transition-opacity">Account</button>
            <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="text-xs font-medium">0</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=2000&auto=format&fit=crop" 
            alt="Luxury Perfume Background" 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sand/30 via-transparent to-sand"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 mt-20">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs md:text-sm uppercase tracking-[0.3em] mb-6 font-medium"
          >
            The New Collection
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-6xl md:text-8xl lg:text-9xl leading-[0.85] font-light mb-8"
          >
            Essence of <br /> <span className="italic">Elegance</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button className="group flex items-center gap-4 mx-auto text-sm uppercase tracking-[0.15em] border-b border-ink pb-1 hover:text-gold hover:border-gold transition-colors">
              Discover the scent
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Vertical text decoration */}
        <div className="absolute left-6 bottom-12 hidden md:block">
          <p className="vertical-text text-ink/40">Est. 2026 — Paris</p>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-light mb-4">Signature <span className="italic">Scents</span></h2>
            <p className="text-sm text-ink/60 max-w-md leading-relaxed">Crafted with the rarest ingredients sourced from around the globe, our signature collection embodies timeless sophistication.</p>
          </div>
          <button className="text-xs uppercase tracking-[0.15em] border-b border-ink/30 pb-1 hover:border-ink transition-colors">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {PRODUCTS.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-sand-dark">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <button className="bg-sand text-ink px-6 py-3 text-xs uppercase tracking-[0.15em] translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-ink hover:text-sand">
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-serif text-2xl mb-2">{product.name}</h3>
                <p className="text-xs text-ink/50 uppercase tracking-widest mb-3">{product.notes}</p>
                <p className="text-sm font-medium">{product.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Editorial Section */}
      <section className="py-24 bg-ink text-sand">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative aspect-square md:aspect-[4/5] lg:aspect-square oval-mask overflow-hidden"
          >
            <img 
              src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1000&auto=format&fit=crop" 
              alt="Artisan creating perfume" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <div className="max-w-lg">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-[0.2em] text-gold mb-6"
            >
              The Art of Extraction
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl md:text-6xl font-light mb-8 leading-tight"
            >
              A symphony of <br/><span className="italic text-gold">pure botanicals</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sand/70 leading-relaxed mb-10 font-light"
            >
              Every bottle of Aura is a testament to the ancient art of perfumery. We source our ingredients from sustainable farms in Grasse, ensuring that each note resonates with authenticity and depth. The result is an olfactory experience that lingers in the memory long after the scent has faded.
            </motion.p>
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="border border-sand/30 px-8 py-4 text-xs uppercase tracking-[0.15em] hover:bg-sand hover:text-ink transition-colors"
            >
              Read Our Story
            </motion.button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto border-t border-ink-light mt-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-serif text-3xl tracking-widest uppercase mb-6">Aura</h3>
            <p className="text-sm text-ink/60 max-w-xs leading-relaxed mb-8">
              Elevating the everyday through the power of scent. Crafted in Paris, enjoyed worldwide.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-ink/60 hover:text-ink transition-colors"><Instagram size={20} strokeWidth={1.5} /></a>
              <a href="#" className="text-ink/60 hover:text-ink transition-colors"><Twitter size={20} strokeWidth={1.5} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] font-semibold mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-ink/70">
              <li><a href="#" className="hover:text-ink transition-colors">All Perfumes</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Discovery Set</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Gift Cards</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] font-semibold mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-ink/70">
              <li><a href="#" className="hover:text-ink transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Track Order</a></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-ink-light text-xs text-ink/50 uppercase tracking-widest">
          <p>&copy; 2026 Aura Perfumes. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-ink transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-ink transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
