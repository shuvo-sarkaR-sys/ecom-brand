import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const order = await Order.findById(params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name images slug');

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    if (session.user.role !== 'admin' && order.user._id.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();

    const updateData: any = { status: data.status };
    if (data.trackingNumber) updateData.trackingNumber = data.trackingNumber;
    if (data.status === 'delivered') {
      updateData.isDelivered = true;
      updateData.deliveredAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(params.id, updateData, { new: true })
      .populate('user', 'name email');

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
