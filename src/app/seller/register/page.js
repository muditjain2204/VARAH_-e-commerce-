'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Store, MapPin, Building2, User, X, Check, Shield } from 'lucide-react';
import styles from './register.module.css';

export default function MeeshoSellerRegister() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [hasGstin, setHasGstin] = useState(null); // null, true, or false
  const [showEidModal, setShowEidModal] = useState(false);
  
  // EID Modal form state
  const [eidForm, setEidForm] = useState({
    pan: '', name: '', email: '', state: '', pincode: '',
    district: '', city: '', building: '', street: ''
  });

  // Main Registration State
  const [form, setForm] = useState({
    mobile: '9876543210', // Assuming passed from previous OTP screen
    gstin: '',
    enrolmentId: '',
    panNumber: '',
    
    // Step 2: Pickup
    pickupAddress: '',
    pickupCity: '',
    pickupState: '',
    pickupPincode: '',

    // Step 3: Bank
    accountNumber: '',
    ifsc: '',

    // Step 4: Supplier
    storeName: '',
    fullName: ''
  });

  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 1, name: 'Business Details', icon: <Building2 /> },
    { id: 2, name: 'Pickup Address', icon: <MapPin /> },
    { id: 3, name: 'Bank Details', icon: <Building2 /> },
    { id: 4, name: 'Supplier Details', icon: <User /> }
  ];

  const handleEidSubmit = () => {
    // Simulate API call to generate EID
    const generatedEid = `EID${Math.floor(Math.random() * 1000000000)}`;
    setForm(prev => ({ ...prev, enrolmentId: generatedEid, panNumber: eidForm.pan }));
    setShowEidModal(false);
    // Move to next step since GST/EID is sorted
    setStep(2);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem('varah_token');
    
    try {
      const res = await fetch('http://localhost:5000/api/seller/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          shopName: form.storeName,
          shopAddress: form.pickupAddress,
          city: form.pickupCity,
          state: form.pickupState,
          pincode: form.pickupPincode,
          pan: form.panNumber,
          gstin: hasGstin ? form.gstin : null,
          enrolmentId: !hasGstin ? form.enrolmentId : null,
          bankAccount: form.accountNumber,
          ifsc: form.ifsc,
          bankAccountName: form.fullName
        })
      });

      const data = await res.json();
      if (!data.error) {
        router.push('/seller/dashboard');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      
      {/* Top Header */}
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>VARAH</Link>
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Supplier Panel</span>
      </header>

      <main className={styles.mainLayout}>
        
        {/* Left Side: Form Area */}
        <div className={styles.formSection}>
          
          {/* Stepper Navigation */}
          <div className={styles.stepper}>
            {steps.map((s) => (
              <div key={s.id} className={`${styles.step} ${step >= s.id ? styles.active : ''}`}>
                <div className={styles.stepIcon}>{s.icon}</div>
                <span>{s.name}</span>
              </div>
            ))}
          </div>

          {/* Render Current Step Content */}
          <div className={styles.stepContent}>
            
            {/* STEP 1: Business Details */}
            {step === 1 && (
              <div>
                <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Do you have a GST number?</h2>
                
                <div className={styles.gstCards}>
                  {/* GSTIN YES Card */}
                  <div 
                    className={`${styles.gstCard} ${hasGstin === true ? styles.selected : ''}`}
                    onClick={() => setHasGstin(true)}
                  >
                    <div className={styles.radioHeader}>
                      <input type="radio" checked={hasGstin === true} readOnly />
                      <span>Yes</span>
                    </div>
                    <p className={styles.cardDesc}>Enter your GSTIN and sell anywhere easily</p>
                  </div>

                  {/* GSTIN NO Card */}
                  <div 
                    className={`${styles.gstCard} ${hasGstin === false ? styles.selected : ''}`}
                    onClick={() => setHasGstin(false)}
                  >
                    <div className={styles.radioHeader}>
                      <input type="radio" checked={hasGstin === false} readOnly />
                      <span>No</span>
                    </div>
                    <p className={styles.cardDesc}>Worry not, you can sell without GST.</p>
                    <span className={styles.cardDesc} style={{ display: 'block', color: '#FF9800', fontWeight: 'bold', marginTop: '5px' }}>Get EID in mins ⚡</span>
                  </div>
                </div>

                {hasGstin === true && (
                  <div>
                    <div className={styles.field}>
                      <input 
                        type="text" 
                        placeholder="Enter 15 digit GSTIN" 
                        className={styles.input}
                        value={form.gstin}
                        onChange={(e) => setForm({...form, gstin: e.target.value})}
                      />
                    </div>
                    <button 
                      className={styles.continueBtn} 
                      disabled={form.gstin.length !== 15}
                      onClick={() => setStep(2)}
                    >
                      Verify & Continue
                    </button>
                  </div>
                )}

                {hasGstin === false && (
                  <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <div style={{ color: '#4CAF50' }}><Shield size={24} /></div>
                      <div>
                        <h4 style={{ marginBottom: '8px' }}>Sell without GST (Intra-state)</h4>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '15px' }}>
                          We only need your PAN and Address details to generate an Enrolment ID (EID) on your behalf.
                        </p>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => setShowEidModal(true)}
                        >
                          Create EID Now
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Pickup Address */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Pickup Address</h2>
                <div className={styles.formGrid}>
                  <div className={styles.field} style={{ gridColumn: 'span 2' }}>
                    <label className={styles.label}>Room/Floor/Building Number & Street</label>
                    <input type="text" className={styles.input} value={form.pickupAddress} onChange={e => setForm({...form, pickupAddress: e.target.value})} />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Pincode</label>
                    <input type="text" className={styles.input} value={form.pickupPincode} onChange={e => setForm({...form, pickupPincode: e.target.value})} />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>City</label>
                    <input type="text" className={styles.input} value={form.pickupCity} onChange={e => setForm({...form, pickupCity: e.target.value})} />
                  </div>
                  <div className={styles.field} style={{ gridColumn: 'span 2' }}>
                    <label className={styles.label}>State</label>
                    <input type="text" className={styles.input} value={form.pickupState} onChange={e => setForm({...form, pickupState: e.target.value})} />
                  </div>
                </div>
                <button className={styles.continueBtn} onClick={() => setStep(3)}>Continue</button>
              </div>
            )}

            {/* STEP 3: Bank Details */}
            {step === 3 && (
              <div>
                <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Bank Details</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Used for your payouts. Must match your PAN name.</p>
                
                <div className={styles.field}>
                  <label className={styles.label}>Account Number</label>
                  <input type="password" className={styles.input} value={form.accountNumber} onChange={e => setForm({...form, accountNumber: e.target.value})} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>IFSC Code</label>
                  <input type="text" className={styles.input} value={form.ifsc} onChange={e => setForm({...form, ifsc: e.target.value})} />
                </div>
                <button className={styles.continueBtn} onClick={() => setStep(4)}>Continue</button>
              </div>
            )}

            {/* STEP 4: Supplier Details */}
            {step === 4 && (
              <div>
                <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Supplier Details</h2>
                <div className={styles.field}>
                  <label className={styles.label}>Store Name</label>
                  <input type="text" className={styles.input} placeholder="e.g. Traditional Weaves" value={form.storeName} onChange={e => setForm({...form, storeName: e.target.value})} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Your Full Name (As per Bank/PAN)</label>
                  <input type="text" className={styles.input} value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
                </div>
                <button className={styles.continueBtn} onClick={handleFinalSubmit} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Right Side: Info Panel (FAQ) */}
        <div className={styles.infoSection}>
          <div className={styles.infoBox}>
            <h3 className={styles.infoTitle}>
              <Store size={20} color="var(--primary-color)" /> 
              More than 100,000 suppliers are growing their business
            </h3>
            
            <div style={{ marginTop: '30px' }}>
              <h4 style={{ fontSize: '15px', marginBottom: '15px', color: 'var(--text-muted)' }}>Frequently Asked Questions</h4>
              
              <div className={styles.faqItem}>
                <div className={styles.faqQuestion}>Which sellers can sell on VARAH?</div>
                <div className={styles.faqAnswer}>
                  Starting 2024, sellers (with or without GST registration) can sell on our platform. 
                  Non-GST sellers must obtain an Enrolment ID (EID) to start selling.
                </div>
              </div>

              <div className={styles.faqItem}>
                <div className={styles.faqQuestion}>How can I obtain an Enrolment ID?</div>
                <div className={styles.faqAnswer}>
                  You can click "No, I don't have GST" and we will generate one for you instantly using your PAN card details via the Government portal API.
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* EID Generation Modal */}
      {showEidModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            
            <div className={styles.modalHeader}>
              <h2>Create your EID</h2>
              <button className={styles.closeBtn} onClick={() => setShowEidModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Add Details</span>
                </div>
              </div>

              <div className={styles.modalSectionTitle}>PAN and Contact Details</div>
              <div className={styles.formGrid}>
                <input type="text" placeholder="PAN Number" className={styles.input} value={eidForm.pan} onChange={e => setEidForm({...eidForm, pan: e.target.value})} />
                <input type="text" placeholder="Name as per PAN" className={styles.input} value={eidForm.name} onChange={e => setEidForm({...eidForm, name: e.target.value})} />
                <input type="email" placeholder="Email ID" className={styles.input} style={{ gridColumn: 'span 2' }} value={eidForm.email} onChange={e => setEidForm({...eidForm, email: e.target.value})} />
              </div>

              <div className={styles.modalSectionTitle}>Address Details</div>
              <div className={styles.formGrid}>
                <select className={styles.input} value={eidForm.state} onChange={e => setEidForm({...eidForm, state: e.target.value})}>
                  <option value="">Select State</option>
                  <option value="maharashtra">Maharashtra</option>
                  <option value="gujarat">Gujarat</option>
                  <option value="delhi">Delhi</option>
                </select>
                <input type="text" placeholder="Pincode" className={styles.input} value={eidForm.pincode} onChange={e => setEidForm({...eidForm, pincode: e.target.value})} />
                <input type="text" placeholder="District" className={styles.input} value={eidForm.district} onChange={e => setEidForm({...eidForm, district: e.target.value})} />
                <input type="text" placeholder="City" className={styles.input} value={eidForm.city} onChange={e => setEidForm({...eidForm, city: e.target.value})} />
                <input type="text" placeholder="Room/Floor/Building" className={styles.input} value={eidForm.building} onChange={e => setEidForm({...eidForm, building: e.target.value})} />
                <input type="text" placeholder="Street/Locality" className={styles.input} value={eidForm.street} onChange={e => setEidForm({...eidForm, street: e.target.value})} />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                className="btn btn-primary" 
                onClick={handleEidSubmit}
                disabled={!eidForm.pan || !eidForm.pincode}
              >
                Submit Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
