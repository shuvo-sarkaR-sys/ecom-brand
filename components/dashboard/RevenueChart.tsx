'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { formatPrice } from '@/lib/utils';

interface DataPoint {
  _id: string;
  revenue: number;
  orders: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-xl p-3 border border-white/10 shadow-xl text-sm">
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

export function RevenueChart({ data }: { data: DataPoint[] }) {
  const formatted = data.map((d) => ({
    ...d,
    date: new Date(d._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <div className="card p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-cream">Revenue Overview</h3>
          <p className="text-sm text-cream/40">Last 30 days performance</p>
        </div>
        <div className="flex gap-4 text-xs text-cream/50">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-brand-500 rounded" />
            Revenue
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-cyan-500 rounded" />
            Orders
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={formatted} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: 'rgba(254,254,249,0.3)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            yAxisId="revenue"
            orientation="left"
            tick={{ fill: 'rgba(254,254,249,0.3)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <YAxis
            yAxisId="orders"
            orientation="right"
            tick={{ fill: 'rgba(254,254,249,0.3)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(168,85,247,0.2)', strokeWidth: 1 }} />
          <Area
            yAxisId="revenue"
            type="monotone"
            dataKey="revenue"
            stroke="#a855f7"
            strokeWidth={2}
            fill="url(#revenueGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#a855f7', stroke: '#0a0a0f', strokeWidth: 2 }}
          />
          <Area
            yAxisId="orders"
            type="monotone"
            dataKey="orders"
            stroke="#00d4ff"
            strokeWidth={2}
            fill="url(#ordersGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#00d4ff', stroke: '#0a0a0f', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
