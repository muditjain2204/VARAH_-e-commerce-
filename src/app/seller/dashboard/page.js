'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IndianRupee, ShoppingBag, Package, TrendingUp, AlertTriangle } from 'lucide-react';

export default function SellerDashboard() {
  const [sellerName, setSellerName] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('varah_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setSellerName(user.name);
    }

    const token = localStorage.getItem('varah_token');
    if (token) {
      fetch('http://localhost:5000/api/seller/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(resData => {
        if (!resData.error) {
          setData(resData);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Dashboard fetch error:", err);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div style={{ padding: '30px' }}>Loading your dashboard...</div>;

  const isPending = data?.seller?.status === 'PENDING';

  return (
    <div style={{ padding: '30px' }}>
      
      {isPending && (
        <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '16px 20px', borderRadius: '8px', marginBottom: '30px', display: 'flex', alignItems: 'flex-start', gap: '12px', border: '1px solid #ffeeba' }}>
          <AlertTriangle size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>Your KYC Verification is Pending</h4>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5 }}>
              Your seller application has been submitted and is currently under review by our team. 
              You will not be able to list products or receive orders until your KYC documents are verified. This usually takes 24-48 hours.
            </p>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Welcome back, {sellerName || data?.seller?.shopName}! 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Here is what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px', opacity: isPending ? 0.6 : 1 }}>
        
        {/* Stat Card 1 */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Total Revenue</span>
            <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '8px', borderRadius: '8px', color: 'var(--accent-gold)' }}>
              <IndianRupee size={20} />
            </div>
          </div>
          <h3 style={{ fontSize: '28px', color: 'var(--text-primary)', margin: '0' }}>₹{data?.seller?.totalRevenue?.toLocaleString() || 0}</h3>
          <span style={{ color: '#4CAF50', fontSize: '13px', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} /> +0.0% from last month
          </span>
        </div>

        {/* Stat Card 2 */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Orders Pending</span>
            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '8px', borderRadius: '8px', color: '#3b82f6' }}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <h3 style={{ fontSize: '28px', color: 'var(--text-primary)', margin: '0' }}>{data?.stats?.pendingOrders || 0}</h3>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '10px' }}>
            Requires your attention
          </span>
        </div>

        {/* Stat Card 3 */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Active Products</span>
            <div style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', padding: '8px', borderRadius: '8px', color: '#a855f7' }}>
              <Package size={20} />
            </div>
          </div>
          <h3 style={{ fontSize: '28px', color: 'var(--text-primary)', margin: '0' }}>{data?.stats?.totalProducts || 0}</h3>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '10px' }}>
            Live in store
          </span>
        </div>

      </div>

      {/* Quick Actions */}
      <div>
        <h2 style={{ fontSize: '20px', color: 'var(--text-primary)', marginBottom: '20px' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '15px' }}>
          {isPending ? (
            <button className="btn btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
              + Add New Product (Locked)
            </button>
          ) : (
            <Link href="/seller/products/add" className="btn btn-primary">
              + Add New Product
            </Link>
          )}
          <button className="btn btn-secondary">
            View Order Queue
          </button>
        </div>
      </div>
    </div>
  );
}
