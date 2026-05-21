'use client';

import Link from 'next/link';
import { Heart, ArrowRight, Trash2 } from 'lucide-react';
import ProductCard from '@/components/ProductCard/ProductCard';
import { useWishlist } from '@/context/WishlistContext';
import styles from './wishlist.module.css';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              <Heart size={28} className={styles.titleIcon} />
              My Wishlist
            </h1>
            <p className={styles.subtitle}>
              {wishlistItems.length > 0
                ? `${wishlistItems.length} item${wishlistItems.length > 1 ? 's' : ''} saved`
                : 'Your wishlist is empty'
              }
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <Link href="/products" className="btn btn-secondary">
              Continue Shopping <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>💝</span>
            <h2>Save Items You Love</h2>
            <p>Tap the heart icon on any product to add it to your wishlist</p>
            <Link href="/products" className="btn btn-primary btn-lg">
              Browse Products <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {wishlistItems.map((product, index) => (
              <div key={product.id} className={styles.cardWrap}>
                <ProductCard product={product} index={index} />
                <button
                  className={styles.removeBtn}
                  onClick={() => removeFromWishlist(product.id)}
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
