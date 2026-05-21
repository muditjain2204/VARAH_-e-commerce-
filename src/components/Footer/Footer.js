'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import styles from './Footer.module.css';

// Custom social icons since lucide-react doesn't ship brand icons
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733-16zM4 20l6.768-6.768M20 4l-6.768 6.768"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <path d="m10 15 5-3-5-3z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className={styles.footer} id="footer">
      {/* Newsletter Section */}
      <div className={styles.newsletter}>
        <div className="container">
          <div className={styles.newsletterInner}>
            <div className={styles.newsletterContent}>
              <h3 className={styles.newsletterTitle}>
                Join the <span className="gold-text">VARAH</span> Family
              </h3>
              <p className={styles.newsletterDesc}>
                Get exclusive access to new collections, artisan stories & special offers
              </p>
            </div>
            <div className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Enter your email address"
                className={styles.newsletterInput}
                id="newsletter-email"
              />
              <button className={`btn btn-primary ${styles.newsletterBtn}`} id="newsletter-subscribe-btn">
                Subscribe <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className={styles.main}>
        <div className="container">
          <div className={styles.grid}>
            {/* Brand Column */}
            <div className={styles.brandCol}>
              <Link href="/" className={styles.logo}>
                <span className={styles.logoIcon}>𝕍</span>
                <span className={styles.logoText}>VARAH</span>
              </Link>
              <p className={styles.brandDesc}>
                Celebrating India&apos;s rich textile heritage. Connecting master artisans
                with discerning buyers worldwide.
              </p>
              <div className={styles.socials}>
                <a href="#" className={styles.socialLink} aria-label="Instagram"><InstagramIcon /></a>
                <a href="#" className={styles.socialLink} aria-label="Facebook"><FacebookIcon /></a>
                <a href="#" className={styles.socialLink} aria-label="Twitter"><TwitterIcon /></a>
                <a href="#" className={styles.socialLink} aria-label="YouTube"><YoutubeIcon /></a>
              </div>
            </div>

            {/* Shop */}
            <div className={styles.linksCol}>
              <h4 className={styles.colTitle}>Shop</h4>
              <div className={styles.linksList}>
                <Link href="/products?category=sarees" className={styles.footerLink}>Sarees</Link>
                <Link href="/products?category=lehengas" className={styles.footerLink}>Lehengas</Link>
                <Link href="/products?category=traditional-wear" className={styles.footerLink}>Traditional Wear</Link>
                <Link href="/products?tag=bridal" className={styles.footerLink}>Bridal Collection</Link>
                <Link href="/products?occasion=Festival" className={styles.footerLink}>Festival Specials</Link>
                <Link href="/products" className={styles.footerLink}>All Products</Link>
              </div>
            </div>

            {/* Company */}
            <div className={styles.linksCol}>
              <h4 className={styles.colTitle}>Company</h4>
              <div className={styles.linksList}>
                <Link href="/about" className={styles.footerLink}>About VARAH</Link>
                <Link href="/sellers" className={styles.footerLink}>Our Artisans</Link>
                <Link href="/seller/register" className={styles.footerLink}>Become a Seller</Link>
                <Link href="/careers" className={styles.footerLink}>Careers</Link>
                <Link href="/blog" className={styles.footerLink}>Blog</Link>
              </div>
            </div>

            {/* Support */}
            <div className={styles.linksCol}>
              <h4 className={styles.colTitle}>Support</h4>
              <div className={styles.linksList}>
                <Link href="/help" className={styles.footerLink}>Help Center</Link>
                <Link href="/shipping" className={styles.footerLink}>Shipping & Returns</Link>
                <Link href="/size-guide" className={styles.footerLink}>Size Guide</Link>
                <Link href="/track-order" className={styles.footerLink}>Track Order</Link>
                <Link href="/contact" className={styles.footerLink}>Contact Us</Link>
              </div>
            </div>

            {/* Contact */}
            <div className={styles.linksCol}>
              <h4 className={styles.colTitle}>Contact</h4>
              <div className={styles.contactList}>
                <a href="mailto:hello@varah.in" className={styles.contactItem}>
                  <Mail size={15} />
                  hello@varah.in
                </a>
                <a href="tel:+911234567890" className={styles.contactItem}>
                  <Phone size={15} />
                  +91 12345 67890
                </a>
                <span className={styles.contactItem}>
                  <MapPin size={15} />
                  Mumbai, India
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p className={styles.copyright}>
              © 2026 VARAH. All rights reserved. Made with ♡ in India
            </p>
            <div className={styles.bottomLinks}>
              <Link href="/privacy" className={styles.bottomLink}>Privacy Policy</Link>
              <Link href="/terms" className={styles.bottomLink}>Terms of Service</Link>
              <Link href="/refund" className={styles.bottomLink}>Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
