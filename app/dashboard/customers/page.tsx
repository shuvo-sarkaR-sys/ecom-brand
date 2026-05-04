'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Users, Mail, Calendar, ShoppingBag } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const demoCustomers = [
  { _id: '1', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'user', createdAt: new Date(Date.now() - 8640000).toISOString(), orders: 12, totalSpent: 1842.50 },
  { _id: '2', name: 'Mike Chen', email: 'mike@example.com', role: 'user', createdAt: new Date(Date.now() - 17280000).toISOString(), orders: 7, totalSpent: 623.00 },
  { _id: '3', name: 'Emma Davis', email: 'emma@example.com', role: 'user', createdAt: new Date(Date.now() - 25920000).toISOString(), orders: 23, totalSpent: 3412.75 },
  { _id: '4', name: 'James Wilson', email: 'james@example.com', role: 'user', createdAt: new Date(Date.now() - 34560000).toISOString(), orders: 3, totalSpent: 215.99 },
  { _id: '5', name: 'Priya Patel', email: 'priya@example.com', role: 'user', createdAt: new Date(Date.now() - 43200000).toISOString(), orders: 18, totalSpent: 2891.25 },
  { _id: '6', name: 'David Lee', email: 'david@example.com', role: 'admin', createdAt: new Date(Date.now() - 51840000).toISOString(), orders: 0, totalSpent: 0 },
  { _id: '7', name: 'Fatima Hassan', email: 'fatima@example.com', role: 'user', createdAt: new Date(Date.now() - 60480000).toISOString(), orders: 9, totalSpent: 1104.80 },
  { _id: '8', name: 'Lucas Oliveira', email: 'lucas@example.com', role: 'user', createdAt: new Date(Date.now() - 69120000).toISOString(), orders: 5, totalSpent: 443.60 },
];

export default function DashboardCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ ...(search && { search }) });
      const res = await fetch(`/api/users?${params}`);
      const data = await res.json();
      setCustomers(data.users || []);
    } catch { } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const display = customers.length ? customers : demoCustomers;
  const filtered = search
    ? display.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
      )
    : display;

  const totalCustomers = filtered.filter(c => c.role === 'user').length;
  const totalRevenue = filtered.reduce((s, c) => s + (c.totalSpent || 0), 0);
  const avgOrderValue = totalCustomers > 0 ? totalRevenue / filtered.reduce((s, c) => s + (c.orders || 0), 0) || 0 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-cream">Customers</h1>
        <p className="text-cream/40 mt-1">Manage your customer base</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: totalCustomers, icon: Users, color: 'text-brand-400' },
          { label: 'Total Spent', value: `$${totalRevenue.toFixed(0)}`, icon: ShoppingBag, color: 'text-green-400' },
          { label: 'Avg Order Value', value: `$${avgOrderValue.toFixed(0)}`, icon: ShoppingBag, color: 'text-cyan-400' },
          { label: 'New This Month', value: '87', icon: Calendar, color: 'text-orange-400' },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <stat.icon size={20} className={`${stat.color} mb-2`} />
            <p className="text-xl font-black text-cream">{stat.value}</p>
            <p className="text-xs text-cream/40">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/30" />
        <input
          type="text"
          placeholder="Search customers by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full shimmer" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 shimmer rounded w-3/4" />
                  <div className="h-3 shimmer rounded w-1/2" />
                </div>
              </div>
            </div>
          ))
        ) : filtered.map((customer) => (
          <div key={customer._id} className="card p-5 hover:border-white/10 transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">
                  {customer.name?.[0]?.toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-cream truncate">{customer.name}</p>
                  {customer.role === 'admin' && (
                    <span className="badge bg-brand-500/20 text-brand-400 text-xs">Admin</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-cream/40 text-xs">
                  <Mail size={11} />
                  <span className="truncate">{customer.email}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/5">
              <div className="text-center">
                <p className="text-lg font-black text-cream">{customer.orders || 0}</p>
                <p className="text-xs text-cream/30">Orders</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-black text-cream">${(customer.totalSpent || 0).toFixed(0)}</p>
                <p className="text-xs text-cream/30">Spent</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-cream/60">{formatDate(customer.createdAt)}</p>
                <p className="text-xs text-cream/30">Joined</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
