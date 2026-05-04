'use client';

import Link from 'next/link';
import { formatPrice, formatRelativeDate, STATUS_COLORS } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export function RecentOrders({ orders }: { orders: any[] }) {
  // Demo data when no real orders
  const demoOrders = [
    { _id: '1', orderNumber: 'ORD-000142', user: { name: 'Sarah Johnson', email: 'sarah@example.com' }, totalPrice: 249.99, status: 'delivered', createdAt: new Date(Date.now() - 3600000) },
    { _id: '2', orderNumber: 'ORD-000141', user: { name: 'Mike Chen', email: 'mike@example.com' }, totalPrice: 89.50, status: 'shipped', createdAt: new Date(Date.now() - 7200000) },
    { _id: '3', orderNumber: 'ORD-000140', user: { name: 'Emma Davis', email: 'emma@example.com' }, totalPrice: 412.00, status: 'processing', createdAt: new Date(Date.now() - 18000000) },
    { _id: '4', orderNumber: 'ORD-000139', user: { name: 'James Wilson', email: 'james@example.com' }, totalPrice: 65.99, status: 'pending', createdAt: new Date(Date.now() - 86400000) },
    { _id: '5', orderNumber: 'ORD-000138', user: { name: 'Priya Patel', email: 'priya@example.com' }, totalPrice: 178.25, status: 'confirmed', createdAt: new Date(Date.now() - 172800000) },
  ];

  const displayOrders = orders?.length ? orders : demoOrders;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-cream">Recent Orders</h3>
          <p className="text-sm text-cream/40">Latest customer purchases</p>
        </div>
        <Link href="/dashboard/orders"
          className="flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300 transition-colors">
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <div className="space-y-3">
        {displayOrders.map((order) => (
          <div key={order._id}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/3 transition-all group">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {order.user?.name?.[0]?.toUpperCase() || '?'}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-cream truncate">{order.user?.name}</p>
                <span className="text-xs text-cream/30 font-mono flex-shrink-0">{order.orderNumber}</span>
              </div>
              <p className="text-xs text-cream/40">{formatRelativeDate(order.createdAt)}</p>
            </div>

            {/* Status + Amount */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className={`badge text-xs ${STATUS_COLORS[order.status as keyof typeof STATUS_COLORS]}`}>
                {order.status}
              </span>
              <span className="text-sm font-bold text-cream">{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
