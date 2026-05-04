'use client';

import { signOut } from 'next-auth/react';
import { Bell, LogOut, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface DashboardHeaderProps {
  user: { name?: string | null; email?: string | null; role: string };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-ink-soft flex-shrink-0">
      <div>
        <p className="text-xs text-cream/30 uppercase tracking-widest">Admin Panel</p>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/" target="_blank"
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-cream/50 hover:text-cream hover:bg-white/5 rounded-lg transition-all">
          <ExternalLink size={14} />
          <span className="hidden sm:inline">View Store</span>
        </Link>

        <button className="w-9 h-9 flex items-center justify-center hover:bg-white/5 rounded-xl transition-all text-cream/50 hover:text-cream relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-white/5">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-cream">{user.name}</p>
            <p className="text-xs text-cream/40">{user.email}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">
              {user.name?.[0]?.toUpperCase()}
            </span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-9 h-9 flex items-center justify-center hover:bg-red-500/10 rounded-xl transition-all text-cream/40 hover:text-red-400"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
