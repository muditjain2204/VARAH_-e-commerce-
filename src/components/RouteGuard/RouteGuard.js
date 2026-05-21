'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import CartDrawer from '@/components/CartDrawer/CartDrawer';
import Footer from '@/components/Footer/Footer';

export default function RouteGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  const isSellerRoute = pathname?.startsWith('/seller');

  useEffect(() => {
    const userStr = localStorage.getItem('varah_user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    const isBuyerRoute = !isSellerRoute && !pathname?.startsWith('/auth');

    if (user) {
      // Buyers cannot visit seller pages (except register)
      if (user.role !== 'SELLER' && isSellerRoute && pathname !== '/seller/register') {
        router.replace('/');
        return;
      }
    } else {
      // Unauthenticated users cannot visit seller pages
      if (isSellerRoute && pathname !== '/seller/register') {
        router.replace('/auth');
        return;
      }
    }
    
    setAuthorized(true);
  }, [pathname, router, isSellerRoute]);

  if (!authorized) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      {children}
      {!isSellerRoute && <CartDrawer />}
      {!isSellerRoute && <Footer />}
    </>
  );
}
