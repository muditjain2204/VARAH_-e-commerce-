'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Star, Eye, BadgeCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, index = 0 }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const liked = isWishlisted(product.id);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className={styles.card}
      style={{ animationDelay: `${index * 0.08}s` }}
      id={`product-card-${product.id}`}
    >
      {/* Image */}
      <div className={styles.imageWrap}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className={`${styles.image} ${imageLoaded ? styles.loaded : ''}`}
          onLoad={() => setImageLoaded(true)}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />

        {/* Badges */}
        <div className={styles.badges}>
          {product.discount > 0 && (
            <span className={styles.discountBadge}>-{product.discount}%</span>
          )}
          {product.tags?.includes('bestseller') && (
            <span className={styles.bestsellerBadge}>Bestseller</span>
          )}
          {product.tags?.includes('handwoven') && (
            <span className={styles.artisanBadge}>Handwoven</span>
          )}
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <button
            className={`${styles.quickBtn} ${liked ? styles.liked : ''}`}
            onClick={handleLike}
            aria-label="Add to wishlist"
          >
            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
          </button>
          <button
            className={styles.quickBtn}
            aria-label="Quick view"
          >
            <Eye size={18} />
          </button>
        </div>

        {/* Add to Cart Overlay */}
        <div className={styles.cartOverlay}>
          <button
            className={styles.addToCartBtn}
            onClick={handleAddToCart}
            id={`add-to-cart-${product.id}`}
          >
            <ShoppingBag size={16} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Details */}
      <div className={styles.details}>
        {/* Seller */}
        <div className={styles.sellerRow}>
          <span className={styles.sellerName}>
            {product.seller?.verified && <BadgeCheck size={12} />}
            {product.seller?.name}
          </span>
        </div>

        {/* Name */}
        <h3 className={styles.name}>{product.name}</h3>

        {/* Meta */}
        <p className={styles.meta}>{product.fabric} • {product.work}</p>

        {/* Rating */}
        <div className={styles.ratingRow}>
          <div className={styles.stars}>
            <Star size={13} fill="currentColor" />
            <span>{product.rating}</span>
          </div>
          <span className={styles.reviewCount}>({product.reviews})</span>
        </div>

        {/* Price */}
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
