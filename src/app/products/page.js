'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutList, Search } from 'lucide-react';
import ProductCard from '@/components/ProductCard/ProductCard';
import { products as mockProducts, fabricFilters, occasionFilters, priceRanges } from '@/data/products';
import styles from './products.module.css';

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const subcategoryParam = searchParams.get('subcategory');
  const tagParam = searchParams.get('tag');
  const occasionParam = searchParams.get('occasion');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFabric, setSelectedFabric] = useState('All');
  const [selectedOccasion, setSelectedOccasion] = useState(occasionParam || 'All');
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [sortBy, setSortBy] = useState('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch products from API
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/products?limit=100')
      .then(res => res.json())
      .then(data => {
        if (!data || !data.products) {
          console.error("API returned invalid data:", data);
          setProducts([]);
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
        setProducts(mappedProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (categoryParam) {
      const categoryMap = {
        'sarees': 'sarees',
        'lehengas': 'lehengas',
        'traditional-wear': 'traditional',
      };
      const cat = categoryMap[categoryParam] || categoryParam;
      result = result.filter(p => p.category?.toLowerCase() === cat.toLowerCase());
    }

    // Subcategory filter
    if (subcategoryParam) {
      result = result.filter(p => p.subcategory?.toLowerCase() === subcategoryParam.toLowerCase() || p.subcategory?.toLowerCase().replace(/\s+/g, '-') === subcategoryParam.toLowerCase());
    }

    // Tag filter
    if (tagParam) {
      result = result.filter(p => p.tags?.includes(tagParam));
    }

    // Fabric filter
    if (selectedFabric !== 'All') {
      result = result.filter(p =>
        p.fabric.toLowerCase().includes(selectedFabric.toLowerCase())
      );
    }

    // Occasion filter
    if (selectedOccasion !== 'All') {
      result = result.filter(p => p.occasion === selectedOccasion);
    }

    // Price filter
    if (selectedPrice !== null) {
      const range = priceRanges[selectedPrice];
      result = result.filter(p => p.price >= range.min && p.price <= range.max);
    }

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.work.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        result.sort((a, b) => b.discount - a.discount);
        break;
      default:
        break;
    }

    return result;
  }, [products, categoryParam, subcategoryParam, tagParam, selectedFabric, selectedOccasion, selectedPrice, sortBy, searchQuery]);

  const pageTitle = subcategoryParam
    ? subcategoryParam.charAt(0).toUpperCase() + subcategoryParam.slice(1).replace(/-/g, ' ')
    : categoryParam
    ? categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1).replace(/-/g, ' ')
    : tagParam
    ? tagParam.charAt(0).toUpperCase() + tagParam.slice(1) + ' Collection'
    : 'All Products';

  const clearFilters = () => {
    setSelectedFabric('All');
    setSelectedOccasion('All');
    setSelectedPrice(null);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedFabric !== 'All' || selectedOccasion !== 'All' || selectedPrice !== null || searchQuery;

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>{pageTitle}</h1>
          <p className={styles.pageDesc}>
            {filteredProducts.length} products found
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* Sidebar Filters */}
          <aside className={`${styles.sidebar} ${filtersOpen ? styles.sidebarOpen : ''}`}>
            <div className={styles.sidebarHeader}>
              <h3 className={styles.sidebarTitle}>
                <SlidersHorizontal size={18} /> Filters
              </h3>
              {hasActiveFilters && (
                <button className={styles.clearBtn} onClick={clearFilters}>
                  Clear All
                </button>
              )}
              <button
                className={styles.closeSidebar}
                onClick={() => setFiltersOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Search */}
            <div className={styles.filterGroup}>
              <div className={styles.searchWrap}>
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                  id="product-search"
                />
              </div>
            </div>

            {/* Fabric Filter */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterTitle}>Fabric</h4>
              <div className={styles.filterChips}>
                {fabricFilters.map((fabric) => (
                  <button
                    key={fabric}
                    className={`${styles.chip} ${selectedFabric === fabric ? styles.chipActive : ''}`}
                    onClick={() => setSelectedFabric(fabric)}
                  >
                    {fabric}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion Filter */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterTitle}>Occasion</h4>
              <div className={styles.filterChips}>
                {occasionFilters.map((occasion) => (
                  <button
                    key={occasion}
                    className={`${styles.chip} ${selectedOccasion === occasion ? styles.chipActive : ''}`}
                    onClick={() => setSelectedOccasion(occasion)}
                  >
                    {occasion}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterTitle}>Price Range</h4>
              <div className={styles.priceOptions}>
                {priceRanges.map((range, idx) => (
                  <label key={idx} className={styles.priceOption}>
                    <input
                      type="radio"
                      name="price"
                      checked={selectedPrice === idx}
                      onChange={() => setSelectedPrice(selectedPrice === idx ? null : idx)}
                      className={styles.radio}
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Area */}
          <div className={styles.productsArea}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
              <button
                className={`btn btn-ghost ${styles.filterToggle}`}
                onClick={() => setFiltersOpen(true)}
              >
                <SlidersHorizontal size={16} /> Filters
              </button>

              <div className={styles.sortWrap}>
                <span className={styles.sortLabel}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={styles.sortSelect}
                  id="sort-select"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Biggest Discount</option>
                </select>
                <ChevronDown size={14} className={styles.sortIcon} />
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className={styles.productsGrid}>
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query</p>
                <button className="btn btn-secondary" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {filtersOpen && (
        <div className={styles.overlay} onClick={() => setFiltersOpen(false)} />
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', paddingTop: '120px' }} className="container"><p>Loading products...</p></div>}>
      <ProductsContent />
    </Suspense>
  );
}
