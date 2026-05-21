'use client';

import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    totalSavings,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <div className={`${styles.drawer} ${isCartOpen ? styles.open : ''}`} id="cart-drawer">
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <ShoppingBag size={20} />
            <h2>Your Cart</h2>
            <span className={styles.itemCount}>{totalItems} items</span>
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            id="close-cart-btn"
          >
            <X size={22} />
          </button>
        </div>

        <div className={styles.body}>
          {cartItems.length === 0 ? (
            <div className={styles.emptyCart}>
              <div className={styles.emptyIcon}>
                <ShoppingBag size={48} />
              </div>
              <h3>Your cart is empty</h3>
              <p>Discover our exquisite collection of traditional wear</p>
              <button
                className="btn btn-primary"
                onClick={() => setIsCartOpen(false)}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className={styles.cartItems}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem} id={`cart-item-${item.id}`}>
                  <div className={styles.itemImage}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={100}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className={styles.itemDetails}>
                    <h4 className={styles.itemName}>{item.name}</h4>
                    <p className={styles.itemMeta}>{item.fabric} • {item.color}</p>
                    <div className={styles.itemBottom}>
                      <div className={styles.quantityControl}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className={styles.footer}>
            {totalSavings > 0 && (
              <div className={styles.savingsBanner}>
                🎉 You're saving {formatPrice(totalSavings)} on this order!
              </div>
            )}
            <div className={styles.subtotal}>
              <span>Subtotal</span>
              <span className={styles.subtotalPrice}>{formatPrice(totalPrice)}</span>
            </div>
            <p className={styles.shippingNote}>Shipping calculated at checkout</p>
            <Link
              href="/checkout"
              className={`btn btn-primary btn-lg ${styles.checkoutBtn}`}
              onClick={() => setIsCartOpen(false)}
              id="checkout-btn"
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>

      {/* Overlay */}
      {isCartOpen && (
        <div className={styles.overlay} onClick={() => setIsCartOpen(false)} />
      )}
    </>
  );
}
