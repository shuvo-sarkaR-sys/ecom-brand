import Link from 'next/link';
import { ArrowRight, Star, Shield, Truck, RotateCcw, Zap } from 'lucide-react';
import { ProductCard } from '@/components/store/ProductCard';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';

async function getFeaturedProducts() {
  await dbConnect();
  const products = await Product.find({ isFeatured: true, isActive: true })
    .populate('category', 'name slug')
    .limit(8)
    .lean();
  return JSON.parse(JSON.stringify(products));
}

async function getCategories() {
  await dbConnect();
  const categories = await Category.find({ isActive: true })
    .limit(6)
    .lean();
  return JSON.parse(JSON.stringify(categories));
}

const features = [
  { icon: Truck, title: 'Free Shipping', description: 'On all orders over $100' },
  { icon: Shield, title: 'Secure Payments', description: '256-bit SSL encryption' },
  { icon: RotateCcw, title: 'Easy Returns', description: '30-day return policy' },
  { icon: Zap, title: 'Fast Delivery', description: '2-5 business days' },
];

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-800/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-cream/70 mb-8 animate-fade-up">
            <Star size={14} className="text-accent-gold fill-accent-gold" />
            <span>Over 10,000 happy customers worldwide</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-cream mb-6 animate-fade-up leading-[0.9] tracking-tight"
            style={{ animationDelay: '0.1s' }}>
            Shop the
            <br />
            <span className="gradient-text">Future</span>
            <br />
            of Luxury
          </h1>

          <p className="text-lg md:text-xl text-cream/50 max-w-2xl mx-auto mb-10 animate-fade-up"
            style={{ animationDelay: '0.2s' }}>
            Discover curated premium products from around the world. 
            Unmatched quality, delivered to your door.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
            style={{ animationDelay: '0.3s' }}>
            <Link href="/products" className="btn-primary text-lg px-8 py-4 group shadow-glow">
              Shop Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/products?featured=true" className="btn-secondary text-lg px-8 py-4">
              View Featured
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-lg mx-auto animate-fade-up"
            style={{ animationDelay: '0.4s' }}>
            {[
              { value: '50K+', label: 'Products' },
              { value: '10K+', label: 'Customers' },
              { value: '4.9★', label: 'Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-black text-cream">{stat.value}</p>
                <p className="text-sm text-cream/40 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce text-cream/30">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-cream/30 to-transparent" />
        </div>
      </section>

      {/* Features Strip */}
      <section className="border-y border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon size={20} className="text-brand-400" />
                </div>
                <div>
                  <p className="font-semibold text-cream text-sm">{feature.title}</p>
                  <p className="text-xs text-cream/40">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-brand-400 text-sm font-medium tracking-widest uppercase mb-2">Browse by</p>
                <h2 className="section-title">Categories</h2>
              </div>
              <Link href="/products" className="text-sm text-cream/50 hover:text-cream transition-colors">
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category: any, index: number) => (
                <Link
                  key={category._id}
                  href={`/products?category=${category.slug}`}
                  className="card card-hover group p-6 text-center animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-500/20 transition-all">
                    <span className="text-2xl">
                      {['📱', '👗', '🏠', '🎮', '📚', '💄'][index % 6]}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-cream group-hover:text-brand-400 transition-colors">
                    {category.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-brand-400 text-sm font-medium tracking-widest uppercase mb-2">Hand picked</p>
                <h2 className="section-title">Featured Products</h2>
              </div>
              <Link href="/products?featured=true" className="text-sm text-cream/50 hover:text-cream transition-colors">
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product: any, index: number) => (
                <div key={product._id} className="animate-fade-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/products" className="btn-secondary px-10 py-4 text-base">
                Explore All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 p-12 text-center">
            <div className="absolute inset-0 bg-grid-pattern opacity-30" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-400/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-brand-900/40 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Get 15% Off Your<br />First Order
              </h2>
              <p className="text-brand-200 text-lg mb-8">
                Sign up for our newsletter and receive an exclusive discount code.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 outline-none focus:border-white/40 transition-all"
                />
                <button type="submit" className="px-6 py-3 bg-white text-brand-700 font-bold rounded-xl hover:bg-brand-100 transition-all whitespace-nowrap">
                  Get Discount
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
