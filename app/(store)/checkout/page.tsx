'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  ShoppingBag, MapPin, CreditCard, Check,
  ChevronRight, Lock, ArrowLeft,
} from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Cart', icon: ShoppingBag },
  { id: 2, label: 'Shipping', icon: MapPin },
  { id: 3, label: 'Payment', icon: CreditCard },
  { id: 4, label: 'Confirm', icon: Check },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [shipping, setShipping] = useState({
    street: '', city: '', state: '', country: 'US', zipCode: '',
  });
  const [payment, setPayment] = useState({
    method: 'card', cardNumber: '', expiry: '', cvv: '', name: '',
  });

  const subtotal = getTotalPrice();
  const shippingCost = subtotal > 100 ? 0 : 9.99;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shippingCost + tax;

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <ShoppingBag size={48} className="text-cream/20 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-cream mb-2">Sign in to checkout</h2>
        <p className="text-cream/40 mb-6">You need to be signed in to complete your purchase.</p>
        <Link href="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  if (items.length === 0 && step < 4) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <ShoppingBag size={48} className="text-cream/20 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-cream mb-2">Your cart is empty</h2>
        <Link href="/products" className="btn-primary mt-4">Shop Now</Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.productId, quantity: i.quantity, variant: i.variant })),
          shippingAddress: shipping,
          paymentMethod: payment.method,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setOrderId(data.order.orderNumber);
      clearCart();
      setStep(4);
      toast.success('Order placed successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const setShip = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setShipping(s => ({ ...s, [field]: e.target.value }));

  const setPay = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setPayment(p => ({ ...p, [field]: e.target.value }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Step Progress */}
      <div className="flex items-center justify-center mb-12">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div className={`flex flex-col items-center gap-1 ${step >= s.id ? 'text-brand-400' : 'text-cream/20'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                step > s.id
                  ? 'bg-brand-500 border-brand-500'
                  : step === s.id
                  ? 'border-brand-500 bg-brand-500/10'
                  : 'border-white/10'
              }`}>
                {step > s.id ? <Check size={18} className="text-white" /> : <s.icon size={18} />}
              </div>
              <span className="text-xs font-medium hidden sm:block">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-16 sm:w-24 h-px mx-2 transition-all ${step > s.id ? 'bg-brand-500' : 'bg-white/10'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Cart Review */}
          {step === 1 && (
            <div className="card p-6 animate-fade-up">
              <h2 className="text-xl font-bold text-cream mb-6 flex items-center gap-2">
                <ShoppingBag size={20} className="text-brand-400" /> Review Cart
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variant}`} className="flex items-center gap-4 p-4 bg-ink rounded-xl">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-ink-muted relative flex-shrink-0">
                      {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-cream truncate">{item.name}</p>
                      {item.variant && <p className="text-xs text-cream/40">{item.variant}</p>}
                      <p className="text-sm text-cream/60 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-cream">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(2)} className="btn-primary w-full mt-6">
                Continue to Shipping <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* Step 2: Shipping */}
          {step === 2 && (
            <div className="card p-6 animate-fade-up">
              <h2 className="text-xl font-bold text-cream mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-brand-400" /> Shipping Address
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Street Address</label>
                  <input required value={shipping.street} onChange={setShip('street')}
                    placeholder="123 Main Street, Apt 4B"
                    className="input-field" />
                </div>
                <div>
                  <label className="label">City</label>
                  <input required value={shipping.city} onChange={setShip('city')}
                    placeholder="New York" className="input-field" />
                </div>
                <div>
                  <label className="label">State / Province</label>
                  <input required value={shipping.state} onChange={setShip('state')}
                    placeholder="NY" className="input-field" />
                </div>
                <div>
                  <label className="label">ZIP / Postal Code</label>
                  <input required value={shipping.zipCode} onChange={setShip('zipCode')}
                    placeholder="10001" className="input-field" />
                </div>
                <div>
                  <label className="label">Country</label>
                  <select value={shipping.country} onChange={setShip('country')} className="input-field">
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="BD">Bangladesh</option>
                    <option value="IN">India</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="btn-secondary flex items-center gap-2">
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={() => {
                    if (!shipping.street || !shipping.city || !shipping.state || !shipping.zipCode) {
                      toast.error('Please fill in all required fields');
                      return;
                    }
                    setStep(3);
                  }}
                  className="btn-primary flex-1"
                >
                  Continue to Payment <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="card p-6 animate-fade-up">
              <h2 className="text-xl font-bold text-cream mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-brand-400" /> Payment Details
              </h2>

              {/* Payment Method */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { value: 'card', label: '💳 Credit Card' },
                  { value: 'paypal', label: '🅿 PayPal' },
                ].map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setPayment(p => ({ ...p, method: m.value }))}
                    className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                      payment.method === m.value
                        ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                        : 'border-white/10 text-cream/60 hover:border-white/20'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {payment.method === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="label">Cardholder Name</label>
                    <input value={payment.name} onChange={setPay('name')}
                      placeholder="John Doe" className="input-field" />
                  </div>
                  <div>
                    <label className="label">Card Number</label>
                    <input value={payment.cardNumber} onChange={setPay('cardNumber')}
                      placeholder="1234 5678 9012 3456" maxLength={19}
                      className="input-field font-mono" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Expiry Date</label>
                      <input value={payment.expiry} onChange={setPay('expiry')}
                        placeholder="MM/YY" maxLength={5} className="input-field" />
                    </div>
                    <div>
                      <label className="label">CVV</label>
                      <input value={payment.cvv} onChange={setPay('cvv')}
                        placeholder="•••" maxLength={4} className="input-field" />
                    </div>
                  </div>
                </div>
              )}

              {payment.method === 'paypal' && (
                <div className="p-6 glass rounded-xl text-center">
                  <p className="text-cream/50">You'll be redirected to PayPal to complete payment.</p>
                </div>
              )}

              <div className="flex items-center gap-2 mt-4 text-xs text-cream/30">
                <Lock size={12} /> Your payment info is encrypted and secure
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="btn-secondary flex items-center gap-2">
                  <ArrowLeft size={16} /> Back
                </button>
                <button onClick={handlePlaceOrder} className="btn-primary flex-1" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Placing Order...
                    </span>
                  ) : (
                    <>Place Order — {formatPrice(total)}</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="card p-12 text-center animate-scale-in">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-green-400" />
              </div>
              <h2 className="text-3xl font-black text-cream mb-2">Order Placed! 🎉</h2>
              <p className="text-cream/50 mb-2">Your order has been successfully placed.</p>
              <p className="text-brand-400 font-mono font-bold text-lg mb-8">{orderId}</p>
              <p className="text-cream/40 text-sm mb-8">
                We'll send you a confirmation email and notify you when your order ships.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/orders" className="btn-secondary">View My Orders</Link>
                <Link href="/products" className="btn-primary">Continue Shopping</Link>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        {step < 4 && (
          <div className="space-y-4">
            <div className="card p-6 sticky top-24">
              <h3 className="text-lg font-bold text-cream mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variant}`} className="flex justify-between text-sm">
                    <span className="text-cream/60 truncate pr-2">{item.name} ×{item.quantity}</span>
                    <span className="text-cream font-medium flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-cream/60">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-cream/60">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? <span className="text-green-400">Free</span> : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-sm text-cream/60">
                  <span>Tax (8%)</span><span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-cream border-t border-white/10 pt-3 mt-3">
                  <span>Total</span><span className="text-brand-400 text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              {subtotal < 100 && (
                <p className="text-xs text-center text-cream/30 mt-3">
                  Add <span className="text-green-400">{formatPrice(100 - subtotal)}</span> more for free shipping!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
