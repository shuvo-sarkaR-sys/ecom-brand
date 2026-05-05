'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';

interface SortBarProps {
  currentSort?: string;
}

export function SortBar({ currentSort = '-createdAt' }: SortBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', e.target.value);
    params.set('page', '1'); // Reset to first page when sorting changes
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between mb-6 p-4 glass rounded-xl">
      <div className="flex items-center gap-2 text-cream/50 text-sm lg:hidden">
        <SlidersHorizontal size={16} />
        <span>Filters</span>
      </div>
      <div className="flex items-center gap-3 ml-auto">
        <span className="text-sm text-cream/40">Sort by:</span>
        <select
          value={currentSort}
          onChange={handleSortChange}
          className="bg-transparent text-cream text-sm border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-500/50"
        >
          <option value="-createdAt" className="bg-ink-soft">Newest</option>
          <option value="price" className="bg-ink-soft">Price: Low to High</option>
          <option value="-price" className="bg-ink-soft">Price: High to Low</option>
          <option value="-averageRating" className="bg-ink-soft">Top Rated</option>
          <option value="-numReviews" className="bg-ink-soft">Most Reviews</option>
        </select>
      </div>
    </div>
  );
}