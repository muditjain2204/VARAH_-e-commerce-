'use client';

import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('varah_token');
    if (!token) return;

    fetch('http://localhost:5000/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setOrders(data.orders || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch orders:', err);
        setLoading(false);
      });
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle size={16} color="#10b981" />;
      case 'CANCELLED': return <XCircle size={16} color="#ef4444" />;
      default: return <Clock size={16} color="#f59e0b" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <>
      <h1 className="section-title">My <span>Orders</span></h1>
      <div className="divider" style={{ marginBottom: '2rem' }} />

      {loading ? (
        <p>Loading your orders...</p>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', backgroundColor: 'var(--bg-body)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <Package size={48} color="var(--text-tertiary)" style={{ margin: '0 auto 1rem' }} />
          <h3>No orders yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You haven't placed any orders yet.</p>
          <Link href="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map(order => (
            <div key={order.id} style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', backgroundColor: 'var(--bg-body)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>Order #{order.id.substring(0, 8).toUpperCase()}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                  {getStatusIcon(order.status)}
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{order.status}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {order.items?.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '60px', height: '60px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Package size={24} color="var(--text-tertiary)" />
                      </div>
                      <div>
                        <Link href={`/product/${item.product?.slug}`} style={{ fontWeight: 500, color: 'var(--text-primary)', textDecoration: 'none' }}>
                          {item.product?.name || 'Product unavailable'}
                        </Link>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1.5rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Amount</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--gold-500)' }}>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
