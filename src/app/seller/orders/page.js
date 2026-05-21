'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Package, Truck, Search, Filter, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('varah_token');
    if (token) {
      fetch('http://localhost:5000/api/seller/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (!data.error && data.orders) {
          setOrders(data.orders);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch orders:", err);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const handleShip = async (itemId) => {
    const token = localStorage.getItem('varah_token');
    try {
      const res = await fetch(`http://localhost:5000/api/seller/orders/${itemId}/ship`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ trackingId: 'TRK-' + Math.floor(Math.random() * 1000000) })
      });
      const data = await res.json();
      if (!data.error) {
        setOrders(orders.map(o => o.id === itemId ? { ...o, fulfillmentStatus: 'SHIPPED' } : o));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', backgroundColor: 'rgba(255, 152, 0, 0.1)', color: '#FF9800', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}><Clock size={12} /> Pending</span>;
      case 'SHIPPED': return <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', backgroundColor: 'rgba(33, 150, 243, 0.1)', color: '#2196F3', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}><Truck size={12} /> Shipped</span>;
      case 'DELIVERED': return <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}><CheckCircle size={12} /> Delivered</span>;
      default: return <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{status}</span>;
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '8px' }}>Customer Orders</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage fulfillment and view order details.</p>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        
        {/* Toolbar */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '15px' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search orders by ID or customer..." style={{ width: '100%', padding: '10px 15px 10px 45px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
          </div>
          <button className="btn btn-outline" style={{ display: 'flex', gap: '8px' }}>
            <Filter size={18} /> Status Filter
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '13px' }}>ORDER ID & DATE</th>
                <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '13px' }}>ITEM DETAILS</th>
                <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '13px' }}>CUSTOMER</th>
                <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '13px' }}>AMOUNT</th>
                <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '13px' }}>STATUS</th>
                <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '13px', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Package size={48} style={{ opacity: 0.2, margin: '0 auto 15px' }} />
                  <p>You don't have any customer orders yet.</p>
                </td></tr>
              ) : (
                orders.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '15px 20px' }}>
                      <div style={{ fontWeight: '500', color: 'var(--text-primary)', marginBottom: '4px' }}>#{item.order.id.substring(0, 8).toUpperCase()}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(item.order.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td style={{ padding: '15px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', position: 'relative', backgroundColor: 'var(--bg-primary)' }}>
                          <Image src={item.product?.images?.[0] || '/images/products/saree-1.png'} alt={item.product?.name || 'Product'} fill style={{ objectFit: 'cover' }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: '500', color: 'var(--text-primary)', fontSize: '14px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product?.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '15px 20px' }}>
                      <div style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{item.order.user?.name || 'Guest'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.order.address?.city}, {item.order.address?.state}</div>
                    </td>
                    <td style={{ padding: '15px 20px', fontWeight: '500' }}>₹{(item.price * item.quantity).toLocaleString()}</td>
                    <td style={{ padding: '15px 20px' }}>
                      {getStatusBadge(item.fulfillmentStatus)}
                    </td>
                    <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                      {item.fulfillmentStatus === 'PENDING' ? (
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => handleShip(item.id)}
                        >
                          Mark Shipped
                        </button>
                      ) : (
                        <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px', opacity: 0.5 }} disabled>
                          Track Order
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
