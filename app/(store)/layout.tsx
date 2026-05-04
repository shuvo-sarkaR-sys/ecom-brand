import { Navbar } from '@/components/layout/Navbar';
import { CartSidebar } from '@/components/store/CartSidebar';
import { Footer } from '@/components/layout/Footer';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <CartSidebar />
      <main className="min-h-screen pt-16 md:pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
