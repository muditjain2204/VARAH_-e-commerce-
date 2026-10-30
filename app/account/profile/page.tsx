"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  ArrowRightLeft,
  MapPin,
  Package,
  Heart,
  Edit3,
  Check,
  ExternalLink,
} from "lucide-react";
import { useWishlist } from "@/components/providers/wishlist-provider";
import { useCart } from "@/components/providers/cart-provider";
import { toast } from "sonner";

export default function ProfilePage() {
  const { itemCount: wishlistCount } = useWishlist();
  const { itemCount: cartCount } = useCart();

  // Profile Viewer State
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("Priya");
  const [lastName, setLastName] = useState("Sharma");
  const [email, setEmail] = useState("priya.sharma@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [defaultCity, setDefaultCity] = useState("Varanasi, Uttar Pradesh");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
            Customer Profile
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm mt-1">
            View and manage your personal details and shopping activity
          </p>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="p-6 md:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-5">
            <div className="w-18 h-18 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-2xl md:text-3xl font-bold shadow-md">
              {firstName[0]}
              {lastName[0]}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  {firstName} {lastName}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                  Buyer Mode
                </span>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> {email}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> {phone}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-border hover:bg-accent text-foreground transition-all"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
          </button>
        </div>

        {/* Edit Profile Inline Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="pt-4 border-t border-border space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Edit Personal Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-medium">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-medium">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-medium">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-medium">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* Quick Shopping Activity Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
          <Link
            href="/account/orders"
            className="p-4 rounded-2xl bg-muted/20 border border-border hover:border-primary/30 transition-all flex items-center gap-3 group"
          >
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Orders</p>
              <p className="text-sm font-bold text-foreground">View History →</p>
            </div>
          </Link>

          <Link
            href="/account/wishlist"
            className="p-4 rounded-2xl bg-muted/20 border border-border hover:border-primary/30 transition-all flex items-center gap-3 group"
          >
            <div className="p-2.5 rounded-xl bg-destructive/10 text-destructive group-hover:scale-110 transition-transform">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Wishlist</p>
              <p className="text-sm font-bold text-foreground">{wishlistCount} Saved Items</p>
            </div>
          </Link>

          <Link
            href="/cart"
            className="p-4 rounded-2xl bg-muted/20 border border-border hover:border-primary/30 transition-all flex items-center gap-3 group"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 group-hover:scale-110 transition-transform">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Shopping Bag</p>
              <p className="text-sm font-bold text-foreground">{cartCount} Sarees</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Account Details & Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Default Shipping Address */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Default Shipping Address</span>
            </h3>
            <Link
              href="/account/addresses"
              className="text-xs text-primary hover:underline font-medium"
            >
              Manage
            </Link>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground text-sm">Priya Sharma</p>
            <p>Flat 402, Royal Residency, M.G. Road</p>
            <p>{defaultCity} - 221001</p>
            <p className="pt-1 text-foreground">Phone: {phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
