'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { MapPin, CreditCard, Truck, Shield, ChevronRight, Check, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice: subtotal } = useCart();

  const [step, setStep] = useState(1); // 1 = address, 2 = payment, 3 = confirm
  const [address, setAddress] = useState({
    fullName: '', phone: '', pincode: '', locality: '',
    addressLine: '', city: '', state: '', landmark: '',
    addressType: 'home',
  });
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const shipping = subtotal >= 2999 ? 0 : 99;
  const codCharge = paymentMethod === 'cod' ? 50 : 0;
  const total = subtotal + shipping + codCharge;

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (paymentMethod === 'cod') {
      alert("Order placed successfully with Cash on Delivery!");
      return;
    }

    try {
      setIsProcessing(true);
      const token = localStorage.getItem('varah_token');

      // 1. Create order on backend
      const res = await fetch('http://localhost:5000/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: total })
      });
      const data = await res.json();

      if (data.error) throw new Error(data.message);

      // 2. Open Razorpay Checkout Widget
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
        amount: data.amount,
        currency: data.currency,
        name: "VARAH Luxury Handloom",
        description: "Purchase Order",
        order_id: data.orderId,
        handler: async function (response) {
          // 3. Verify Payment Signature
          const verifyRes = await fetch('http://localhost:5000/api/payments/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderDetails: { address, items: cartItems, totalAmount: total }
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyData.error) {
            alert('Payment Verification Failed!');
          } else {
            alert('Payment Successful! Your order has been placed.');
            // Here you would clear cart and redirect to order success page
          }
        },
        prefill: {
          name: address.fullName,
          contact: address.phone,
        },
        theme: {
          color: "#D4AF37" // Varah Gold
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        alert("Payment Failed: " + response.error.description);
      });
      rzp1.open();

    } catch (err) {
      console.error(err);
      alert("Could not initiate payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyPage}>
        <div className="container">
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>🛒</span>
            <h2>Your Cart is Empty</h2>
            <p>Add some beautiful pieces to get started!</p>
            <Link href="/products" className="btn btn-primary btn-lg">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="container">
        {/* Breadcrumbs */}
        <div className={styles.breadcrumbs}>
          <Link href="/">Home</Link>
          <ChevronRight size={14} />
          <span>Checkout</span>
        </div>

        {/* Steps Indicator */}
        <div className={styles.steps}>
          {[
            { num: 1, label: 'Address' },
            { num: 2, label: 'Payment' },
            { num: 3, label: 'Confirm' },
          ].map((s) => (
            <div
              key={s.num}
              className={`${styles.stepItem} ${step >= s.num ? styles.stepActive : ''} ${step > s.num ? styles.stepDone : ''}`}
            >
              <div className={styles.stepCircle}>
                {step > s.num ? <Check size={16} /> : s.num}
              </div>
              <span className={styles.stepLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.layout}>
          {/* Left — Form Area */}
          <div className={styles.formArea}>
            {/* Step 1: Address */}
            {step === 1 && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>
                  <MapPin size={20} /> Delivery Address
                </h2>

                <div className={styles.formGrid}>
                  <div className={styles.fieldFull}>
                    <label className={styles.label}>Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={address.fullName}
                      onChange={handleAddressChange}
                      className={styles.input}
                      placeholder="Enter your full name"
                      id="checkout-fullname"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={address.phone}
                      onChange={handleAddressChange}
                      className={styles.input}
                      placeholder="+91 XXXXX XXXXX"
                      id="checkout-phone"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={address.pincode}
                      onChange={handleAddressChange}
                      className={styles.input}
                      placeholder="6-digit pincode"
                      id="checkout-pincode"
                    />
                  </div>
                  <div className={styles.fieldFull}>
                    <label className={styles.label}>Address *</label>
                    <textarea
                      name="addressLine"
                      value={address.addressLine}
                      onChange={handleAddressChange}
                      className={styles.textarea}
                      placeholder="House No., Building, Street, Area"
                      rows={3}
                      id="checkout-address"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      className={styles.input}
                      placeholder="City"
                      id="checkout-city"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>State *</label>
                    <select
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      className={styles.select}
                      id="checkout-state"
                    >
                      <option value="">Select State</option>
                      {['Andhra Pradesh','Bihar','Delhi','Gujarat','Karnataka',
                        'Kerala','Madhya Pradesh','Maharashtra','Punjab',
                        'Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh',
                        'West Bengal'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Landmark</label>
                    <input
                      type="text"
                      name="landmark"
                      value={address.landmark}
                      onChange={handleAddressChange}
                      className={styles.input}
                      placeholder="Near temple, school etc."
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Address Type</label>
                    <div className={styles.radioGroup}>
                      {['home', 'work'].map(t => (
                        <label key={t} className={styles.radioLabel}>
                          <input
                            type="radio"
                            name="addressType"
                            value={t}
                            checked={address.addressType === t}
                            onChange={handleAddressChange}
                            className={styles.radio}
                          />
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button className="btn btn-primary btn-lg" onClick={() => setStep(2)} id="proceed-payment-btn">
                    Continue to Payment <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>
                  <CreditCard size={20} /> Payment Method
                </h2>

                <div className={styles.paymentOptions}>
                  {[
                    { id: 'upi', label: 'UPI / Google Pay / PhonePe', desc: 'Pay securely via any UPI app', icon: '📱' },
                    { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: '💳' },
                    { id: 'netbanking', label: 'Net Banking', desc: 'All major banks supported', icon: '🏦' },
                    { id: 'wallet', label: 'Wallets', desc: 'Paytm, Amazon Pay, Mobikwik', icon: '👛' },
                    { id: 'cod', label: 'Cash on Delivery', desc: '₹50 COD charge applicable', icon: '💰' },
                  ].map(pm => (
                    <label
                      key={pm.id}
                      className={`${styles.paymentCard} ${paymentMethod === pm.id ? styles.paymentActive : ''}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={pm.id}
                        checked={paymentMethod === pm.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className={styles.radio}
                      />
                      <span className={styles.paymentIcon}>{pm.icon}</span>
                      <div>
                        <div className={styles.paymentLabel}>{pm.label}</div>
                        <div className={styles.paymentDesc}>{pm.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className={styles.cardActions}>
                  <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
                  <button className="btn btn-primary btn-lg" onClick={() => setStep(3)} id="review-order-btn">
                    Review Order <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>
                  <Check size={20} /> Review Your Order
                </h2>

                {/* Address Summary */}
                <div className={styles.reviewBlock}>
                  <h4 className={styles.reviewLabel}>Delivering to:</h4>
                  <p className={styles.reviewText}>
                    <strong>{address.fullName || 'Your Name'}</strong><br />
                    {address.addressLine || '123, Example Street'}<br />
                    {address.city || 'City'}, {address.state || 'State'} - {address.pincode || '000000'}<br />
                    Phone: {address.phone || '+91 XXXXX XXXXX'}
                  </p>
                  <button className={styles.editBtn} onClick={() => setStep(1)}>Edit</button>
                </div>

                {/* Payment Summary */}
                <div className={styles.reviewBlock}>
                  <h4 className={styles.reviewLabel}>Payment via:</h4>
                  <p className={styles.reviewText}>
                    {paymentMethod === 'upi' && '📱 UPI / Google Pay / PhonePe'}
                    {paymentMethod === 'card' && '💳 Credit / Debit Card'}
                    {paymentMethod === 'netbanking' && '🏦 Net Banking'}
                    {paymentMethod === 'wallet' && '👛 Wallet'}
                    {paymentMethod === 'cod' && '💰 Cash on Delivery'}
                  </p>
                  <button className={styles.editBtn} onClick={() => setStep(2)}>Edit</button>
                </div>

                {/* Items */}
                <div className={styles.reviewItems}>
                  <h4 className={styles.reviewLabel}>Items ({cartItems.length}):</h4>
                  {cartItems.map(item => (
                    <div key={item.id} className={styles.reviewItem}>
                      <div className={styles.reviewItemImage}>
                        <Image src={item.image} alt={item.name} width={60} height={80} style={{ objectFit: 'cover', borderRadius: '8px' }} />
                      </div>
                      <div className={styles.reviewItemInfo}>
                        <p className={styles.reviewItemName}>{item.name}</p>
                        <p className={styles.reviewItemMeta}>{item.fabric} • Qty: {item.quantity}</p>
                      </div>
                      <p className={styles.reviewItemPrice}>{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className={styles.cardActions}>
                  <button className="btn btn-ghost" onClick={() => setStep(2)} disabled={isProcessing}>Back</button>
                  <button className="btn btn-primary btn-lg" id="place-order-btn" onClick={handlePayment} disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : `Place Order — ${formatPrice(total)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right — Order Summary */}
          <aside className={styles.summary}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>

              {/* Cart Items */}
              <div className={styles.summaryItems}>
                {cartItems.map(item => (
                  <div key={item.id} className={styles.summaryItem}>
                    <div className={styles.summaryItemImage}>
                      <Image src={item.image} alt={item.name} width={52} height={68} style={{ objectFit: 'cover', borderRadius: '6px' }} />
                    </div>
                    <div className={styles.summaryItemInfo}>
                      <p className={styles.summaryItemName}>{item.name}</p>
                      <div className={styles.summaryItemQty}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}><Minus size={12} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={12} /></button>
                      </div>
                    </div>
                    <div className={styles.summaryItemRight}>
                      <p className={styles.summaryItemPrice}>{formatPrice(item.price * item.quantity)}</p>
                      <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className={styles.pricingBlock}>
                <div className={styles.pricingRow}>
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className={styles.pricingRow}>
                  <span>Shipping</span>
                  <span className={shipping === 0 ? styles.freeShipping : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                {codCharge > 0 && (
                  <div className={styles.pricingRow}>
                    <span>COD Charge</span>
                    <span>{formatPrice(codCharge)}</span>
                  </div>
                )}
                <div className={`${styles.pricingRow} ${styles.pricingTotal}`}>
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {subtotal < 2999 && (
                <p className={styles.freeShipMsg}>
                  Add {formatPrice(2999 - subtotal)} more for <strong>FREE shipping!</strong>
                </p>
              )}

              {/* Trust */}
              <div className={styles.trustSection}>
                <div className={styles.trustRow}><Shield size={14} /> <span>100% Secure Payment</span></div>
                <div className={styles.trustRow}><Truck size={14} /> <span>5-7 Days Delivery</span></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
