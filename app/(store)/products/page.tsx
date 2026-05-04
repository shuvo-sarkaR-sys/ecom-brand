"use client"; 
import { Suspense } from 'react';
import { ProductCard } from '@/components/store/ProductCard';
import { ProductFilters } from '@/components/store/ProductFilters';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
interface SearchParams {
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
  featured?: string;
}

async function getProducts(searchParams: SearchParams) {
  await dbConnect();
  const page = parseInt(searchParams.page || '1');
  const limit = 12;
  const skip = (page - 1) * limit;

  const query: any = { isActive: true };

  if (searchParams.category) {
    const cat = await Category.findOne({ slug: searchParams.category });
    if (cat) query.category = cat._id;
  }

  if (searchParams.search) {
    query.$or = [
      { name: { $regex: searchParams.search, $options: 'i' } },
      { description: { $regex: searchParams.search, $options: 'i' } },
    ];
  }

  if (searchParams.minPrice || searchParams.maxPrice) {
    query.price = {};
    if (searchParams.minPrice) query.price.$gte = parseFloat(searchParams.minPrice);
    if (searchParams.maxPrice) query.price.$lte = parseFloat(searchParams.maxPrice);
  }

  if (searchParams.featured === 'true') query.isFeatured = true;

  const sortMap: Record<string, any> = {
    '-createdAt': { createdAt: -1 },
    'price': { price: 1 },
    '-price': { price: -1 },
    '-averageRating': { averageRating: -1 },
    '-numReviews': { numReviews: -1 },
  };
  const sort = sortMap[searchParams.sort || '-createdAt'] || { createdAt: -1 };

  const [products, total, categories] = await Promise.all([
    Product.find(query).populate('category', 'name slug').sort(sort).skip(skip).limit(limit).lean(),
    Product.countDocuments(query),
    Category.find({ isActive: true }).lean(),
  ]);

  return {
    products: JSON.parse(JSON.stringify(products)),
    total,
    pages: Math.ceil(total / limit),
    page,
    categories: JSON.parse(JSON.stringify(categories)),
  };
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const { products, total, pages, page, categories } = await getProducts(searchParams);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-cream mb-2">
          {searchParams.search
            ? `Results for "${searchParams.search}"`
            : searchParams.featured === 'true'
            ? '✦ Featured Products'
            : searchParams.category
            ? categories.find((c: any) => c.slug === searchParams.category)?.name || 'Products'
            : 'All Products'}
        </h1>
        <p className="text-cream/40">{total} product{total !== 1 ? 's' : ''} found</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <ProductFilters categories={categories} />
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort Bar */}
          <div className="flex items-center justify-between mb-6 p-4 glass rounded-xl">
            <div className="flex items-center gap-2 text-cream/50 text-sm lg:hidden">
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-sm text-cream/40">Sort by:</span>
              <select
                defaultValue={searchParams.sort || '-createdAt'}
                className="bg-transparent text-cream text-sm border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-500/50"
                onChange={(e) => {
                  const url = new URL(window.location.href);
                  url.searchParams.set('sort', e.target.value);
                  window.location.href = url.toString();
                }}
              >
                <option value="-createdAt" className="bg-ink-soft">Newest</option>
                <option value="price" className="bg-ink-soft">Price: Low to High</option>
                <option value="-price" className="bg-ink-soft">Price: High to Low</option>
                <option value="-averageRating" className="bg-ink-soft">Top Rated</option>
                <option value="-numReviews" className="bg-ink-soft">Most Reviews</option>
              </select>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-cream mb-2">No products found</h3>
              <p className="text-cream/40">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => {
                    const url = new URL(
                      typeof window !== 'undefined'
                        ? window.location.href
                        : `http://localhost:3000/products`
                    );
                    url.searchParams.set('page', String(p));
                    return (
                      <Link
                        key={p}
                        href={`/products?${new URLSearchParams({ ...Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v !== undefined) as [string, string][]), page: String(p) })}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                          p === page
                            ? 'bg-brand-500 text-white'
                            : 'bg-ink-soft text-cream/60 hover:text-cream hover:bg-ink-muted border border-white/5'
                        }`}
                      >
                        {p}
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
