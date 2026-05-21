'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Truck, RefreshCcw, BadgeCheck, Star, MapPin, Store } from 'lucide-react';
import ProductCard from '@/components/ProductCard/ProductCard';
import { categories, sellers } from '@/data/products'; // Keep static categories/sellers for now
import styles from './page.module.css';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/products?limit=8')
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!data || !data.products || !Array.isArray(data.products)) {
          console.warn("API returned unexpected shape:", data);
          setApiError(true);
          setLoading(false);
          return;
        }
        
        const mappedProducts = data.products.map(p => ({
          ...p,
          image: p.images?.[0] || '/images/products/saree-1.png',
          seller: {
            ...p.seller,
            name: p.seller?.shopName || 'VARAH Artisan',
            verified: true
          },
          reviews: p.reviewCount || 0
        }));
        setFeaturedProducts(mappedProducts);
        setApiError(false);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        setApiError(true);
        setLoading(false);
      });
  }, []);

  const topSellers = sellers.slice(0, 3);

  return (
    <main>
      {/* ===== Hero Section ===== */}
      <section className={styles.heroSection} id="hero-section">
        <div className={styles.heroBg}>
          <Image
            src="/images/banners/hero.png"
            alt="VARAH - Premium Traditional Wear"
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
        </div>

        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroLeft}>
            <div className={styles.heroBadge}>
              <Sparkles size={14} />
              India&apos;s Finest Traditional Wear
            </div>
            <h1 className={styles.heroTitle}>
              Discover the Art of<br />
              <span>Timeless Elegance</span>
            </h1>
            <p className={styles.heroDesc}>
              Handcrafted sarees, lehengas & traditional wear from master artisans
              across India — delivered to your doorstep with love.
            </p>
            <div className={styles.heroActions}>
              <Link href="/products" className="btn btn-primary btn-lg" id="hero-shop-btn">
                Explore Collection
                <ArrowRight size={18} />
              </Link>
              <Link href="/sellers" className="btn btn-secondary btn-lg" id="hero-artisans-btn">
                Meet Our Artisans
              </Link>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>500+</span>
                <span className={styles.statLabel}>Artisan Sellers</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>10K+</span>
                <span className={styles.statLabel}>Products</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>50K+</span>
                <span className={styles.statLabel}>Happy Customers</span>
              </div>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.heroImageWrap}>
              <Image
                src="/images/products/saree-1.png"
                alt="Featured Traditional Wear"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            <div className={styles.heroFloatCard}>
              <div className={styles.floatTitle}>🔥 Trending Now</div>
              <div className={styles.floatSub}>Banarasi Silk Collection</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Categories Section ===== */}
      <section className={styles.categoriesSection} id="categories-section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="section-title">Shop by <span>Category</span></h2>
            <p className="section-subtitle" style={{ margin: '0.5rem auto 0' }}>
              Explore our curated collections of India&apos;s finest traditional wear
            </p>
            <div className="divider divider-center" />
          </div>

          <div className={styles.categoriesGrid}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={styles.categoryCard}
                id={`category-${cat.id}`}
              >
                <div className={styles.categoryImageWrap}>
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className={styles.categoryImage}
                  />
                </div>
                <div className={styles.categoryInfo}>
                  <h3 className={styles.categoryName}>{cat.name}</h3>
                  <p className={styles.categoryCount}>{cat.count}+ Products</p>
                  <div className={styles.categoryArrow}>
                    Explore <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Featured Products Section ===== */}
      <section className={styles.featuredSection} id="featured-products">
        <div className="container">
          <div className={styles.sectionHeaderRow}>
            <div>
              <h2 className="section-title">Featured <span>Products</span></h2>
              <p className="section-subtitle">Handpicked treasures from our finest artisans</p>
            </div>
            <Link href="/products" className="btn btn-secondary" id="view-all-products-btn">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.productsGrid}>
            {loading ? (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading products...</p>
            ) : apiError ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '15px' }}>Could not load products right now. The server may be starting up.</p>
                <button className="btn btn-outline" onClick={() => window.location.reload()}>Retry</button>
              </div>
            ) : featuredProducts.length === 0 ? (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No products available yet.</p>
            ) : (
              featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* ===== USP Section ===== */}
      <section className={styles.uspSection} id="usp-section">
        <div className="container">
          <div className={styles.uspGrid}>
            <div className={styles.uspCard}>
              <div className={styles.uspIcon}>
                <Shield size={24} />
              </div>
              <h3 className={styles.uspTitle}>Authenticity Guaranteed</h3>
              <p className={styles.uspDesc}>Every product verified for quality and authenticity by our expert team</p>
            </div>
            <div className={styles.uspCard}>
              <div className={styles.uspIcon}>
                <Truck size={24} />
              </div>
              <h3 className={styles.uspTitle}>Pan-India Delivery</h3>
              <p className={styles.uspDesc}>Free shipping on orders above ₹2,999. Delivered with care in 5-7 days</p>
            </div>
            <div className={styles.uspCard}>
              <div className={styles.uspIcon}>
                <RefreshCcw size={24} />
              </div>
              <h3 className={styles.uspTitle}>Easy Returns</h3>
              <p className={styles.uspDesc}>7-day hassle-free return policy. No questions asked on unstitched items</p>
            </div>
            <div className={styles.uspCard}>
              <div className={styles.uspIcon}>
                <BadgeCheck size={24} />
              </div>
              <h3 className={styles.uspTitle}>Verified Sellers</h3>
              <p className={styles.uspDesc}>Every artisan and seller is KYC verified with quality certification</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Artisans Section ===== */}
      <section className={styles.artisansSection} id="artisans-section">
        <div className="container">
          <div className={styles.sectionHeaderRow}>
            <div>
              <h2 className="section-title">Our <span>Artisans</span></h2>
              <p className="section-subtitle">Meet the master craftspeople behind every creation</p>
            </div>
            <Link href="/sellers" className="btn btn-secondary" id="view-all-sellers-btn">
              View All Artisans <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.artisansGrid}>
            {topSellers.map((seller) => (
              <div key={seller.id} className={styles.artisanCard} id={`artisan-${seller.id}`}>
                <div className={styles.artisanHeader}>
                  <div className={styles.artisanAvatar}>
                    <Image
                      src={seller.image}
                      alt={seller.name}
                      width={52}
                      height={52}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <h4 className={styles.artisanName}>
                      {seller.name}
                      {seller.verified && <BadgeCheck size={14} />}
                    </h4>
                    <p className={styles.artisanLocation}>
                      <MapPin size={12} /> {seller.location}
                    </p>
                  </div>
                </div>
                <div className={styles.artisanSpeciality}>
                  <Store size={12} style={{ marginRight: '0.35rem' }} />
                  {seller.speciality}
                </div>
                <p className={styles.artisanDesc}>{seller.description}</p>
                <div className={styles.artisanStats}>
                  <div className={styles.artisanStat}>
                    <span className={styles.artisanStatValue}>{seller.totalProducts}</span>
                    <span className={styles.artisanStatLabel}>Products</span>
                  </div>
                  <div className={styles.artisanStat}>
                    <span className={styles.artisanStatValue}>{seller.totalSales.toLocaleString()}</span>
                    <span className={styles.artisanStatLabel}>Sales</span>
                  </div>
                  <div className={styles.artisanStat}>
                    <span className={styles.artisanStatValue}>
                      <Star size={13} fill="currentColor" style={{ color: 'var(--gold-400)', verticalAlign: 'middle' }} /> {seller.rating}
                    </span>
                    <span className={styles.artisanStatLabel}>Rating</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className={styles.ctaSection} id="cta-section">
        <div className="container">
          <div className={styles.ctaInner}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>
                Are You an <span className="gold-text">Artisan or Seller?</span>
              </h2>
              <p className={styles.ctaDesc}>
                Join VARAH&apos;s marketplace and reach thousands of customers.
                Sell your handcrafted creations, set your own prices, and earn up to 85% on every sale.
              </p>
              <div className={styles.ctaActions}>
                <Link href="/seller/register" className="btn btn-primary btn-lg" id="become-seller-btn">
                  Start Selling Today
                  <ArrowRight size={18} />
                </Link>
                <Link href="/seller/learn-more" className="btn btn-ghost btn-lg" id="learn-more-seller-btn">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
