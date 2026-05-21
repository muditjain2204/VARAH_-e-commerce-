'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Edit2, Trash2, Plus, Search, Filter, Package } from 'lucide-react';

export default function SellerInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('varah_token');
    if (token) {
      fetch('http://localhost:5000/api/seller/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (!data.error && data.products) {
          setProducts(data.products);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch inventory:", err);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '8px' }}>My Inventory</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your products, pricing, and stock levels.</p>
        </div>
        <Link href="/seller/products/add" className="btn btn-primary" style={{ display: 'flex', gap: '8px' }}>
          <Plus size={18} /> Add New Product
        </Link>
      </div>

      <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        
        {/* Toolbar */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '15px' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search by product name or ID..." style={{ width: '100%', padding: '10px 15px 10px 45px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
          </div>
          <button className="btn btn-outline" style={{ display: 'flex', gap: '8px' }}>
            <Filter size={18} /> Filter
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '13px' }}>PRODUCT</th>
                <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '13px' }}>CATEGORY</th>
                <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '13px' }}>PRICE</th>
                <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '13px' }}>STOCK</th>
                <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '13px' }}>STATUS</th>
                <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '13px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading inventory...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Package size={48} style={{ opacity: 0.2, margin: '0 auto 15px' }} />
                  <p>You haven't added any products yet.</p>
                </td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '15px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', position: 'relative', backgroundColor: 'var(--bg-primary)' }}>
                          <Image src={product.images?.[0] || '/images/products/saree-1.png'} alt={product.name} fill style={{ objectFit: 'cover' }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: '500', color: 'var(--text-primary)', marginBottom: '4px' }}>{product.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: {product.id.substring(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>{product.category}</td>
                    <td style={{ padding: '15px 20px', fontWeight: '500' }}>₹{product.price.toLocaleString()}</td>
                    <td style={{ padding: '15px 20px' }}>
                      <span style={{ color: product.stockCount > 10 ? '#4CAF50' : product.stockCount > 0 ? '#FF9800' : '#F44336' }}>
                        {product.stockCount} in stock
                      </span>
                    </td>
                    <td style={{ padding: '15px 20px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        fontSize: '12px', 
                        fontWeight: '500',
                        backgroundColor: product.status === 'ACTIVE' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                        color: product.status === 'ACTIVE' ? '#4CAF50' : '#FF9800'
                      }}>
                        {product.status}
                      </span>
                    </td>
                    <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} title="Edit"><Edit2 size={18} /></button>
                        <button style={{ background: 'none', border: 'none', color: '#F44336', cursor: 'pointer' }} title="Delete"><Trash2 size={18} /></button>
                      </div>
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
