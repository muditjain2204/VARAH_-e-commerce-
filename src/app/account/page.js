'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Phone } from 'lucide-react';
import styles from './account.module.css';

export default function AccountPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('varah_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return null; // handled by layout

  return (
    <>
      <h1 className="section-title">My <span>Profile</span></h1>
      <div className="divider" style={{ marginBottom: '2rem' }} />
      
      <div className={styles.infoGrid}>
        <div className={styles.infoGroup}>
          <label>Full Name</label>
          <div className={styles.infoValue}>
            <User size={16} /> {user.name}
          </div>
        </div>
        <div className={styles.infoGroup}>
          <label>Email Address</label>
          <div className={styles.infoValue}>
            <Mail size={16} /> {user.email}
          </div>
        </div>
        <div className={styles.infoGroup}>
          <label>Phone Number</label>
          <div className={styles.infoValue}>
            <Phone size={16} /> {user.phone || 'Not provided'}
          </div>
        </div>
        <div className={styles.infoGroup}>
          <label>Role</label>
          <div className={styles.infoValue}>
            <span className={styles.badge}>{user.role}</span>
          </div>
        </div>
      </div>
    </>
  );
}
