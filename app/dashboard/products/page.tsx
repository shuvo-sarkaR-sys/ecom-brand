'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus, Search, Edit, Trash2, Eye, Package,
  ChevronLeft, ChevronRight, Filter, ArrowUpDown,
  ToggleLeft, ToggleRight
} from 'lucide-react';
import { formatPrice, getStockStatus } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  category?: { name: string };
  sku: string;
  createdAt: string;
}

export default function DashboardProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '10',
        admin: 'true',
        ...(search && { search }),
      });
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.pagination?.pages || 1);
      setTotal(data.pagination?.total || 0);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Product deleted');
      setDeleteId(null);
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleToggle = async (id: string, field: 'isActive' | 'isFeatured', current: boolean) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !current }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Product ${field === 'isActive' ? (current ? 'deactivated' : 'activated') : (current ? 'unfeatured' : 'featured')}`);
      fetchProducts();
    } catch {
      toast.error('Failed to update product');
    }
  };

  // Demo products for display
  const demoProducts: Product[] = [
    { _id: '1', name: 'Premium Wireless Headphones', slug: 'premium-wireless-headphones', price: 199.99, stock: 45, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=60&h=60&fit=crop'], isActive: true, isFeatured: true, category: { name: 'Electronics' }, sku: 'ELE-XK291', createdAt: new Date().toISOString() },
    { _id: '2', name: 'Minimalist Leather Watch', slug: 'minimalist-leather-watch', price: 299.00, stock: 12, images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&h=60&fit=crop'], isActive: true, isFeatured: false, category: { name: 'Fashion' }, sku: 'FSH-WC881', createdAt: new Date().toISOString() },
    { _id: '3', name: 'Leather Crossbody Bag', slug: 'leather-crossbody-bag', price: 149.50, stock: 0, images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=60&h=60&fit=crop'], isActive: true, isFeatured: false, category: { name: 'Fashion' }, sku: 'FSH-BG442', createdAt: new Date().toISOString() },
    { _id: '4', name: 'Smart Home Hub Pro', slug: 'smart-home-hub-pro', price: 199.00, stock: 28, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=60&h=60&fit=crop'], isActive: false, isFeatured: false, category: { name: 'Electronics' }, sku: 'ELE-SH991', createdAt: new Date().toISOString() },
    { _id: '5', name: 'Organic Skincare Bundle', slug: 'organic-skincare-bundle', price: 59.99, stock: 83, images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=60&h=60&fit=crop'], isActive: true, isFeatured: true, category: { name: 'Beauty' }, sku: 'BTY-SK221', createdAt: new Date().toISOString() },
  ];

  const displayProducts = products.length ? products : demoProducts;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-cream">Products</h1>
          <p className="text-cream/40 mt-1">{total || demoProducts.length} total products</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary self-start sm:self-auto"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/30" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-10"
          />
        </div>
        <button className="btn-secondary flex-shrink-0">
          <Filter size={16} /> Filter
        </button>
        <button className="btn-secondary flex-shrink-0">
          <ArrowUpDown size={16} /> Sort
        </button>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-ink">
                <th className="text-left p-4 text-xs font-semibold text-cream/40 uppercase tracking-wider">Product</th>
                <th className="text-left p-4 text-xs font-semibold text-cream/40 uppercase tracking-wider hidden md:table-cell">SKU</th>
                <th className="text-left p-4 text-xs font-semibold text-cream/40 uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="text-right p-4 text-xs font-semibold text-cream/40 uppercase tracking-wider">Price</th>
                <th className="text-center p-4 text-xs font-semibold text-cream/40 uppercase tracking-wider hidden lg:table-cell">Stock</th>
                <th className="text-center p-4 text-xs font-semibold text-cream/40 uppercase tracking-wider">Status</th>
                <th className="text-center p-4 text-xs font-semibold text-cream/40 uppercase tracking-wider">Featured</th>
                <th className="text-right p-4 text-xs font-semibold text-cream/40 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/3">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="p-4">
                        <div className="h-4 shimmer rounded w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                displayProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  return (
                    <tr key={product._id} className="hover:bg-white/2 transition-colors group">
                      {/* Product */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-ink-muted flex-shrink-0 relative">
                            {product.images?.[0] ? (
                              <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="48px" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={18} className="text-cream/20" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-cream truncate max-w-[180px] group-hover:text-brand-400 transition-colors">
                              {product.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="p-4 hidden md:table-cell">
                        <span className="text-xs text-cream/40 font-mono">{product.sku}</span>
                      </td>

                      {/* Category */}
                      <td className="p-4 hidden sm:table-cell">
                        <span className="text-sm text-cream/60">{product.category?.name || '—'}</span>
                      </td>

                      {/* Price */}
                      <td className="p-4 text-right">
                        <span className="text-sm font-bold text-cream">{formatPrice(product.price)}</span>
                      </td>

                      {/* Stock */}
                      <td className="p-4 text-center hidden lg:table-cell">
                        <span className={`text-sm font-semibold ${stockStatus.color}`}>
                          {product.stock}
                        </span>
                      </td>

                      {/* Active Toggle */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggle(product._id, 'isActive', product.isActive)}
                          className={`transition-colors ${product.isActive ? 'text-green-400 hover:text-green-300' : 'text-cream/20 hover:text-cream/40'}`}
                        >
                          {product.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                        </button>
                      </td>

                      {/* Featured Toggle */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggle(product._id, 'isFeatured', product.isFeatured)}
                          className={`text-xs font-medium px-2 py-1 rounded-full transition-all ${
                            product.isFeatured
                              ? 'bg-brand-500/20 text-brand-400 hover:bg-brand-500/30'
                              : 'text-cream/20 hover:text-cream/40'
                          }`}
                        >
                          {product.isFeatured ? '✦ Yes' : '—'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-cream/30 hover:text-cream transition-all"
                            title="View"
                          >
                            <Eye size={15} />
                          </Link>
                          <button
                            onClick={() => toast('Edit functionality — connect to your form modal')}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-brand-500/10 text-cream/30 hover:text-brand-400 transition-all"
                            title="Edit"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteId(product._id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-cream/30 hover:text-red-400 transition-all"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-white/5">
            <p className="text-sm text-cream/40">
              Showing page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-ghost p-2 disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-ghost p-2 disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative glass-strong rounded-2xl p-6 max-w-sm w-full border border-white/10 animate-scale-in">
            <h3 className="text-lg font-bold text-cream mb-2">Delete Product?</h3>
            <p className="text-cream/50 text-sm mb-6">
              This action cannot be undone. The product will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancel</button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-xl font-semibold transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal onClose={() => setShowAddModal(false)} onSuccess={() => { setShowAddModal(false); fetchProducts(); }} />
      )}
    </div>
  );
}

function AddProductModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({
    name: '', price: '', stock: '', sku: '', description: '', shortDescription: '',
    category: '', brand: '', images: '',
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        images: form.images ? form.images.split(',').map(s => s.trim()) : [],
      };
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('Product created!');
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-strong rounded-2xl p-6 max-w-2xl w-full border border-white/10 animate-scale-in my-4">
        <h3 className="text-xl font-bold text-cream mb-6">Add New Product</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Product Name *</label>
              <input required value={form.name} onChange={set('name')} placeholder="Premium Wireless Headphones" className="input-field" />
            </div>
            <div>
              <label className="label">Price ($) *</label>
              <input required type="number" step="0.01" value={form.price} onChange={set('price')} placeholder="99.99" className="input-field" />
            </div>
            <div>
              <label className="label">Stock *</label>
              <input required type="number" value={form.stock} onChange={set('stock')} placeholder="100" className="input-field" />
            </div>
            <div>
              <label className="label">SKU *</label>
              <input required value={form.sku} onChange={set('sku')} placeholder="ELE-XK291" className="input-field" />
            </div>
            <div>
              <label className="label">Category *</label>
              <select required value={form.category} onChange={set('category')} className="input-field">
                <option value="">Select category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Brand</label>
              <input value={form.brand} onChange={set('brand')} placeholder="Apple, Sony, etc." className="input-field" />
            </div>
            <div className="col-span-2">
              <label className="label">Image URLs (comma separated)</label>
              <input value={form.images} onChange={set('images')} placeholder="https://example.com/image1.jpg, https://..." className="input-field" />
            </div>
            <div className="col-span-2">
              <label className="label">Short Description</label>
              <input value={form.shortDescription} onChange={set('shortDescription')} placeholder="Brief product summary" className="input-field" />
            </div>
            <div className="col-span-2">
              <label className="label">Full Description *</label>
              <textarea required value={form.description} onChange={set('description')} placeholder="Detailed product description..." rows={4} className="input-field resize-none" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
