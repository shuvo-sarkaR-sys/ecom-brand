"use client"
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { AddToCartSection } from '@/components/store/AddToCartSection';
import { formatPrice, getDiscountPercentage, getStockStatus } from '@/lib/utils';
import { Star, Shield, Truck, RotateCcw, ChevronRight } from 'lucide-react';

async function getProduct(slug: string) {
  await dbConnect();
  const product = await Product.findOne({ slug, isActive: true })
    .populate('category', 'name slug')
    .lean();
  return product ? JSON.parse(JSON.stringify(product)) : null;
}

async function getRelatedProducts(categoryId: string, productId: string) {
  await dbConnect();
  const products = await Product.find({
    category: categoryId,
    _id: { $ne: productId },
    isActive: true,
  })
    .populate('category', 'name slug')
    .limit(4)
    .lean();
  return JSON.parse(JSON.stringify(products));
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.category._id, product._id);
  const discount = getDiscountPercentage(product.price, product.comparePrice);
  const stockStatus = getStockStatus(product.stock, product.lowStockThreshold);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-cream/40 mb-8">
        <Link href="/" className="hover:text-cream transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-cream transition-colors">Products</Link>
        <ChevronRight size={14} />
        {product.category && (
          <>
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-cream transition-colors">
              {product.category.name}
            </Link>
            <ChevronRight size={14} />
          </>
        )}
        <span className="text-cream/70 truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-ink-soft">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-cream/10">
                <span className="text-9xl">📦</span>
              </div>
            )}
            {discount > 0 && (
              <div className="absolute top-4 left-4 badge bg-red-500 text-white text-sm px-3 py-1">
                -{discount}% OFF
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {product.images.map((img: string, i: number) => (
                <div key={i} className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-ink-soft border border-white/10 cursor-pointer hover:border-brand-500/50 transition-all">
                  <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="80px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {product.category && (
            <Link href={`/products?category=${product.category.slug}`}
              className="inline-block text-sm text-brand-400 font-medium uppercase tracking-wider hover:text-brand-300 transition-colors">
              {product.category.name}
            </Link>
          )}

          <h1 className="text-3xl md:text-4xl font-black text-cream leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          {product.numReviews > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16}
                    className={star <= Math.round(product.averageRating) ? 'text-accent-gold fill-accent-gold' : 'text-cream/20'} />
                ))}
              </div>
              <span className="text-cream font-semibold">{product.averageRating}</span>
              <span className="text-cream/40 text-sm">({product.numReviews} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-4xl font-black text-cream">{formatPrice(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xl text-cream/30 line-through">{formatPrice(product.comparePrice)}</span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${product.stock === 0 ? 'bg-red-500' : product.stock <= 10 ? 'bg-orange-500' : 'bg-green-500'}`} />
            <span className={`text-sm font-medium ${stockStatus.color}`}>{stockStatus.label}</span>
            {product.stock > 0 && product.stock <= 10 && (
              <span className="text-sm text-cream/40">— Only {product.stock} left!</span>
            )}
          </div>

          {/* Short description */}
          {product.shortDescription && (
            <p className="text-cream/60 leading-relaxed">{product.shortDescription}</p>
          )}

          {/* Add to Cart */}
          <AddToCartSection product={product} />

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
            {[
              { icon: Truck, label: 'Free Shipping', sub: 'Over $100' },
              { icon: Shield, label: 'Secure', sub: 'SSL Encrypted' },
              { icon: RotateCcw, label: 'Returns', sub: '30 Days' },
            ].map((badge) => (
              <div key={badge.label} className="flex flex-col items-center text-center p-3 rounded-xl bg-ink-soft">
                <badge.icon size={18} className="text-brand-400 mb-1" />
                <span className="text-xs font-semibold text-cream">{badge.label}</span>
                <span className="text-xs text-cream/40">{badge.sub}</span>
              </div>
            ))}
          </div>

          {/* Product Meta */}
          <div className="space-y-2 text-sm border-t border-white/5 pt-4">
            {product.sku && (
              <div className="flex gap-2">
                <span className="text-cream/40 w-20">SKU:</span>
                <span className="text-cream/70 font-mono">{product.sku}</span>
              </div>
            )}
            {product.brand && (
              <div className="flex gap-2">
                <span className="text-cream/40 w-20">Brand:</span>
                <span className="text-cream/70">{product.brand}</span>
              </div>
            )}
            {product.tags?.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                <span className="text-cream/40 w-20">Tags:</span>
                <div className="flex gap-1.5 flex-wrap">
                  {product.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 bg-ink-muted rounded-full text-xs text-cream/50">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-16 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-cream mb-4">Description</h2>
          <div className="prose prose-invert max-w-none text-cream/60 leading-relaxed whitespace-pre-line">
            {product.description}
          </div>
        </div>

        {/* Reviews Summary */}
        {product.numReviews > 0 && (
          <div className="card p-6">
            <h3 className="text-lg font-bold text-cream mb-4">Reviews</h3>
            <div className="text-center mb-4">
              <div className="text-5xl font-black text-cream">{product.averageRating}</div>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={18}
                    className={s <= Math.round(product.averageRating) ? 'text-accent-gold fill-accent-gold' : 'text-cream/20'} />
                ))}
              </div>
              <p className="text-sm text-cream/40 mt-1">Based on {product.numReviews} reviews</p>
            </div>

            <div className="space-y-3 mt-4">
              {product.reviews?.slice(0, 3).map((review: any) => (
                <div key={review._id} className="p-3 bg-ink rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-cream">{review.name}</span>
                    <div className="flex">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={12} className={s <= review.rating ? 'text-accent-gold fill-accent-gold' : 'text-cream/20'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-cream/50">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-cream mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p: any) => (
              <Link key={p._id} href={'/products/' + p.slug} className="card card-hover block overflow-hidden">
                {p.images?.[0] && (
                  <div className="relative aspect-square bg-ink-muted">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <p className="text-sm font-semibold text-cream line-clamp-2">{p.name}</p>
                  <p className="text-lg font-black text-cream mt-1">{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
