'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/lib/cart-store';
import {
  ShoppingCart, Search, Menu, X, User, Heart,
  Package, LogOut, LayoutDashboard, ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { data: session } = useSession();
  const { getTotalItems, toggleCart } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const totalItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/products', label: 'All Products' },
    { href: '/products?category=electronics', label: 'Electronics' },
    { href: '/products?category=fashion', label: 'Fashion' },
    { href: '/products?category=home', label: 'Home & Living' },
    { href: '/products?featured=true', label: '✦ Featured' },
  ];

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled ? 'glass-strong shadow-lg' : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <span className="text-white font-black text-sm">L</span>
              </div>
              <span className="text-xl font-black tracking-tight text-cream">
                LUXE<span className="text-brand-400">.</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm text-cream/70 hover:text-cream hover:bg-white/5 rounded-lg transition-all duration-200 font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="btn-ghost p-2 hidden sm:flex"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              {session && (
                <Link href="/wishlist" className="btn-ghost p-2 hidden sm:flex">
                  <Heart size={20} />
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative btn-ghost p-2"
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {session ? (
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {session.user.name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <ChevronDown size={14} className="text-cream/50" />
                  </button>

                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-2xl shadow-xl z-50 overflow-hidden border border-white/10">
                        <div className="p-3 border-b border-white/5">
                          <p className="text-sm font-semibold text-cream truncate">{session.user.name}</p>
                          <p className="text-xs text-cream/40 truncate">{session.user.email}</p>
                        </div>
                        <div className="p-2">
                          {session.user.role === 'admin' && (
                            <Link
                              href="/dashboard"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 text-sm text-brand-400 hover:bg-brand-500/10 rounded-lg transition-all"
                            >
                              <LayoutDashboard size={16} />
                              Admin Dashboard
                            </Link>
                          )}
                          <Link
                            href="/orders"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-cream/70 hover:text-cream hover:bg-white/5 rounded-lg transition-all"
                          >
                            <Package size={16} />
                            My Orders
                          </Link>
                          <Link
                            href="/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-cream/70 hover:text-cream hover:bg-white/5 rounded-lg transition-all"
                          >
                            <User size={16} />
                            Profile
                          </Link>
                          <button
                            onClick={() => { signOut(); setIsUserMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <LogOut size={16} />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/login" className="hidden sm:flex btn-primary py-2 px-4 text-sm">
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="btn-ghost p-2 lg:hidden"
              >
                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileOpen && (
          <div className="lg:hidden glass-strong border-t border-white/5">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="block px-4 py-3 text-cream/70 hover:text-cream hover:bg-white/5 rounded-xl transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-white/5">
                {session ? (
                  <>
                    {session.user.role === 'admin' && (
                      <Link href="/dashboard" onClick={() => setIsMobileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-brand-400 hover:bg-brand-500/10 rounded-xl transition-all">
                        <LayoutDashboard size={16} /> Admin Dashboard
                      </Link>
                    )}
                    <Link href="/orders" onClick={() => setIsMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-cream/70 hover:text-cream hover:bg-white/5 rounded-xl transition-all">
                      <Package size={16} /> My Orders
                    </Link>
                    <button onClick={() => signOut()}
                      className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all w-full">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setIsMobileOpen(false)}
                    className="block btn-primary text-center">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20 px-4">
          <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)} />
          <div className="relative w-full max-w-2xl glass-strong rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="flex items-center gap-3 p-4">
              <Search size={20} className="text-cream/40 flex-shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                    setIsSearchOpen(false);
                  }
                  if (e.key === 'Escape') setIsSearchOpen(false);
                }}
                className="flex-1 bg-transparent text-cream placeholder-cream/30 outline-none text-lg"
              />
              <button onClick={() => setIsSearchOpen(false)} className="text-cream/40 hover:text-cream">
                <X size={20} />
              </button>
            </div>
            <div className="px-4 py-3 border-t border-white/5 text-sm text-cream/30">
              Press <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-xs">Enter</kbd> to search or{' '}
              <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-xs">Esc</kbd> to close
            </div>
          </div>
        </div>
      )}
    </>
  );
}
