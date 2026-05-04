'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || '',
  });

  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  }, [router, searchParams]);

  const clearFilters = () => {
    router.push('/products');
    setPriceRange({ min: '', max: '' });
  };

  const activeCategory = searchParams.get('category');
  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className="space-y-6 sticky top-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-cream font-semibold">
          <Filter size={18} className="text-brand-400" />
          <span>Filters</span>
        </div>
        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-cream mb-3 flex items-center justify-between">
          Categories <ChevronDown size={14} className="text-cream/40" />
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => updateFilter('category', '')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              !activeCategory
                ? 'bg-brand-500/20 text-brand-400 font-medium'
                : 'text-cream/60 hover:text-cream hover:bg-white/5'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateFilter('category', cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                activeCategory === cat.slug
                  ? 'bg-brand-500/20 text-brand-400 font-medium'
                  : 'text-cream/60 hover:text-cream hover:bg-white/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-cream mb-3">Price Range</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
              className="w-full px-3 py-2 bg-ink border border-white/10 rounded-lg text-cream text-sm placeholder-cream/30 focus:outline-none focus:border-brand-500/50"
            />
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
              className="w-full px-3 py-2 bg-ink border border-white/10 rounded-lg text-cream text-sm placeholder-cream/30 focus:outline-none focus:border-brand-500/50"
            />
          </div>
          <button
            onClick={() => {
              if (priceRange.min) updateFilter('minPrice', priceRange.min);
              if (priceRange.max) updateFilter('maxPrice', priceRange.max);
            }}
            className="w-full btn-secondary text-sm py-2"
          >
            Apply
          </button>
        </div>

        {/* Quick price filters */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { label: 'Under $50', min: '', max: '50' },
            { label: '$50-$100', min: '50', max: '100' },
            { label: '$100-$200', min: '100', max: '200' },
            { label: '$200+', min: '200', max: '' },
          ].map((range) => (
            <button
              key={range.label}
              onClick={() => {
                setPriceRange({ min: range.min, max: range.max });
                const params = new URLSearchParams(searchParams.toString());
                if (range.min) params.set('minPrice', range.min); else params.delete('minPrice');
                if (range.max) params.set('maxPrice', range.max); else params.delete('maxPrice');
                params.delete('page');
                router.push(`/products?${params.toString()}`);
              }}
              className="px-2.5 py-1 text-xs bg-ink border border-white/10 hover:border-brand-500/50 rounded-full text-cream/60 hover:text-brand-400 transition-all"
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-cream mb-3">Availability</h3>
        <div className="space-y-1">
          {[
            { label: 'All Products', value: '' },
            { label: '✦ Featured Only', value: 'true' },
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => updateFilter('featured', opt.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                searchParams.get('featured') === opt.value || (!searchParams.get('featured') && !opt.value)
                  ? 'bg-brand-500/20 text-brand-400 font-medium'
                  : 'text-cream/60 hover:text-cream hover:bg-white/5'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
