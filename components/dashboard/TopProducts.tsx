'use client';

import { formatPrice } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export function TopProducts({ products }: { products: any[] }) {
  const demoProducts = [
    { _id: '1', name: 'Premium Wireless Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop', totalSold: 234, totalRevenue: 46566 },
    { _id: '2', name: 'Minimalist Watch Collection', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop', totalSold: 187, totalRevenue: 37213 },
    { _id: '3', name: 'Leather Crossbody Bag', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=80&h=80&fit=crop', totalSold: 156, totalRevenue: 23244 },
    { _id: '4', name: 'Smart Home Hub Pro', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop', totalSold: 98, totalRevenue: 19502 },
    { _id: '5', name: 'Organic Skincare Bundle', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=80&h=80&fit=crop', totalSold: 312, totalRevenue: 18720 },
  ];

  const displayProducts = products?.length ? products : demoProducts;
  const maxRevenue = Math.max(...displayProducts.map((p) => p.totalRevenue));

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-cream">Top Products</h3>
          <p className="text-sm text-cream/40">By revenue this month</p>
        </div>
        <Link href="/dashboard/products"
          className="flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300 transition-colors">
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <div className="space-y-4">
        {displayProducts.map((product, index) => (
          <div key={product._id} className="flex items-center gap-3 group">
            {/* Rank */}
            <span className="text-sm font-black text-cream/20 w-5 text-center flex-shrink-0">
              {index + 1}
            </span>

            {/* Image */}
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-ink-muted flex-shrink-0 relative">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-cream/20">📦</div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-cream truncate group-hover:text-brand-400 transition-colors">
                {product.name}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex-1 h-1.5 bg-ink-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all"
                    style={{ width: `${(product.totalRevenue / maxRevenue) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-cream/40 flex-shrink-0">
                  {product.totalSold} sold
                </span>
              </div>
            </div>

            {/* Revenue */}
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-cream">{formatPrice(product.totalRevenue)}</p>
              {index === 0 && (
                <div className="flex items-center justify-end gap-1">
                  <TrendingUp size={10} className="text-green-400" />
                  <span className="text-xs text-green-400">Top</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
