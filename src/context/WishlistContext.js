'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('varah_wishlist');
      if (stored) setWishlistItems(JSON.parse(stored));
    } catch (e) { /* ignore */ }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('varah_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    setWishlistItems(prev => {
      if (prev.find(item => item.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
  };

  const isWishlisted = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const toggleWishlist = (product) => {
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isWishlisted,
      toggleWishlist,
      wishlistCount: wishlistItems.length,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
