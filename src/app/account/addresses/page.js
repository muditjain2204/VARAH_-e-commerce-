'use client';

import { MapPin, Plus } from 'lucide-react';

export default function AddressesPage() {
  // Since we haven't built the backend API for addresses yet, we'll show a mock UI
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ margin: 0 }}>My <span>Addresses</span></h1>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <Plus size={16} /> Add New
        </button>
      </div>
      <div className="divider" style={{ marginBottom: '2rem' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Mock Address Card */}
        <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', backgroundColor: 'var(--bg-body)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
            <span style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', color: 'var(--gold-500)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Default</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--bg-card)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-500)', border: '1px solid var(--border-color)' }}>
              <MapPin size={20} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Home</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>+91 9876543210</p>
            </div>
          </div>

          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            123, Heritage Residency, Block A<br />
            Near Silk Board Junction<br />
            Bangalore, Karnataka - 560068<br />
            India
          </div>

          <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <button style={{ background: 'none', border: 'none', color: 'var(--gold-500)', fontWeight: 600, cursor: 'pointer', padding: 0 }}>Edit</button>
            <button style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer', padding: 0 }}>Delete</button>
          </div>
        </div>
        
        {/* Add New Box */}
        <button style={{ border: '1px dashed var(--border-color)', borderRadius: '12px', padding: '1.5rem', backgroundColor: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', cursor: 'pointer', minHeight: '220px', transition: 'all 0.2s ease' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--gold-500)'; e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.02)'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
          <div style={{ width: '50px', height: '50px', backgroundColor: 'var(--bg-body)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            <Plus size={24} />
          </div>
          <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Add New Address</span>
        </button>
      </div>
    </>
  );
}
