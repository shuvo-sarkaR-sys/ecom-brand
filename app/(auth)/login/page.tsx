'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Welcome back!');
        router.push('/');
        router.refresh();
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'admin' | 'user') => {
    const credentials = {
      admin: { email: 'admin@luxe.com', password: 'admin123' },
      user: { email: 'user@luxe.com', password: 'user123' },
    };
    setForm(credentials[role]);
    setLoading(true);

    const result = await signIn('credentials', {
      ...credentials[role],
      redirect: false,
    });

    if (result?.error) {
      toast.error('Demo account not seeded yet. Run: npm run seed');
    } else {
      toast.success(`Logged in as ${role}!`);
      router.push(role === 'admin' ? '/dashboard' : '/');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-cream mb-2">Welcome back</h1>
        <p className="text-cream/40">Sign in to your LUXE account</p>
      </div>

      {/* Demo Accounts */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => handleDemoLogin('admin')}
          className="p-3 glass rounded-xl text-left border border-brand-500/20 hover:border-brand-500/40 transition-all group"
        >
          <p className="text-xs text-brand-400 font-semibold mb-0.5">Admin Demo</p>
          <p className="text-xs text-cream/40">Full dashboard access</p>
        </button>
        <button
          onClick={() => handleDemoLogin('user')}
          className="p-3 glass rounded-xl text-left border border-white/5 hover:border-white/10 transition-all"
        >
          <p className="text-xs text-cream/70 font-semibold mb-0.5">User Demo</p>
          <p className="text-xs text-cream/40">Customer account</p>
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-xs text-cream/30">or sign in manually</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label">Email Address</label>
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
            className="input-field"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label mb-0">Password</label>
            <Link href="/forgot-password" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
              className="input-field pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-4 text-base disabled:opacity-50 group"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in...
            </span>
          ) : (
            <>
              <LogIn size={18} />
              Sign In
              <ArrowRight size={16} className="ml-auto group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-cream/40">
        Don't have an account?{' '}
        <Link href="/register" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
          Create one free
        </Link>
      </p>
    </div>
  );
}
