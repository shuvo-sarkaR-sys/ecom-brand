'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Star, Eye, BluetoothOffIcon } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    images: string[];
    averageRating: number;
    numReviews: number;
    stock: number;
    isFeatured?: boolean;
    category?: { name: string; slug: string };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const discountPercent = getDiscountPercentage(product.price, product.comparePrice || 0);
const router = useRouter();
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }

    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      quantity: 1,
      stock: product.stock,
      slug: product.slug,
    });

    toast.success('Added to cart!');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="card card-hover overflow-hidden cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-ink-muted">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingCart size={48} className="text-cream/10" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discountPercent > 0 && (
              <span className="badge bg-red-500/90 text-white backdrop-blur-sm">
                -{discountPercent}%
              </span>
            )}
            {product.isFeatured && (
              <span className="badge bg-brand-500/90 text-white backdrop-blur-sm">
                ✦ Featured
              </span>
            )}
            {product.stock === 0 && (
              <span className="badge bg-ink/90 text-cream/60 backdrop-blur-sm">
                Out of Stock
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleWishlist}
              className="w-9 h-9 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
            >
              <Heart
                size={16}
                className={isWishlisted ? 'text-red-400 fill-red-400' : 'text-cream/70'}
              />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/products/${product.slug}`);
              }}
              className="w-9 h-9 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
            >
              <Eye size={16} className="text-cream/70" />
            </button>
          </div>

          {/* Add to Cart - appears on hover */}
          <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full btn-primary py-2.5 text-sm shadow-glow disabled:opacity-50 disabled:shadow-none"
            >
              <ShoppingCart size={15} />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {product.category && (
            <p className="text-xs text-brand-400/70 font-medium uppercase tracking-wider mb-1">
              {product.category.name}
            </p>
          )}
          <h3 className="text-sm font-semibold text-cream group-hover:text-brand-400 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>

          {/* Rating */}
          {product.numReviews > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={11}
                    className={
                      star <= Math.round(product.averageRating)
                        ? 'text-accent-gold fill-accent-gold'
                        : 'text-cream/20'
                    }
                  />
                ))}
              </div>
              <span className="text-xs text-cream/40">({product.numReviews})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-cream">{formatPrice(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-sm text-cream/30 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
