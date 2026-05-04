'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { formatPrice } from '@/lib/utils';

const monthlyData = [
  { month: 'Jan', revenue: 18400, orders: 124 },
  { month: 'Feb', revenue: 22100, orders: 148 },
  { month: 'Mar', revenue: 19800, orders: 132 },
  { month: 'Apr', revenue: 28600, orders: 191 },
  { month: 'May', revenue: 24200, orders: 162 },
  { month: 'Jun', revenue: 31500, orders: 211 },
  { month: 'Jul', revenue: 29800, orders: 199 },
  { month: 'Aug', revenue: 35200, orders: 235 },
  { month: 'Sep', revenue: 32100, orders: 214 },
  { month: 'Oct', revenue: 38600, orders: 258 },
  { month: 'Nov', revenue: 42900, orders: 287 },
  { month: 'Dec', revenue: 48200, orders: 322 },
];

const topCategories = [
  { name: 'Electronics', revenue: 98400, percent: 39 },
  { name: 'Fashion', revenue: 62100, percent: 25 },
  { name: 'Home & Living', revenue: 42800, percent: 17 },
  { name: 'Beauty', revenue: 28600, percent: 11 },
  { name: 'Sports', revenue: 16900, percent: 7 },
  { name: 'Books', revenue: 2000, percent: 1 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-strong rounded-xl p-3 border border-white/10 text-sm">
        <p className="text-cream/50 text-xs mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-cream/60 capitalize">{entry.name}:</span>
            <span className="text-cream font-semibold">
              {entry.name === 'revenue' ? formatPrice(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-cream">Analytics</h1>
        <p className="text-cream/40 mt-1">Deep dive into your store performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg. Order Value', value: '$135.12', change: '+8.2%', positive: true },
          { label: 'Conversion Rate', value: '3.4%', change: '+0.6%', positive: true },
          { label: 'Cart Abandonment', value: '67%', change: '-3.1%', positive: true },
          { label: 'Repeat Customers', value: '42%', change: '+5.4%', positive: true },
        ].map((kpi) => (
          <div key={kpi.label} className="card p-5">
            <p className="text-xs text-cream/40 mb-1">{kpi.label}</p>
            <p className="text-2xl font-black text-cream">{kpi.value}</p>
            <p className={`text-xs font-semibold mt-1 ${kpi.positive ? 'text-green-400' : 'text-red-400'}`}>
              {kpi.change} vs last period
            </p>
          </div>
        ))}
      </div>

      {/* Monthly Revenue Bar Chart */}
      <div className="card p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-cream">Monthly Revenue (2025)</h3>
          <p className="text-sm text-cream/40">Total revenue and orders by month</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: 'rgba(254,254,249,0.3)', fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis yAxisId="revenue" orientation="left" tick={{ fill: 'rgba(254,254,249,0.3)', fontSize: 11 }} tickLine={false} axisLine={false}
              tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <YAxis yAxisId="orders" orientation="right" tick={{ fill: 'rgba(254,254,249,0.3)', fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar yAxisId="revenue" dataKey="revenue" fill="#a855f7" radius={[6, 6, 0, 0]} maxBarSize={40} />
            <Bar yAxisId="orders" dataKey="orders" fill="rgba(0,212,255,0.4)" radius={[6, 6, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Performance */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-cream mb-6">Revenue by Category</h3>
          <div className="space-y-4">
            {topCategories.map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-cream/70 font-medium">{cat.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-cream/40">{cat.percent}%</span>
                    <span className="text-cream font-semibold">{formatPrice(cat.revenue)}</span>
                  </div>
                </div>
                <div className="h-2 bg-ink-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full"
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Trend */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-cream mb-6">Order Growth Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'rgba(254,254,249,0.3)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: 'rgba(254,254,249,0.3)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="orders" stroke="#a8ff3e" strokeWidth={2.5} dot={{ fill: '#a8ff3e', r: 4, stroke: '#0a0a0f', strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-cream mb-6">Activity Feed</h3>
        <div className="space-y-3">
          {[
            { event: 'New order placed', detail: 'ORD-000142 — $249.99 by Sarah J.', time: '2 min ago', color: 'bg-green-500' },
            { event: 'Product restocked', detail: 'Leather Crossbody Bag — 50 units added', time: '1 hr ago', color: 'bg-brand-500' },
            { event: 'New customer registered', detail: 'fatima@example.com joined', time: '3 hr ago', color: 'bg-cyan-500' },
            { event: 'Order delivered', detail: 'ORD-000138 — Priya P.', time: '5 hr ago', color: 'bg-blue-500' },
            { event: 'Product review', detail: 'Premium Headphones — 5★ by Mike C.', time: '8 hr ago', color: 'bg-yellow-500' },
            { event: 'Order cancelled', detail: 'ORD-000137 — $320.00 refunded', time: '1 day ago', color: 'bg-red-500' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/2 transition-all">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-cream">{item.event}</p>
                <p className="text-xs text-cream/40 truncate">{item.detail}</p>
              </div>
              <span className="text-xs text-cream/25 flex-shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
