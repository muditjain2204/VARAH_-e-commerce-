"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
  useUser,
  useClerk,
} from "@clerk/nextjs";
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  ChevronDown,
  User,
  Package,
  IndianRupee,
  Sliders,
  Sparkles,
  Ticket,
  MapPin,
  Gift,
  Bell,
  LogOut,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import {
  NAV_LINKS,
  SAREE_CATEGORIES,
  POPULAR_SAREE_ITEMS,
  PRICE_RANGES,
} from "@/constants";
import { useCart } from "@/components/providers/cart-provider";
import { useWishlist } from "@/components/providers/wishlist-provider";

export function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"sarees" | "popular">("sarees");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Dropdown states
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  // Custom price in top bar dropdown
  const [navbarMinPrice, setNavbarMinPrice] = useState("");
  const [navbarMaxPrice, setNavbarMaxPrice] = useState("");

  const categoriesRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const { itemCount: cartCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

  const { isSignedIn, user: clerkUser } = useUser();
  const { signOut } = useClerk();

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setIsCategoriesDropdownOpen(false);
      }
      if (
        priceRef.current &&
        !priceRef.current.contains(event.target as Node)
      ) {
        setIsPriceDropdownOpen(false);
      }
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setIsAccountDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleApplyNavbarPrice = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (navbarMinPrice) params.set("minPrice", String(Math.max(0, Number(navbarMinPrice))));
    if (navbarMaxPrice) params.set("maxPrice", String(Math.max(0, Number(navbarMaxPrice))));
    router.push(`/products?${params.toString()}`);
    setIsPriceDropdownOpen(false);
  };

  const handleNavbarPresetPrice = (min: number, max: number) => {
    const params = new URLSearchParams();
    if (min > 0) params.set("minPrice", String(min));
    if (max !== Infinity) params.set("maxPrice", String(max));
    router.push(`/products?${params.toString()}`);
    setIsPriceDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top banner */}
      <div className="bg-primary text-primary-foreground text-center text-xs py-1.5 px-4 font-medium tracking-wide">
        ✨ Free Shipping on orders above ₹1,999 | Authentic Sarees by{" "}
        <span className="font-bold">MAA LAXMI</span>
      </div>

      <nav className="w-full max-w-[1680px] mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between gap-2 lg:gap-3 xl:gap-4">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 -ml-2 text-foreground/70 hover:text-foreground transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 font-playfair text-xl sm:text-2xl font-bold tracking-tight text-foreground hover:text-primary transition-colors flex items-center gap-1.5 mr-1"
          >
            <span>MAA LAXMI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 flex-shrink-0">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-2 xl:px-3 py-1.5 text-xs xl:text-sm font-medium text-foreground/70 hover:text-foreground rounded-md hover:bg-accent transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}

            {/* Categories Mega Dropdown */}
            <div className="relative" ref={categoriesRef}>
              <button
                type="button"
                onClick={() => {
                  setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen);
                  setIsPriceDropdownOpen(false);
                }}
                className={`flex items-center gap-1 px-2 xl:px-3 py-1.5 text-xs xl:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  isCategoriesDropdownOpen
                    ? "bg-accent text-foreground"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent"
                }`}
              >
                <span>Categories</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 flex-shrink-0 ${
                    isCategoriesDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCategoriesDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-[480px] bg-popover text-popover-foreground border border-border rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in-50 zoom-in-95">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      Saree Collections
                    </span>
                    <Link
                      href="/products"
                      onClick={() => setIsCategoriesDropdownOpen(false)}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
                    >
                      View All →
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                    {SAREE_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={cat.href}
                        onClick={() => setIsCategoriesDropdownOpen(false)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                          cat.isSpecial
                            ? "text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 hover:bg-amber-500/20"
                            : "text-foreground/80 hover:text-primary hover:bg-accent"
                        }`}
                      >
                        <span>{cat.name}</span>
                        {cat.isSpecial && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-bold">
                            NEW
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Top Bar Custom Price Range Feature Dropdown */}
            <div className="relative" ref={priceRef}>
              <button
                type="button"
                onClick={() => {
                  setIsPriceDropdownOpen(!isPriceDropdownOpen);
                  setIsCategoriesDropdownOpen(false);
                }}
                className={`flex items-center gap-1 px-2 xl:px-3 py-1.5 text-xs xl:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  isPriceDropdownOpen
                    ? "bg-accent text-foreground"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent"
                }`}
              >
                <IndianRupee className="h-3.5 w-3.5 flex-shrink-0" />
                <span>Price Range</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 flex-shrink-0 ${
                    isPriceDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isPriceDropdownOpen && (
                <div className="absolute right-0 sm:left-0 top-full mt-2 w-72 bg-popover text-popover-foreground border border-border rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in-50 zoom-in-95">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-border">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Sliders className="h-3.5 w-3.5 text-primary" />
                      Filter by Price
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setNavbarMinPrice("");
                        setNavbarMaxPrice("");
                        router.push("/products");
                        setIsPriceDropdownOpen(false);
                      }}
                      className="text-[11px] text-muted-foreground hover:text-primary transition-colors font-medium"
                    >
                      Reset
                    </button>
                  </div>

                  {/* Custom Price Range Form */}
                  <form onSubmit={handleApplyNavbarPrice} className="space-y-2.5 mb-3 bg-accent/40 p-2.5 rounded-xl border border-border/60">
                    <span className="text-[11px] font-semibold text-foreground/80 block">
                      Custom Range (₹)
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₹</span>
                        <input
                          type="number"
                          min="0"
                          placeholder="Min"
                          value={navbarMinPrice}
                          onChange={(e) => setNavbarMinPrice(e.target.value)}
                          className="w-full h-8 pl-6 pr-1.5 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <span className="text-muted-foreground text-xs font-semibold">-</span>
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₹</span>
                        <input
                          type="number"
                          min="0"
                          placeholder="Max"
                          value={navbarMaxPrice}
                          onChange={(e) => setNavbarMaxPrice(e.target.value)}
                          className="w-full h-8 pl-6 pr-1.5 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full h-7 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Apply Custom Range
                    </button>
                  </form>

                  {/* Preset Buttons */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block px-1">
                      Quick Budgets
                    </span>
                    {PRICE_RANGES.map((range) => (
                      <button
                        key={range.label}
                        type="button"
                        onClick={() => handleNavbarPresetPrice(range.min, range.max)}
                        className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg text-foreground/80 hover:bg-accent hover:text-primary transition-colors flex items-center justify-between"
                      >
                        <span>{range.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right side: Search, Wishlist, Cart, Profile & Brown Auth Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-foreground/70 hover:text-foreground rounded-md hover:bg-accent transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="p-2 text-foreground/70 hover:text-foreground rounded-md hover:bg-accent transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 text-foreground/70 hover:text-foreground rounded-md hover:bg-accent transition-colors relative"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Store Admin Shortcut for Owner */}
            <Link
              href="/admin"
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-colors whitespace-nowrap"
              title="Store Admin Dashboard"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Admin</span>
            </Link>

            {/* Flipkart-Style Account Dropdown */}
            <div
              className="relative"
              ref={accountRef}
              onMouseEnter={() => setIsAccountDropdownOpen(true)}
              onMouseLeave={() => setIsAccountDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isAccountDropdownOpen
                    ? "bg-accent text-foreground ring-1 ring-border"
                    : "text-foreground/80 hover:text-foreground hover:bg-accent"
                }`}
                aria-expanded={isAccountDropdownOpen}
              >
                <User className="h-4 w-4" />
                <span>{isSignedIn && clerkUser ? (clerkUser.firstName || "Account") : "Account"}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    isAccountDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isAccountDropdownOpen && (
                <div className="absolute right-0 top-full pt-1.5 w-64 z-50 animate-in fade-in-50 zoom-in-95">
                  <div className="bg-popover text-popover-foreground border border-border rounded-2xl shadow-2xl overflow-hidden divide-y divide-border">
                    {/* Header */}
                    {isSignedIn && clerkUser ? (
                      <div className="px-4 py-3 bg-muted/40 flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="text-[11px] text-muted-foreground">Welcome back,</p>
                          <p className="text-xs font-bold text-foreground truncate">
                            {clerkUser.fullName || clerkUser.firstName || "Customer"}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {clerkUser.primaryEmailAddress?.emailAddress || ""}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 shrink-0">
                          Customer
                        </span>
                      </div>
                    ) : (
                      <div className="px-4 py-3 bg-muted/40">
                        <p className="text-xs font-bold text-foreground">Welcome to MAA LAXMI</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 mb-2.5">
                          To access your orders and account features
                        </p>
                        <div className="flex items-center gap-2">
                          <SignInButton mode="modal">
                            <button
                              type="button"
                              onClick={() => setIsAccountDropdownOpen(false)}
                              className="flex-1 py-1.5 px-3 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/90 transition-all text-center"
                            >
                              Sign In
                            </button>
                          </SignInButton>
                          <SignUpButton mode="modal">
                            <button
                              type="button"
                              onClick={() => setIsAccountDropdownOpen(false)}
                              className="flex-1 py-1.5 px-3 border border-border text-foreground hover:bg-accent text-xs font-semibold rounded-lg transition-all text-center"
                            >
                              Sign Up
                            </button>
                          </SignUpButton>
                        </div>
                      </div>
                    )}

                    {/* Flipkart Menu Items */}
                    <div className="py-1">
                      <Link
                        href="/account/profile"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-foreground hover:bg-accent hover:text-primary transition-colors"
                      >
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/account/orders"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-xs font-medium text-foreground hover:bg-accent hover:text-primary transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Package className="h-4 w-4 text-primary" />
                          <span className="font-bold text-primary">Orders</span>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </Link>

                      <Link
                        href="/account/coupons"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-foreground hover:bg-accent hover:text-primary transition-colors"
                      >
                        <Ticket className="h-4 w-4 text-muted-foreground" />
                        <span>Coupons</span>
                      </Link>

                      <Link
                        href="/account/addresses"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-foreground hover:bg-accent hover:text-primary transition-colors"
                      >
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>Saved Addresses</span>
                      </Link>

                      <Link
                        href="/account/wishlist"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-xs font-medium text-foreground hover:bg-accent hover:text-primary transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Heart className="h-4 w-4 text-muted-foreground" />
                          <span>Wishlist</span>
                        </div>
                        {wishlistCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-primary text-primary-foreground">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>

                      <Link
                        href="/account/gift-cards"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-foreground hover:bg-accent hover:text-primary transition-colors"
                      >
                        <Gift className="h-4 w-4 text-muted-foreground" />
                        <span>Gift Cards</span>
                      </Link>

                      <Link
                        href="/account/notifications"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-foreground hover:bg-accent hover:text-primary transition-colors"
                      >
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <span>Notifications</span>
                      </Link>
                    </div>

                    {/* Store Admin & Logout */}
                    <div className="py-1 bg-muted/20">
                      <Link
                        href="/admin"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="h-4 w-4" />
                          <span>Store Admin Portal</span>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-amber-500/20 px-1.5 py-0.5 rounded">
                          Owner
                        </span>
                      </Link>

                      {isSignedIn && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsAccountDropdownOpen(false);
                            signOut(() => router.push("/"));
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-500/10 transition-colors text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Sign In button for guests in brand brown */}
            {!isSignedIn && (
              <div className="hidden sm:flex items-center gap-1.5 ml-0.5">
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="px-2.5 xl:px-3 py-1.5 text-xs font-semibold text-primary hover:text-primary-foreground hover:bg-primary border border-primary/50 hover:border-primary rounded-lg transition-all whitespace-nowrap"
                  >
                    Sign In
                  </button>
                </SignInButton>
              </div>
            )}
          </div>
        </div>

        {/* Search bar (expanded) */}
        {isSearchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            className="pb-4 animate-in slide-in-from-top-2 duration-200"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for Banarasi, Kanjeevaram, Chiffon, Silk, Cotton sarees..."
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                autoFocus
              />
            </div>
          </form>
        )}
      </nav>

      {/* Mobile Drawer (Matching exact aesthetic from reference screenshot image.png) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer content matching reference dark aesthetic */}
          <div className="fixed inset-y-0 left-0 w-[300px] max-w-[85vw] bg-[#12141a] text-stone-200 shadow-2xl flex flex-col z-10 border-r border-stone-800 animate-in slide-in-from-left duration-200 overflow-hidden">
            {/* Drawer Header with Brand & Close */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800">
              <span className="font-playfair text-xl font-bold tracking-wider text-amber-400">
                MAA LAXMI
              </span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800/80 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Auth Bar */}
            <Show when="signed-out">
              <div className="px-4 py-3 bg-[#0e1015] border-b border-stone-800 flex items-center gap-2">
                <SignInButton mode="modal">
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-lg text-center transition-colors"
                  >
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 py-2 px-3 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg text-center transition-colors shadow-xs"
                  >
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </Show>
            <Show when="signed-in">
              <div className="px-4 py-2.5 bg-[#0e1015] border-b border-stone-800 flex items-center justify-between">
                <span className="text-xs text-stone-400 font-medium">Logged in</span>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-7 w-7",
                    },
                  }}
                />
              </div>
            </Show>

            {/* Top Tabs: Popular | Sarees (Exact UI from screenshot) */}
            <div className="flex border-b border-stone-800 bg-[#0e1015]">
              <button
                type="button"
                onClick={() => setMobileTab("popular")}
                className={`flex-1 py-3 text-center text-sm font-semibold tracking-wide transition-all ${
                  mobileTab === "popular"
                    ? "text-amber-400 border-b-2 border-amber-400 bg-stone-900/40"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                Popular
              </button>
              <button
                type="button"
                onClick={() => setMobileTab("sarees")}
                className={`flex-1 py-3 text-center text-sm font-semibold tracking-wide transition-all ${
                  mobileTab === "sarees"
                    ? "text-amber-400 border-b-2 border-amber-400 bg-stone-900/40"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                Sarees
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
              {mobileTab === "sarees" ? (
                <div>
                  {/* Category Section Header matching screenshot */}
                  <h4 className="text-amber-400 text-xs font-bold tracking-wider uppercase mb-3 px-1">
                    SAREES
                  </h4>
                  <div className="space-y-1">
                    {SAREE_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={cat.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          cat.isSpecial
                            ? "text-amber-400 font-bold bg-amber-400/10 hover:bg-amber-400/20"
                            : "text-stone-300 hover:text-white hover:bg-stone-800/60"
                        }`}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="text-amber-400 text-xs font-bold tracking-wider uppercase mb-3 px-1">
                    POPULAR COLLECTIONS
                  </h4>
                  <div className="space-y-1">
                    {POPULAR_SAREE_ITEMS.map((item) => (
                      <Link
                        key={item.slug}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-lg text-sm text-stone-300 hover:text-white hover:bg-stone-800/60 transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Custom Price Range Section */}
              <div className="pt-4 border-t border-stone-800">
                <h4 className="text-amber-400 text-xs font-bold tracking-wider uppercase mb-2.5 px-1 flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5" />
                  CUSTOM PRICE RANGE
                </h4>
                <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800 space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="relative flex-1">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-500">₹</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="Min"
                        value={navbarMinPrice}
                        onChange={(e) => setNavbarMinPrice(e.target.value)}
                        className="w-full h-8 pl-6 pr-1 text-xs rounded-lg border border-stone-700 bg-stone-950 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <span className="text-stone-500 text-xs">-</span>
                    <div className="relative flex-1">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-500">₹</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="Max"
                        value={navbarMaxPrice}
                        onChange={(e) => setNavbarMaxPrice(e.target.value)}
                        className="w-full h-8 pl-6 pr-1 text-xs rounded-lg border border-stone-700 bg-stone-950 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleApplyNavbarPrice();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full h-8 rounded-lg bg-amber-500 text-stone-950 text-xs font-bold hover:bg-amber-400 transition-colors"
                  >
                    Filter Sarees by Price
                  </button>
                </div>
              </div>

              {/* Account Quick Links (Flipkart-Style) */}
              <div className="pt-4 border-t border-stone-800 space-y-1">
                <h4 className="text-amber-400 text-xs font-bold tracking-wider uppercase mb-2 px-3">
                  Account & Orders
                </h4>
                <Link
                  href="/account/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-sm text-stone-200 hover:text-white hover:bg-stone-800/60 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="h-4 w-4 text-amber-400" />
                    <span className="font-semibold text-amber-300">My Orders</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-stone-500" />
                </Link>
                <Link
                  href="/account/coupons"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-stone-300 hover:text-white hover:bg-stone-800/60 rounded-lg transition-colors"
                >
                  <Ticket className="h-4 w-4 text-stone-400" />
                  <span>Coupons</span>
                </Link>
                <Link
                  href="/account/addresses"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-stone-300 hover:text-white hover:bg-stone-800/60 rounded-lg transition-colors"
                >
                  <MapPin className="h-4 w-4 text-stone-400" />
                  <span>Saved Addresses</span>
                </Link>
                <Link
                  href="/account/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-sm text-stone-300 hover:text-white hover:bg-stone-800/60 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="h-4 w-4 text-stone-400" />
                    <span>Wishlist</span>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/account/gift-cards"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-stone-300 hover:text-white hover:bg-stone-800/60 rounded-lg transition-colors"
                >
                  <Gift className="h-4 w-4 text-stone-400" />
                  <span>Gift Cards</span>
                </Link>
                <Link
                  href="/account/notifications"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-stone-300 hover:text-white hover:bg-stone-800/60 rounded-lg transition-colors"
                >
                  <Bell className="h-4 w-4 text-stone-400" />
                  <span>Notifications</span>
                </Link>
                <Link
                  href="/account/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-stone-300 hover:text-white hover:bg-stone-800/60 rounded-lg transition-colors"
                >
                  <User className="h-4 w-4 text-stone-400" />
                  <span>My Profile</span>
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-amber-400 hover:text-amber-300 hover:bg-stone-800/60 rounded-lg transition-colors font-medium"
                >
                  <ShieldCheck className="h-4 w-4 text-amber-400" />
                  <span>Store Admin Portal</span>
                </Link>
                {isSignedIn && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      signOut(() => router.push("/"));
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-stone-800/60 rounded-lg transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
