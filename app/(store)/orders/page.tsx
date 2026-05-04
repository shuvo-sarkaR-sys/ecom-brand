'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import { formatPrice, formatDate, STATUS_COLORS } from '@/lib/utils';

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch('/api/orders')
        .then(r => r.json())
        .then(d => { setOrders(d.orders || []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [session]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="h-8 w-40 shimmer rounded mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-28 shimmer rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-cream mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag size={48} className="text-cream/20 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-cream mb-2">No orders yet</h3>
          <p className="text-cream/40 mb-6">Start shopping to see your orders here</p>
          <Link href="/products" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card p-6 hover:border-white/10 transition-all group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                    <Package size={22} className="text-brand-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-cream font-mono">{order.orderNumber}</p>
                      <span className={`badge capitalize ${STATUS_COLORS[order.status as keyof typeof STATUS_COLORS]}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-cream/40 mt-0.5">
                      {formatDate(order.createdAt)} · {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-right">
                    <p className="text-sm text-cream/40">Total</p>
                    <p className="font-bold text-cream">{formatPrice(order.totalPrice)}</p>
                  </div>
                  <Link href={`/orders/${order._id}`}
                    className="flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300 transition-colors whitespace-nowrap">
                    Details <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
