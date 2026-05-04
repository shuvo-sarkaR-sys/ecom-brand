import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Current month stats
    const [
      totalRevenue,
      monthRevenue,
      lastMonthRevenue,
      totalOrders,
      monthOrders,
      totalProducts,
      totalUsers,
      monthUsers,
      recentOrders,
      topProducts,
      ordersByStatus,
      revenueByDay,
    ] = await Promise.all([
      // Total revenue
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),

      // This month revenue
      Order.aggregate([
        { $match: { isPaid: true, createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),

      // Last month revenue
      Order.aggregate([
        { $match: { isPaid: true, createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),

      // Total orders
      Order.countDocuments(),

      // Month orders
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),

      // Total products
      Product.countDocuments({ isActive: true }),

      // Total users
      User.countDocuments({ role: 'user' }),

      // Month users
      User.countDocuments({ role: 'user', createdAt: { $gte: startOfMonth } }),

      // Recent orders
      Order.find()
        .populate('user', 'name email')
        .sort('-createdAt')
        .limit(5)
        .lean(),

      // Top products by revenue
      Order.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.product',
            name: { $first: '$items.name' },
            image: { $first: '$items.image' },
            totalSold: { $sum: '$items.quantity' },
            totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          },
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: 5 },
      ]),

      // Orders by status
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      // Revenue by day (last 30 days)
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) },
            isPaid: true,
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: { $sum: '$totalPrice' },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const currentRevenue = monthRevenue[0]?.total || 0;
    const previousRevenue = lastMonthRevenue[0]?.total || 0;
    const revenueGrowth = previousRevenue
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

    return NextResponse.json({
      stats: {
        totalRevenue: totalRevenue[0]?.total || 0,
        monthRevenue: currentRevenue,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        totalOrders,
        monthOrders,
        totalProducts,
        totalUsers,
        monthUsers,
      },
      recentOrders,
      topProducts,
      ordersByStatus,
      revenueByDay,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
