'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, ShoppingBag, User, Menu, X, Heart, Sun, Moon } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useTheme } from '@/context/ThemeContext';
import { megaMenuData, navTabs, trustBadges } from '@/data/categories';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isSellerRoute = pathname?.startsWith('/seller');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const megaRef = useRef(null);
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  // Re-check login status on every route change so the navbar updates instantly
  const checkLoginStatus = () => {
    const userStr = localStorage.getItem('varah_user');
    setIsLoggedIn(!!userStr);
    if (userStr) {
      try { setUserRole(JSON.parse(userStr).role); } catch { setUserRole(null); }
    } else {
      setUserRole(null);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, [pathname]);

  // Close mega menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (megaRef.current && !megaRef.current.contains(e.target)) {
        setActiveMega(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMegaHover = (slug) => {
    // Find the mega menu data for this tab
    const megaData = megaMenuData.filter(cat => {
      if (slug === 'sarees') return cat.id === 'sarees';
      if (slug === 'print-sarees') return cat.id === 'print-sarees';
      if (slug === 'bourk-sarees') return cat.id === 'bourk-sarees';
      if (slug === 'lehengas') return cat.id === 'lehengas';
      if (slug === 'kurtis') return ['kurtis', 'kurta-sets', 'suits', 'dupatta'].includes(cat.id);
      return false;
    });
    if (megaData.length > 0) {
      setActiveMega(slug);
    }
  };

  const getMegaColumns = (slug) => {
    if (slug === 'sarees') return megaMenuData.filter(c => ['sarees', 'blouses', 'dupatta'].includes(c.id));
    if (slug === 'print-sarees') return megaMenuData.filter(c => ['print-sarees', 'blouses', 'dupatta'].includes(c.id));
    if (slug === 'bourk-sarees') return megaMenuData.filter(c => ['bourk-sarees', 'blouses', 'dupatta'].includes(c.id));
    if (slug === 'lehengas') return megaMenuData.filter(c => ['lehengas', 'gowns', 'ethnic'].includes(c.id));
    if (slug === 'kurtis') return megaMenuData.filter(c => ['kurtis', 'kurta-sets', 'suits', 'dupatta'].includes(c.id));
    return [];
  };

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`} id="main-nav">
        {/* Top Bar */}
        <div className={styles.topBar}>
          <div className={`container ${styles.topBarInner}`}>
            {/* Mobile Toggle */}
            <button
              className={styles.mobileToggle}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link href="/" className={styles.logo} id="logo-link">
              <span className={styles.logoIcon}>𝕍</span>
              <span className={styles.logoText}>VARAH</span>
            </Link>

            {/* Search Bar */}
            <div className={styles.searchBarDesktop}>
              <Search size={18} className={styles.searchBarIcon} />
              <input
                type="text"
                placeholder="Try Saree, Lehenga or Search by Product Code"
                className={styles.searchBarInput}
                id="search-input"
              />
            </div>

            {/* Actions */}
            <div className={styles.navActions}>
              {/* Theme Toggle */}
              <button
                className={styles.actionBtn}
                onClick={toggleTheme}
                aria-label="Toggle theme"
                id="theme-toggle-btn"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <Link href="/wishlist" className={styles.actionBtn} aria-label="Wishlist" id="nav-wishlist-btn">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className={styles.cartBadge}>{wishlistCount}</span>
                )}
              </Link>

              <button
                className={styles.actionBtn}
                onClick={() => setIsCartOpen(true)}
                aria-label="Shopping Cart"
                id="nav-cart-btn"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className={styles.cartBadge}>{totalItems}</span>
                )}
              </button>

              <Link href={isLoggedIn ? (userRole === 'SELLER' ? "/seller/dashboard" : "/account") : "/auth"} className={styles.actionBtn} id="nav-account-btn">
                <User size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Category Tabs Bar - Hidden on Seller routes */}
        {!isSellerRoute && (
          <>
            <div className={styles.categoryBar} ref={megaRef}>
              <div className={`container ${styles.categoryBarInner}`}>
            {navTabs.map(tab => (
              <div
                key={tab.slug}
                className={styles.categoryTabWrap}
                onMouseEnter={() => tab.hasMega ? handleMegaHover(tab.slug) : setActiveMega(null)}
              >
                <Link
                  href={`/products?category=${tab.slug}`}
                  className={`${styles.categoryTab} ${tab.highlight ? styles.categoryTabHighlight : ''} ${activeMega === tab.slug ? styles.categoryTabActive : ''}`}
                  id={`nav-tab-${tab.slug}`}
                >
                  {tab.label}
                </Link>
              </div>
            ))}

            <Link href="/sellers" className={styles.categoryTab} id="nav-tab-artisans">
              Our Artisans
            </Link>

            {userRole === 'SELLER' ? (
              <Link href="/seller/dashboard" className={`${styles.categoryTab} ${styles.sellerTab}`} id="nav-tab-seller">
                Seller Dashboard
              </Link>
            ) : (
              <Link href="/seller/register" className={`${styles.categoryTab} ${styles.sellerTab}`} id="nav-tab-seller">
                Become a Seller
              </Link>
            )}

            {/* Mega Menu Dropdown */}
            {activeMega && (
              <div
                className={styles.megaMenu}
                onMouseLeave={() => setActiveMega(null)}
                id="mega-menu"
              >
                <div className={styles.megaColumns}>
                  {getMegaColumns(activeMega).map(column => (
                    <div key={column.id} className={styles.megaColumn}>
                      <h4 className={styles.megaColumnTitle}>
                        <Link href={`/products?category=${column.slug}`}>
                          {column.label}
                        </Link>
                      </h4>
                      <ul className={styles.megaList}>
                        {column.subcategories.map(sub => (
                          <li key={sub.slug}>
                            <Link
                              href={`/products?subcategory=${sub.slug}`}
                              className={`${styles.megaLink} ${sub.highlight ? styles.megaLinkHighlight : ''}`}
                              onClick={() => setActiveMega(null)}
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trust Bar */}
        <div className={styles.trustBar}>
          <div className={`container ${styles.trustBarInner}`}>
            {trustBadges.map((badge, i) => (
              <div key={i} className={styles.trustItem}>
                <span className={styles.trustIcon}>{badge.icon}</span>
                <span className={styles.trustText}>{badge.text}</span>
              </div>
            ))}
            </div>
          </div>
          </>
        )}
      </nav>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
        {/* Mobile Search */}
        <div className={styles.mobileSearch}>
          <Search size={16} />
          <input type="text" placeholder="Search products..." className={styles.mobileSearchInput} />
        </div>

        <div className={styles.mobileLinks}>
          {megaMenuData.map(cat => (
            <div key={cat.id} className={styles.mobileCategory}>
              <Link
                href={`/products?category=${cat.slug}`}
                className={styles.mobileCategoryTitle}
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.label}
              </Link>
              <div className={styles.mobileSubs}>
                {cat.subcategories.slice(0, 4).map(sub => (
                  <Link
                    key={sub.slug}
                    href={`/products?subcategory=${sub.slug}`}
                    className={styles.mobileSubLink}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className={styles.mobileDivider} />
          <Link href="/sellers" className={styles.mobileCategoryTitle} onClick={() => setMobileMenuOpen(false)}>
            Our Artisans
          </Link>
          <Link href="/seller/register" className={`${styles.mobileCategoryTitle} ${styles.mobileSeller}`} onClick={() => setMobileMenuOpen(false)}>
            Become a Seller
          </Link>

          {/* Mobile Theme Toggle */}
          <button className={styles.mobileThemeBtn} onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={styles.overlay} onClick={() => setMobileMenuOpen(false)} />
      )}
    </>
  );
}
