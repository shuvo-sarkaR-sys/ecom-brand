import Link from 'next/link';
import { Github, Twitter, Instagram, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink-soft mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <span className="text-white font-black text-sm">L</span>
              </div>
              <span className="text-xl font-black text-cream">LUXE<span className="text-brand-400">.</span></span>
            </Link>
            <p className="text-sm text-cream/40 leading-relaxed mb-6">
              Premium products curated for those who demand the best. Shop with confidence.
            </p>
            <div className="flex gap-3">
              {[Github, Twitter, Instagram, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 flex items-center justify-center rounded-xl bg-ink border border-white/5 text-cream/40 hover:text-cream hover:border-white/15 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold text-cream mb-4 text-sm">Shop</h4>
            <ul className="space-y-3">
              {['All Products', 'Electronics', 'Fashion', 'Home & Living', 'Featured'].map((item) => (
                <li key={item}>
                  <Link href="/products" className="text-sm text-cream/40 hover:text-cream transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-bold text-cream mb-4 text-sm">Account</h4>
            <ul className="space-y-3">
              {[
                { label: 'My Orders', href: '/orders' },
                { label: 'Profile', href: '/profile' },
                { label: 'Wishlist', href: '/wishlist' },
                { label: 'Sign In', href: '/login' },
                { label: 'Register', href: '/register' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-cream/40 hover:text-cream transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-bold text-cream mb-4 text-sm">Help</h4>
            <ul className="space-y-3">
              {['FAQ', 'Shipping Policy', 'Return Policy', 'Contact Us', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-cream/40 hover:text-cream transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-cream/25">© 2025 LUXE. All rights reserved. Built with Next.js & MongoDB.</p>
          <div className="flex items-center gap-4 text-xs text-cream/25">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
