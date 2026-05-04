'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Eye, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { formatPrice, formatDate, STATUS_COLORS } from '@/lib/utils';
import toast from 'react-hot-toast';

const STATUSES = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const demoOrders = [
  { _id: '1', orderNumber: 'ORD-000142', user: { name: 'Sarah Johnson', email: 'sarah@example.com' }, totalPrice: 249.99, status: 'delivered', isPaid: true, items: [{ name: 'Headphones' }], createdAt: new Date(Date.now() - 3600000).toISOString() },
  { _id: '2', orderNumber: 'ORD-000141', user: { name: 'Mike Chen', email: 'mike@example.com' }, totalPrice: 89.50, status: 'shipped', isPaid: true, items: [{ name: 'Watch' }], createdAt: new Date(Date.now() - 86400000).toISOString() },
  { _id: '3', orderNumber: 'ORD-000140', user: { name: 'Emma Davis', email: 'emma@example.com' }, totalPrice: 412.00, status: 'processing', isPaid: true, items: [{ name: 'Bag' }, { name: 'Wallet' }], createdAt: new Date(Date.now() - 172800000).toISOString() },
  { _id: '4', orderNumber: 'ORD-000139', user: { name: 'James Wilson', email: 'james@example.com' }, totalPrice: 65.99, status: 'pending', isPaid: false, items: [{ name: 'Skincare' }], createdAt: new Date(Date.now() - 259200000).toISOString() },
  { _id: '5', orderNumber: 'ORD-000138', user: { name: 'Priya Patel', email: 'priya@example.com' }, totalPrice: 178.25, status: 'confirmed', isPaid: true, items: [{ name: 'Smart Hub' }], createdAt: new Date(Date.now() - 345600000).toISOString() },
  { _id: '6', orderNumber: 'ORD-000137', user: { name: 'David Lee', email: 'david@example.com' }, totalPrice: 320.00, status: 'cancelled', isPaid: false, items: [{ name: 'Camera' }], createdAt: new Date(Date.now() - 432000000).toISOString() },
];

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10', admin: 'true', ...(status !== 'all' && { status }) });
      const res = await fetch(`/api/orders?${params}`);
      const data = await res.json();
      setOrders(data.orders || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch { } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success('Order status updated!');
      fetchOrders();
      setSelectedOrder(null);
    } catch {
      toast.error('Failed to update order');
    }
  };

  const displayOrders = orders.length ? orders : demoOrders;
  const filtered = search
    ? displayOrders.filter(o =>
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : displayOrders;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-cream">Orders</h1>
        <p className="text-cream/40 mt-1">Manage and track customer orders</p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-all ${
              status === s
                ? 'bg-brand-500 text-white'
                : 'bg-ink-soft text-cream/50 hover:text-cream border border-white/5'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/30" />
        <input
          type="text"
          placeholder="Search by order number or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-ink">
                <th className="text-left p-4 text-xs font-semibold text-cream/40 uppercase tracking-wider">Order</th>
                <th className="text-left p-4 text-xs font-semibold text-cream/40 uppercase tracking-wider hidden sm:table-cell">Customer</th>
                <th className="text-left p-4 text-xs font-semibold text-cream/40 uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-center p-4 text-xs font-semibold text-cream/40 uppercase tracking-wider">Status</th>
                <th className="text-center p-4 text-xs font-semibold text-cream/40 uppercase tracking-wider hidden lg:table-cell">Payment</th>
                <th className="text-right p-4 text-xs font-semibold text-cream/40 uppercase tracking-wider">Total</th>
                <th className="text-right p-4 text-xs font-semibold text-cream/40 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/3">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="p-4"><div className="h-4 shimmer rounded" /></td>
                  ))}</tr>
                ))
              ) : filtered.map((order) => (
                <tr key={order._id} className="hover:bg-white/2 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-semibold text-cream font-mono">{order.orderNumber}</p>
                      <p className="text-xs text-cream/40">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <div>
                      <p className="text-sm text-cream">{order.user?.name}</p>
                      <p className="text-xs text-cream/40">{order.user?.email}</p>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-sm text-cream/60">{formatDate(order.createdAt)}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`badge capitalize ${STATUS_COLORS[order.status as keyof typeof STATUS_COLORS]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-center hidden lg:table-cell">
                    <span className={`badge ${order.isPaid ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-sm font-bold text-cream">{formatPrice(order.totalPrice)}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-brand-500/10 text-cream/30 hover:text-brand-400 transition-all ml-auto"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-white/5">
            <p className="text-sm text-cream/40">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost p-2 disabled:opacity-30"><ChevronLeft size={16} /></button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-ghost p-2 disabled:opacity-30"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative glass-strong rounded-2xl p-6 max-w-lg w-full border border-white/10 animate-scale-in">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-cream">{selectedOrder.orderNumber}</h3>
                <p className="text-sm text-cream/40">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <span className={`badge capitalize ${STATUS_COLORS[selectedOrder.status as keyof typeof STATUS_COLORS]}`}>
                {selectedOrder.status}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-cream/50">Customer</span>
                <span className="text-cream font-medium">{selectedOrder.user?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-cream/50">Email</span>
                <span className="text-cream">{selectedOrder.user?.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-cream/50">Total</span>
                <span className="text-cream font-bold">{formatPrice(selectedOrder.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-cream/50">Payment</span>
                <span className={selectedOrder.isPaid ? 'text-green-400' : 'text-yellow-400'}>
                  {selectedOrder.isPaid ? '✓ Paid' : '⚠ Unpaid'}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label className="label">Update Status</label>
              <div className="grid grid-cols-3 gap-2">
                {['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusUpdate(selectedOrder._id, s)}
                    disabled={selectedOrder.status === s}
                    className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                      selectedOrder.status === s
                        ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                        : 'bg-ink border border-white/5 text-cream/60 hover:border-white/20 hover:text-cream'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setSelectedOrder(null)} className="btn-secondary w-full">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
