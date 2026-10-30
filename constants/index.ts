// ============================================
// Saree-specific constants
// ============================================

export const FABRICS = [
  "Silk",
  "Cotton",
  "Banarasi",
  "Chanderi",
  "Kanjivaram",
  "Chiffon",
  "Georgette",
  "Organza",
  "Linen",
  "Tussar",
  "Patola",
  "Paithani",
  "Bandhani",
  "Ikat",
  "Kalamkari",
  "Tant",
  "Jamdani",
  "Maheshwari",
] as const;

export const OCCASIONS = [
  "Wedding",
  "Party Wear",
  "Casual",
  "Festive",
  "Office Wear",
  "Bridal",
  "Reception",
  "Sangeet",
  "Mehendi",
  "Daily Wear",
  "Puja",
] as const;

export const COLORS = [
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Pink",
  "Orange",
  "Purple",
  "Maroon",
  "Gold",
  "Black",
  "White",
  "Cream",
  "Beige",
  "Teal",
  "Magenta",
  "Navy",
  "Peach",
  "Lavender",
  "Brown",
  "Grey",
  "Multicolor",
] as const;

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Chandigarh",
  "Puducherry",
  "Lakshadweep",
  "Andaman and Nicobar Islands",
  "Dadra and Nagar Haveli and Daman and Diu",
] as const;

// ============================================
// App configuration
// ============================================

export const APP_NAME = "MAA LAXMI";
export const APP_DESCRIPTION =
  "MAA LAXMI — Premium handcrafted Indian sarees — Banarasi, Silk, Cotton, Kanjivaram, Chiffon, Net & more. Shop authentic sarees online with free shipping across India.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://maalaxmi.store";

export const ITEMS_PER_PAGE = 12;
export const MAX_CART_QUANTITY = 10;
export const FREE_SHIPPING_THRESHOLD = 1999; // INR
export const DEFAULT_SHIPPING_CHARGE = 99; // INR

// ============================================
// Sort options
// ============================================

export const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Most Popular", value: "popular" },
  { label: "Top Rated", value: "rating" },
] as const;

// ============================================
// Price range filters
// ============================================

export const PRICE_RANGES = [
  { label: "Under ₹1,000", min: 0, max: 1000 },
  { label: "₹1,000 - ₹2,500", min: 1000, max: 2500 },
  { label: "₹2,500 - ₹5,000", min: 2500, max: 5000 },
  { label: "₹5,000 - ₹10,000", min: 5000, max: 10000 },
  { label: "₹10,000 - ₹25,000", min: 10000, max: 25000 },
  { label: "Above ₹25,000", min: 25000, max: Infinity },
] as const;

// ============================================
// Saree Categories (Expanded from reference drawer)
// ============================================

export interface SareeCategoryOption {
  name: string;
  slug: string;
  href: string;
  isSpecial?: boolean;
}

export const SAREE_CATEGORIES: SareeCategoryOption[] = [
  { name: "All Sarees", slug: "all", href: "/products" },
  { name: "Banarasi Sarees", slug: "banarasi", href: "/categories/banarasi" },
  { name: "Kanjeevaram Sarees", slug: "kanjivaram", href: "/categories/kanjivaram" },
  { name: "Georgette Sarees", slug: "georgette", href: "/categories/georgette" },
  { name: "Chiffon Sarees", slug: "chiffon", href: "/categories/chiffon" },
  { name: "Cotton Sarees", slug: "cotton", href: "/categories/cotton" },
  { name: "Silk Sarees", slug: "silk", href: "/categories/silk" },
  { name: "Net Sarees", slug: "net", href: "/categories/net" },
  { name: "Designer Sarees", slug: "designer", href: "/categories/designer" },
  { name: "Bridal Sarees", slug: "bridal", href: "/categories/bridal" },
  { name: "Half Sarees", slug: "half-sarees", href: "/categories/half-sarees" },
  { name: "Organza Sarees", slug: "organza", href: "/categories/organza" },
  { name: "Chanderi Sarees", slug: "chanderi", href: "/categories/chanderi" },
  { name: "Linen Sarees", slug: "linen", href: "/categories/linen" },
  { name: "Tussar Sarees", slug: "tussar", href: "/categories/tussar" },
  { name: "Bandhani Sarees", slug: "bandhani", href: "/categories/bandhani" },
  { name: "Paithani Sarees", slug: "paithani", href: "/categories/paithani" },
  { name: "Patola Sarees", slug: "patola", href: "/categories/patola" },
  { name: "New Collection", slug: "new-collection", href: "/products?filter=new", isSpecial: true },
];

export const POPULAR_SAREE_ITEMS: SareeCategoryOption[] = [
  { name: "New Arrivals", slug: "new-arrivals", href: "/products?filter=new" },
  { name: "Best Sellers", slug: "best-sellers", href: "/products?filter=bestseller" },
  { name: "Banarasi Sarees", slug: "banarasi", href: "/categories/banarasi" },
  { name: "Kanjeevaram Sarees", slug: "kanjivaram", href: "/categories/kanjivaram" },
  { name: "Bridal Sarees", slug: "bridal", href: "/categories/bridal" },
  { name: "Silk Sarees", slug: "silk", href: "/categories/silk" },
  { name: "Designer Sarees", slug: "designer", href: "/categories/designer" },
  { name: "Net Sarees", slug: "net", href: "/categories/net" },
];

// ============================================
// Navigation
// ============================================

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "All Sarees", href: "/products" },
  { label: "New Arrivals", href: "/products?filter=new" },
  { label: "Best Sellers", href: "/products?filter=bestseller" },
  { label: "Wedding", href: "/products?occasion=Wedding" },
] as const;

export const FOOTER_LINKS = {
  shop: [
    { label: "All Sarees", href: "/products" },
    { label: "Banarasi Sarees", href: "/categories/banarasi" },
    { label: "Kanjeevaram Sarees", href: "/categories/kanjivaram" },
    { label: "Silk Sarees", href: "/categories/silk" },
    { label: "Chiffon Sarees", href: "/categories/chiffon" },
    { label: "Cotton Sarees", href: "/categories/cotton" },
    { label: "Net Sarees", href: "/categories/net" },
    { label: "Designer Sarees", href: "/categories/designer" },
    { label: "Bridal Sarees", href: "/categories/bridal" },
    { label: "Half Sarees", href: "/categories/half-sarees" },
  ],
  help: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faq" },
    { label: "Shipping Policy", href: "/shipping-policy" },
    { label: "Return Policy", href: "/return-policy" },
    { label: "Track Order", href: "/account/orders" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms" },
  ],
} as const;
