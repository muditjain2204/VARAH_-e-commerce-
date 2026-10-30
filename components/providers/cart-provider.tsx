"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import type { CartItemData, AppliedCoupon } from "@/types";
import { FREE_SHIPPING_THRESHOLD, DEFAULT_SHIPPING_CHARGE, MAX_CART_QUANTITY } from "@/constants";
import { applyCouponAction } from "@/actions/coupon.actions";
import { toast } from "sonner";

interface CartContextType {
  items: CartItemData[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  freeShippingRemaining: number;
  freeShippingProgress: number;
  appliedCoupon: AppliedCoupon | null;
  isCouponLoading: boolean;
  addItem: (item: Omit<CartItemData, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "varah_cart_v1";
const COUPON_STORAGE_KEY = "varah_coupon_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemData[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
    } catch (e) {
      console.warn("Failed to load cart from localStorage", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to save cart to localStorage", e);
    }
  }, [items, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.warn("Failed to save coupon to localStorage", e);
    }
  }, [appliedCoupon, isHydrated]);

  const itemCount = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items]
  );

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === "PERCENTAGE") {
      const rawDiscount = (subtotal * appliedCoupon.discountValue) / 100;
      return Math.round(Math.min(rawDiscount, appliedCoupon.discountAmount || rawDiscount));
    }
    return Math.min(appliedCoupon.discountAmount, subtotal);
  }, [subtotal, appliedCoupon]);

  const shipping = useMemo(() => {
    if (items.length === 0) return 0;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_CHARGE;
  }, [subtotal, items.length]);

  const total = useMemo(
    () => Math.max(0, subtotal - discount + shipping),
    [subtotal, discount, shipping]
  );

  const freeShippingRemaining = useMemo(
    () => Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
    [subtotal]
  );

  const freeShippingProgress = useMemo(
    () => Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)),
    [subtotal]
  );

  const addItem = (item: Omit<CartItemData, "quantity"> & { quantity?: number }) => {
    const qtyToAdd = item.quantity || 1;
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(
          updated[existingIndex].quantity + qtyToAdd,
          item.maxStock || MAX_CART_QUANTITY
        );
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        toast.success(`Updated quantity to ${newQty}`, {
          description: item.name,
        });
        return updated;
      } else {
        toast.success("Added to shopping bag", {
          description: item.name,
        });
        return [...prev, { ...item, quantity: qtyToAdd }];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const itemToRemove = prev.find((i) => i.id === id);
      if (itemToRemove) {
        toast.info("Item removed from bag", {
          description: itemToRemove.name,
        });
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const validQty = Math.min(quantity, item.maxStock || MAX_CART_QUANTITY);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = async (code: string) => {
    setIsCouponLoading(true);
    try {
      const res = await applyCouponAction(code, subtotal);
      if (res.success && res.data) {
        setAppliedCoupon(res.data);
        toast.success(`Coupon ${res.data.code} applied!`, {
          description: `Saved ₹${res.data.discountAmount}`,
        });
        return { success: true };
      } else {
        toast.error(res.error || "Failed to apply coupon");
        return { success: false, error: res.error };
      }
    } catch {
      toast.error("Error applying coupon");
      return { success: false, error: "Network error" };
    } finally {
      setIsCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.info("Coupon removed");
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount,
        shipping,
        total,
        freeShippingRemaining,
        freeShippingProgress,
        appliedCoupon,
        isCouponLoading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
