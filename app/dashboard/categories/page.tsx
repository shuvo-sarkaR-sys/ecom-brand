'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const demoCategories = [
  { _id: '1', name: 'Electronics', slug: 'electronics', isActive: true, sortOrder: 1 },
  { _id: '2', name: 'Fashion', slug: 'fashion', isActive: true, sortOrder: 2 },
  { _id: '3', name: 'Home & Living', slug: 'home', isActive: true, sortOrder: 3 },
  { _id: '4', name: 'Beauty', slug: 'beauty', isActive: true, sortOrder: 4 },
  { _id: '5', name: 'Sports', slug: 'sports', isActive: true, sortOrder: 5 },
  { _id: '6', name: 'Books', slug: 'books', isActive: false, sortOrder: 6 },
];

export default function DashboardCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch { } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('Category created!');
      setShowModal(false);
      setForm({ name: '', description: '' });
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  const display = categories.length ? categories : demoCategories;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-cream">Categories</h1>
          <p className="text-cream/40 mt-1">{display.length} categories</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {display.map((cat, i) => (
          <div key={cat._id} className="card p-5 flex items-center gap-4 hover:border-white/10 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0 text-2xl">
              {['📱', '👗', '🏠', '💄', '⚽', '📚'][i % 6]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-cream">{cat.name}</p>
                <span className={`badge text-xs ${cat.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {cat.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>
              <p className="text-xs text-cream/40 font-mono mt-0.5">/{cat.slug}</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-brand-500/10 text-cream/30 hover:text-brand-400 transition-all">
                <Edit size={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-cream/30 hover:text-red-400 transition-all">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative glass-strong rounded-2xl p-6 max-w-md w-full border border-white/10 animate-scale-in">
            <div className="flex items-center gap-3 mb-6">
              <Tag size={20} className="text-brand-400" />
              <h3 className="text-xl font-bold text-cream">Add Category</h3>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="label">Category Name *</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Electronics" className="input-field" />
              </div>
              <div>
                <label className="label">Description</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description" className="input-field" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
                  {saving ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
