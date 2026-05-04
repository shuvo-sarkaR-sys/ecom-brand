'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Eye, EyeOff, UserPlus, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordStrength = (p: string) => {
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strength = passwordStrength(form.password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Registration failed');
        return;
      }

      // Auto sign in
      const signInResult = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.success('Account created! Please sign in.');
        router.push('/login');
      } else {
        toast.success('Welcome to LUXE! 🎉');
        router.push('/');
        router.refresh();
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-cream mb-2">Create account</h1>
        <p className="text-cream/40">Join LUXE and discover premium products</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label">Full Name</label>
          <input
            type="text"
            required
            autoComplete="name"
            placeholder="John Doe"
            value={form.name}
            onChange={set('name')}
            className="input-field"
          />
        </div>

        <div>
          <label className="label">Email Address</label>
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={set('email')}
            className="input-field"
          />
        </div>

        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={set('password')}
              className="input-field pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Strength indicator */}
          {form.password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : 'bg-white/10'}`} />
                ))}
              </div>
              <p className="text-xs text-cream/40">{strengthLabel} password</p>
            </div>
          )}
        </div>

        <div>
          <label className="label">Confirm Password</label>
          <div className="relative">
            <input
              type="password"
              required
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              className="input-field pr-12"
            />
            {form.confirmPassword && (
              <div className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${form.password === form.confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                <Check size={18} />
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-cream/30 leading-relaxed">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-brand-400 hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-brand-400 hover:underline">Privacy Policy</Link>.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-4 text-base disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            <>
              <UserPlus size={18} />
              Create Account
            </>
          )}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-cream/40">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
