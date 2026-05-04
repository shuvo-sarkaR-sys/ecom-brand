import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-ink-soft to-ink" />
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-3xl animate-float" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow">
              <span className="text-white font-black">L</span>
            </div>
            <span className="text-2xl font-black text-cream">LUXE<span className="text-brand-400">.</span></span>
          </Link>

          <div>
            <blockquote className="text-4xl font-black text-cream leading-tight mb-6">
              "Where premium<br />meets <span className="gradient-text">possibility</span>."
            </blockquote>
            <p className="text-cream/40 text-lg">
              Discover a curated selection of premium products, crafted for those who demand the best.
            </p>

            <div className="flex items-center gap-6 mt-12">
              {[
                { value: '50K+', label: 'Products' },
                { value: '99%', label: 'Satisfaction' },
                { value: '10K+', label: 'Customers' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-black text-cream">{stat.value}</p>
                  <p className="text-sm text-cream/40">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-cream/20 text-sm">© 2025 LUXE. All rights reserved.</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <span className="text-white font-black text-sm">L</span>
              </div>
              <span className="text-xl font-black text-cream">LUXE<span className="text-brand-400">.</span></span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
