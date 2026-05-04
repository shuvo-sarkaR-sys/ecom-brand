'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface StatusData {
  _id: string;
  count: number;
}

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  pending:    { color: '#fbbf24', label: 'Pending' },
  confirmed:  { color: '#60a5fa', label: 'Confirmed' },
  processing: { color: '#a855f7', label: 'Processing' },
  shipped:    { color: '#818cf8', label: 'Shipped' },
  delivered:  { color: '#34d399', label: 'Delivered' },
  cancelled:  { color: '#f87171', label: 'Cancelled' },
  refunded:   { color: '#9ca3af', label: 'Refunded' },
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const d = payload[0];
    return (
      <div className="glass-strong rounded-xl p-3 border border-white/10 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.payload.color }} />
          <span className="text-cream font-semibold">{d.payload.label}</span>
        </div>
        <p className="text-cream/60 mt-1">
          {d.value} orders ({((d.value / d.payload.total) * 100).toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
};

export function OrderStatusChart({ data }: { data: StatusData[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const chartData = data.map((d) => ({
    ...d,
    label: STATUS_CONFIG[d._id]?.label || d._id,
    color: STATUS_CONFIG[d._id]?.color || '#6b7280',
    total,
  }));

  return (
    <div className="card p-6 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-cream">Order Status</h3>
        <p className="text-sm text-cream/40">{total} total orders</p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            strokeWidth={0}
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {chartData.map((d) => (
          <div key={d._id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
              <span className="text-cream/60">{d.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cream font-semibold">{d.count}</span>
              <span className="text-cream/30 text-xs">({((d.count / total) * 100).toFixed(0)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
