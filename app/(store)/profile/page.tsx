'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, Mail, Phone, Save, MapPin, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success('Profile updated successfully!');
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-cream mb-8">My Profile</h1>

      <div className="space-y-6">
        {/* Avatar */}
        <div className="card p-6 flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-3xl font-black">
              {session?.user?.name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="text-xl font-bold text-cream">{session?.user?.name}</p>
            <p className="text-cream/40">{session?.user?.email}</p>
            <span className="badge bg-brand-500/10 text-brand-400 text-xs mt-2">
              {session?.user?.role === 'admin' ? '👑 Admin' : '👤 Customer'}
            </span>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="card p-6 space-y-5">
          <h3 className="text-lg font-bold text-cream flex items-center gap-2">
            <User size={18} className="text-brand-400" /> Personal Information
          </h3>
          <div>
            <label className="label">Full Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="input-field" />
          </div>
          <div>
            <label className="label">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/30" />
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input-field pl-10" />
            </div>
          </div>
          <div>
            <label className="label">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/30" />
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+1 (555) 000-0000" className="input-field pl-10" />
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
          </button>
        </form>

        {/* Addresses */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-cream flex items-center gap-2">
              <MapPin size={18} className="text-brand-400" /> Saved Addresses
            </h3>
            <button className="btn-ghost text-sm"><Plus size={16} /> Add</button>
          </div>
          <div className="text-center py-8 text-cream/30">
            <MapPin size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No saved addresses yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
