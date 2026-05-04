'use client';

import { useCartStore } from '@/lib/cart-store';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

export function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/70 backdrop-blur-sm z-40 animate-fade-in"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-ink-soft border-l border-white/5 z-50 flex flex-col shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <ShoppingBag size={22} className="text-brand-400" />
            <h2 className="text-lg font-bold text-cream">
              Cart <span className="text-cream/40 text-sm font-normal">({items.length} items)</span>
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-white/5 rounded-xl transition-all text-cream/50 hover:text-cream"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-20 h-20 rounded-full bg-ink-muted flex items-center justify-center">
                <ShoppingBag size={32} className="text-cream/20" />
              </div>
              <p className="text-cream/50 font-medium">Your cart is empty</p>
              <button onClick={closeCart} className="btn-primary">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.variant}`}
                className="flex gap-4 p-4 bg-ink rounded-xl border border-white/5 group">
                {/* Image */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-ink-muted flex-shrink-0 relative">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cream/20">
                      <ShoppingBag size={24} />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="text-sm font-semibold text-cream hover:text-brand-400 transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  {item.variant && (
                    <p className="text-xs text-cream/40 mt-0.5">{item.variant}</p>
                  )}
                  <p className="text-brand-400 font-bold text-sm mt-1">
                    {formatPrice(item.price)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-ink-muted rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variant)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-white/5 rounded-md transition-all text-cream/70 hover:text-cream"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm font-medium text-cream">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variant)}
                        disabled={item.quantity >= item.stock}
                        className="w-7 h-7 flex items-center justify-center hover:bg-white/5 rounded-md transition-all text-cream/70 hover:text-cream disabled:opacity-30"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId, item.variant)}
                      className="p-1.5 text-cream/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/5 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-cream/60">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm text-cream/60">
                <span>Shipping</span>
                <span>{totalPrice > 100 ? <span className="text-accent-lime">Free</span> : formatPrice(9.99)}</span>
              </div>
              <div className="flex justify-between font-bold text-cream border-t border-white/10 pt-2 mt-2">
                <span>Total</span>
                <span className="text-brand-400">
                  {formatPrice(totalPrice > 100 ? totalPrice : totalPrice + 9.99)}
                </span>
              </div>
            </div>

            {totalPrice > 0 && totalPrice < 100 && (
              <p className="text-xs text-center text-cream/40">
                Add <span className="text-accent-lime font-medium">{formatPrice(100 - totalPrice)}</span> more for free shipping!
              </p>
            )}

            <Link href="/checkout" onClick={closeCart} className="btn-primary w-full justify-center group">
              Proceed to Checkout
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button onClick={closeCart} className="btn-secondary w-full justify-center text-sm">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
