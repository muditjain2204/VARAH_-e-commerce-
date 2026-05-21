'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, PackagePlus, List, ShoppingBag, Settings, LogOut } from 'lucide-react';
import styles from './seller-layout.module.css';

export default function SellerLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('varah_user');
    localStorage.removeItem('varah_token');
    router.replace('/auth');
  };

  // Do not show the seller sidebar on the registration page
  if (pathname === '/seller/register') {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard Overview', href: '/seller/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Add New Product', href: '/seller/products/add', icon: <PackagePlus size={20} /> },
    { name: 'My Inventory', href: '/seller/products', icon: <List size={20} /> },
    { name: 'Customer Orders', href: '/seller/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Settings', href: '/seller/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className={styles.sellerLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Seller Portal</h2>
          <span className={styles.badge}>VERIFIED</span>
        </div>
        
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.backToStoreBtn} style={{ marginBottom: '10px' }}>
            <ShoppingBag size={18} />
            <span>Switch to Buyer</span>
          </Link>
          <a href="#" onClick={handleLogout} className={styles.backToStoreBtn} style={{ color: '#F44336' }}>
            <LogOut size={18} />
            <span>Log Out</span>
          </a>
        </div>
      </aside>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
