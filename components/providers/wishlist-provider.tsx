"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import type { WishlistItemData } from "@/types";
import { toast } from "sonner";

interface WishlistContextType {
  items: WishlistItemData[];
  itemCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (item: WishlistItemData) => void;
  removeFromWishlist: (productId: string, silent?: boolean) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "varah_wishlist_v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItemData[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to load wishlist from localStorage", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to save wishlist to localStorage", e);
    }
  }, [items, isHydrated]);

  const itemCount = useMemo(() => items.length, [items]);

  const isInWishlist = (productId: string) => {
    return items.some((i) => i.productId === productId);
  };

  const toggleWishlist = (item: WishlistItemData) => {
    const exists = items.some((i) => i.productId === item.productId);
    if (exists) {
      setItems((prev) => prev.filter((i) => i.productId !== item.productId));
      toast.info("Removed from wishlist", {
        id: `wishlist-${item.productId}`,
        description: item.name,
      });
    } else {
      setItems((prev) => [...prev, item]);
      toast.success("Saved to wishlist ❤️", {
        id: `wishlist-${item.productId}`,
        description: item.name,
      });
    }
  };

  const removeFromWishlist = (productId: string, silent = false) => {
    const itemToRemove = items.find((i) => i.productId === productId);
    setItems((prev) => prev.filter((i) => i.productId !== productId));
    if (itemToRemove && !silent) {
      toast.info("Removed from wishlist", {
        id: `wishlist-${productId}`,
        description: itemToRemove.name,
      });
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
