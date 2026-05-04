'use client';

import {
  DollarSign, ShoppingBag, Package, Users,
  TrendingUp, TrendingDown, ArrowUpRight,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Stats {
  totalRevenue: number;
  monthRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  monthOrders: number;
  totalProducts: number;
  totalUsers: number;
  monthUsers: number;
}

export function DashboardStats({ stats }: { stats: Stats }) {
  const cards = [
    {
      title: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      sub: `${formatPrice(stats.monthRevenue)} this month`,
      change: stats.revenueGrowth,
      icon: DollarSign,
      color: 'brand',
      gradient: 'from-brand-600 to-brand-800',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      sub: `+${stats.monthOrders} this month`,
      change: 12.5,
      icon: ShoppingBag,
      color: 'cyan',
      gradient: 'from-cyan-600 to-blue-800',
    },
    {
      title: 'Products',
      value: stats.totalProducts.toLocaleString(),
      sub: 'Active listings',
      change: 4.2,
      icon: Package,
      color: 'lime',
      gradient: 'from-lime-600 to-green-800',
    },
    {
      title: 'Customers',
      value: stats.totalUsers.toLocaleString(),
      sub: `+${stats.monthUsers} this month`,
      change: 8.1,
      icon: Users,
      color: 'coral',
      gradient: 'from-orange-600 to-red-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((card, i) => (
        <div
          key={card.title}
          className="card p-6 hover:border-white/10 transition-all duration-300 group animate-fade-up"
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
              <card.icon size={22} className="text-white" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
              card.change >= 0
                ? 'bg-green-500/10 text-green-400'
                : 'bg-red-500/10 text-red-400'
            }`}>
              {card.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(card.change)}%
            </div>
          </div>

          <div>
            <p className="text-sm text-cream/40 font-medium mb-1">{card.title}</p>
            <p className="text-2xl font-black text-cream mb-1">{card.value}</p>
            <p className="text-xs text-cream/30">{card.sub}</p>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-cream/30">vs last month</span>
            <ArrowUpRight size={14} className="text-cream/20 group-hover:text-brand-400 transition-colors" />
          </div>
        </div>
      ))}
    </div>
  );
}
