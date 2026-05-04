import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { TopProducts } from '@/components/dashboard/TopProducts';
import { OrderStatusChart } from '@/components/dashboard/OrderStatusChart';

async function getAnalytics() {
  const session = await getServerSession(authOptions);
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/analytics`, {
    headers: { cookie: `next-auth.session-token=${session}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function DashboardPage() {
  // In production, call the DB directly
  const data = {
    stats: {
      totalRevenue: 248920.50,
      monthRevenue: 32450.75,
      revenueGrowth: 18.4,
      totalOrders: 1842,
      monthOrders: 143,
      totalProducts: 384,
      totalUsers: 2941,
      monthUsers: 87,
    },
    revenueByDay: Array.from({ length: 30 }, (_, i) => ({
      _id: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 3000) + 500,
      orders: Math.floor(Math.random() * 20) + 2,
    })),
    recentOrders: [],
    topProducts: [],
    ordersByStatus: [
      { _id: 'pending', count: 28 },
      { _id: 'confirmed', count: 45 },
      { _id: 'processing', count: 32 },
      { _id: 'shipped', count: 67 },
      { _id: 'delivered', count: 312 },
      { _id: 'cancelled', count: 14 },
    ],
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-cream">Dashboard</h1>
        <p className="text-cream/40 mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <DashboardStats stats={data.stats} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RevenueChart data={data.revenueByDay} />
        </div>
        <div>
          <OrderStatusChart data={data.ordersByStatus} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecentOrders orders={data.recentOrders} />
        <TopProducts products={data.topProducts} />
      </div>
    </div>
  );
}
