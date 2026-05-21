'use client';

import { useState, use, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User } from 'lucide-react';
import {
  Star, Heart, ShoppingBag, Minus, Plus, Truck, Shield,
  RefreshCcw, BadgeCheck, MapPin, ChevronRight, Share2
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './product.module.css';

export default function ProductPage({ params }) {
  const { slug } = use(params);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    // Fetch product details
    fetch(`http://localhost:5000/api/products/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error && data.product) {
          const p = data.product;
          const mappedProduct = {
            ...p,
            image: p.images?.[0] || '/images/products/saree-1.png',
            seller: {
              ...p.seller,
              name: p.seller?.shopName || 'VARAH Artisan',
              verified: true,
              location: p.seller?.city ? `${p.seller.city}, ${p.seller.state}` : 'India'
            },
            reviews: p.reviewCount || 0,
            inStock: p.stockCount > 0
          };
          setProduct(mappedProduct);
          
          // Fetch related products
          fetch(`http://localhost:5000/api/products?category=${p.category}&limit=5`)
            .then(res => res.json())
            .then(relData => {
              if (relData.error || !relData.products) return;
              const mappedRelated = relData.products
                .filter(rp => rp.id !== p.id)
                .slice(0, 4)
                .map(rp => ({
                  ...rp,
                  image: rp.images?.[0] || '/images/products/saree-1.png',
                  seller: {
                    ...rp.seller,
                    name: rp.seller?.shopName || 'VARAH Artisan',
                    verified: true
                  },
                  reviews: rp.reviewCount || 0
                }));
              setRelatedProducts(mappedRelated);
            });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch product:', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className={styles.notFound} style={{ minHeight: '100vh', paddingTop: '120px' }}>
        <div className="container">
          <h2>Loading product details...</h2>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.notFound}>
        <div className="container">
          <h1>Product not found</h1>
          <p>The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/products" className="btn btn-primary">Back to Products</Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsCartOpen(true);
  };

  return (
    <div className={styles.page}>
      {/* Breadcrumbs */}
      <div className={styles.breadcrumbs}>
        <div className="container">
          <Link href="/">Home</Link>
          <ChevronRight size={14} />
          <Link href="/products">Products</Link>
          <ChevronRight size={14} />
          <Link href={`/products?category=${product.category}`}>
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Link>
          <ChevronRight size={14} />
          <span>{product.name}</span>
        </div>
      </div>

      {/* Product Main */}
      <section className={styles.productMain}>
        <div className="container">
          <div className={styles.productGrid}>
            {/* Image Gallery */}
            <div className={styles.gallery}>
              <div className={styles.mainImage}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                  id="product-main-image"
                />
                {product.discount > 0 && (
                  <span className={styles.discountTag}>-{product.discount}% OFF</span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className={styles.info}>
              <h1 className={styles.productName} id="product-name">{product.name}</h1>

              {/* Price */}
              <div className={styles.priceBlock}>
                <span className={styles.currentPrice}>{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <>
                    <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
                    <span className={styles.savings}>
                      {product.discount}% off
                    </span>
                  </>
                )}
              </div>

              {/* Rating */}
              <div className={styles.ratingRow}>
                <div className={styles.stars}>
                  <span>{product.rating}</span>
                  <Star size={12} fill="currentColor" style={{ marginLeft: '4px' }} />
                </div>
                <span className={styles.reviewCount}>{product.reviews} Ratings</span>
              </div>

              <p className={styles.description}>{product.description}</p>

              {/* Product Highlights */}
              <div className={styles.highlightsBlock}>
                <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>Product Highlights</h3>
                <div className={styles.metaGrid}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Fabric</span>
                    <span className={styles.metaValue}>{product.fabric}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Color</span>
                    <span className={styles.metaValue}>{product.color}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Work</span>
                    <span className={styles.metaValue}>{product.work}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Occasion</span>
                    <span className={styles.metaValue}>{product.occasion}</span>
                  </div>
                </div>
              </div>

              {/* Sold By */}
              <div className={styles.soldByBlock}>
                <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>Sold By</h3>
                <div className={styles.soldByCard}>
                  <div className={styles.soldByHeader}>
                    <div className={styles.sellerAvatar}>
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className={styles.sellerName}>
                        {product.seller?.name}
                        {product.seller?.verified && <BadgeCheck size={14} color="#4CAF50" style={{ marginLeft: '4px' }} />}
                      </h4>
                      <p className={styles.sellerLocation}><MapPin size={12} /> {product.seller?.location}</p>
                    </div>
                    <Link href={`/sellers/${product.seller?.id}`} className="btn btn-outline" style={{ marginLeft: 'auto', padding: '6px 16px', fontSize: '13px' }}>
                      View Shop
                    </Link>
                  </div>
                    <div className={styles.sellerStats}>
                      <div className={styles.sellerStat}>
                        <strong>{product.seller?.rating?.toFixed(1) || '4.0'} <Star size={12} fill="currentColor" style={{ display: 'inline' }} /></strong>
                        <span>Ratings</span>
                      </div>
                      <div className={styles.sellerStat}>
                        <strong>{product.seller?.totalSales || 0}</strong>
                        <span>Total Sales</span>
                      </div>
                      <div className={styles.sellerStat}>
                        <strong>{product.seller?._count?.products || 0}</strong>
                        <span>Products</span>
                      </div>
                    </div>
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className={styles.actionsBlock}>
                <div className={styles.actionButtonsRow}>
                  <button
                    className={`btn btn-outline ${styles.addToCartBtn}`}
                    onClick={handleAddToCart}
                    id="add-to-cart-btn"
                  >
                    <ShoppingBag size={18} style={{ marginRight: '8px' }} />
                    Add to Cart
                  </button>

                  <button
                    className={`btn btn-primary ${styles.buyNowBtn}`}
                    onClick={(e) => {
                      handleAddToCart(e);
                      // In a real app, this would route directly to checkout
                    }}
                    id="buy-now-btn"
                  >
                    <ChevronRight size={18} style={{ marginRight: '8px' }} />
                    Buy Now
                  </button>
                  <button
                    className={`btn-icon ${styles.wishlistBtn} ${isLiked ? styles.liked : ''}`}
                    onClick={() => setIsLiked(!isLiked)}
                    aria-label="Wishlist"
                    id="wishlist-btn"
                  >
                    <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                  </button>
                  <button className={`btn-icon ${styles.shareBtn}`} aria-label="Share">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Stock Info */}
              <div className={styles.stockInfo}>
                {product.inStock ? (
                  <span className={styles.inStock}>
                    ✓ In Stock — {product.stockCount} left
                  </span>
                ) : (
                  <span className={styles.outOfStock}>✗ Out of Stock</span>
                )}
              </div>

              {/* Trust Badges */}
              <div className={styles.trustBadges}>
                <div className={styles.trustItem}>
                  <Truck size={16} />
                  <span>Free Delivery</span>
                </div>
                <div className={styles.trustItem}>
                  <Shield size={16} />
                  <span>Authentic</span>
                </div>
                <div className={styles.trustItem}>
                  <RefreshCcw size={16} />
                  <span>7-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className={styles.tabsSection}>
        <div className="container">
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'details' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Product Details
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'care' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('care')}
            >
              Care Instructions
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'shipping' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('shipping')}
            >
              Shipping & Returns
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'details' && (
              <div className={styles.detailsTab}>
                <p>{product.description}</p>
                <ul>
                  <li><strong>Fabric:</strong> {product.fabric}</li>
                  <li><strong>Work Type:</strong> {product.work}</li>
                  <li><strong>Color:</strong> {product.color}</li>
                  <li><strong>Occasion:</strong> {product.occasion}</li>
                  <li><strong>Weight:</strong> {product.weight}</li>
                </ul>
              </div>
            )}
            {activeTab === 'care' && (
              <div className={styles.careTab}>
                <p><strong>Wash Care:</strong> {product.washCare}</p>
                <ul>
                  <li>Store in a cool, dry place away from direct sunlight</li>
                  <li>Keep in a muslin cloth or cotton bag</li>
                  <li>Avoid folding on embroidery or zari work</li>
                  <li>Iron on low heat with a thin cloth on top</li>
                </ul>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className={styles.shippingTab}>
                <ul>
                  <li><strong>Free Shipping</strong> on orders above ₹2,999</li>
                  <li>Delivery within <strong>5-7 business days</strong></li>
                  <li><strong>7-day return policy</strong> for unstitched items</li>
                  <li>Custom/stitched items are <strong>non-returnable</strong></li>
                  <li>Cash on Delivery available (₹50 extra)</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className={styles.relatedSection}>
          <div className="container">
            <h2 className="section-title">You May Also <span>Like</span></h2>
            <div className="divider" style={{ marginTop: '0.5rem', marginBottom: '2rem' }} />
            <div className={styles.relatedGrid}>
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
