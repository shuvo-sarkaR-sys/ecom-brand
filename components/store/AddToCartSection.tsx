'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/cart-store';
import { ShoppingCart, Heart, Minus, Plus, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  stock: number;
  variants?: { name: string; options: string[] }[];
}

export function AddToCartSection({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [isWishlisted, setIsWishlisted] = useState(false);

  const variantString = Object.entries(selectedVariants)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }

    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      quantity,
      stock: product.stock,
      slug: product.slug,
      variant: variantString || undefined,
    });

    toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/checkout';
  };

  return (
    <div className="space-y-5">
      {/* Variant Selectors */}
      {product.variants?.map((variant) => (
        <div key={variant.name}>
          <label className="label">
            {variant.name}
            {selectedVariants[variant.name] && (
              <span className="ml-2 text-brand-400">— {selectedVariants[variant.name]}</span>
            )}
          </label>
          <div className="flex flex-wrap gap-2">
            {variant.options.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedVariants((prev) => ({ ...prev, [variant.name]: option }))}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                  selectedVariants[variant.name] === option
                    ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                    : 'border-white/10 text-cream/60 hover:border-white/30 hover:text-cream'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Quantity */}
      <div>
        <label className="label">Quantity</label>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-ink-soft rounded-xl border border-white/10 p-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-lg transition-all text-cream/70 hover:text-cream"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center text-lg font-bold text-cream">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              disabled={quantity >= product.stock}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-lg transition-all text-cream/70 hover:text-cream disabled:opacity-30"
            >
              <Plus size={16} />
            </button>
          </div>
          <span className="text-sm text-cream/40">
            {product.stock} available
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex-1 btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={20} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
        <button
          onClick={() => {
            setIsWishlisted(!isWishlisted);
            toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
          }}
          className={`w-14 h-14 flex items-center justify-center rounded-xl border transition-all ${
            isWishlisted
              ? 'border-red-500/50 bg-red-500/10 text-red-400'
              : 'border-white/10 text-cream/50 hover:border-white/30 hover:text-cream'
          }`}
        >
          <Heart size={20} className={isWishlisted ? 'fill-red-400' : ''} />
        </button>
      </div>

      {product.stock > 0 && (
        <button
          onClick={handleBuyNow}
          className="w-full btn-secondary py-4 text-base group"
        >
          <Zap size={18} className="text-accent-lime" />
          Buy Now — Fast Checkout
        </button>
      )}
    </div>
  );
}
