'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, LogOut, Package, MapPin, Heart } from 'lucide-react';
import Link from 'next/link';
import styles from './account.module.css';

export default function AccountLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('varah_user');
    if (!storedUser) {
      router.push('/auth');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('varah_token');
    localStorage.removeItem('varah_user');
    router.push('/auth');
  };

  if (!user) return <div style={{ minHeight: '100vh', paddingTop: '120px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className={styles.page}>
      <div className={`container ${styles.container}`}>
        <div className={styles.sidebar}>
          <div className={styles.profileCard}>
            <div className={styles.avatar}>
              <User size={40} />
            </div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
          <nav className={styles.nav}>
            <Link href="/account" className={pathname === '/account' ? styles.active : ''}>
              <User size={18} /> My Profile
            </Link>
            <Link href="/account/orders" className={pathname === '/account/orders' ? styles.active : ''}>
              <Package size={18} /> My Orders
            </Link>
            <Link href="/account/addresses" className={pathname === '/account/addresses' ? styles.active : ''}>
              <MapPin size={18} /> Addresses
            </Link>
            <Link href="/wishlist">
              <Heart size={18} /> Wishlist
            </Link>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <LogOut size={18} /> Logout
            </button>
          </nav>
        </div>

        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
