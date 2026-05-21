'use client';

import { useEffect, useState } from 'react';
import { Store, CreditCard, Bell, Shield, MapPin } from 'lucide-react';

export default function SellerSettings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('varah_token');
    if (token) {
      fetch('http://localhost:5000/api/seller/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (!data.error && data.seller) {
          setProfile(data.seller);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch settings:", err);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div style={{ padding: '30px' }}>Loading settings...</div>;

  return (
    <div style={{ padding: '30px', maxWidth: '1000px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '8px' }}>Store Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your public store profile, banking, and preferences.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '30px' }}>
        
        {/* Settings Navigation Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', textAlign: 'left', cursor: 'pointer', fontWeight: '500' }}>
            <Store size={18} /> Shop Profile
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid transparent', textAlign: 'left', cursor: 'pointer' }}>
            <MapPin size={18} /> Business Address
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid transparent', textAlign: 'left', cursor: 'pointer' }}>
            <CreditCard size={18} /> Bank & Payouts
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid transparent', textAlign: 'left', cursor: 'pointer' }}>
            <Shield size={18} /> KYC & Security
          </button>
        </div>

        {/* Settings Content Area */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '30px' }}>
          <h2 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>Shop Profile Details</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Shop Name</label>
              <input type="text" readOnly value={profile?.shopName || ''} style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', opacity: 0.8 }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Public Description</label>
              <textarea readOnly value={profile?.description || ''} rows={4} style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', opacity: 0.8 }} />
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>This description appears on your public storefront.</p>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Primary Category</label>
                <input type="text" readOnly value={profile?.category || ''} style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', opacity: 0.8 }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Account Status</label>
                <input type="text" readOnly value={profile?.status || ''} style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50', fontWeight: 'bold' }} />
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
              <button className="btn btn-primary" disabled style={{ opacity: 0.5 }}>Save Changes</button>
            </div>
            
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(33, 150, 243, 0.1)', borderRadius: '8px', border: '1px solid rgba(33, 150, 243, 0.2)' }}>
              <p style={{ fontSize: '13px', color: '#2196F3', margin: 0 }}>
                <strong>Note:</strong> Editing shop profile details is currently disabled while your account is active. To change your core business details, please contact support.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
