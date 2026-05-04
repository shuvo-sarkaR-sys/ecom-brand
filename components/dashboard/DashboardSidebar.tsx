'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  BarChart3, Settings, Tag, Store, ChevronRight, X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/dashboard/customers', label: 'Customers', icon: Users },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/categories', label: 'Categories', icon: Tag },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={cn(
      'hidden lg:flex flex-col bg-ink-soft border-r border-white/5 transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-60'
    )}>
      {/* Logo */}
      <div className={cn('flex items-center p-4 border-b border-white/5 h-16',
        isCollapsed ? 'justify-center' : 'justify-between')}>
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <span className="text-white font-black text-xs">L</span>
            </div>
            <span className="font-black text-cream">LUXE</span>
            <span className="text-xs text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded font-medium">Admin</span>
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-white/5 rounded-lg transition-all text-cream/40 hover:text-cream"
        >
          <ChevronRight size={16} className={cn('transition-transform', isCollapsed ? '' : 'rotate-180')} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                  : 'text-cream/50 hover:text-cream hover:bg-white/5',
                isCollapsed && 'justify-center'
              )}
            >
              <item.icon size={18} className={isActive ? 'text-brand-400' : ''} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Store Link */}
      {!isCollapsed && (
        <div className="p-3 border-t border-white/5">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-cream/40 hover:text-cream hover:bg-white/5 transition-all"
          >
            <Store size={18} />
            View Store
          </Link>
        </div>
      )}
    </aside>
  );
}
