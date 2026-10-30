"use client";

import { useState } from "react";
import {
  Ticket,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Ban,
  Trash2,
  Edit3,
  Copy,
  Percent,
  IndianRupee,
  Calendar,
  Sparkles,
  Users,
  ShieldCheck,
  Check,
  AlertCircle,
  ExternalLink,
  Zap,
} from "lucide-react";
import {
  AdminCouponItem,
  CreateCouponInput,
  createCouponAction,
  updateCouponAction,
  toggleCouponStatusAction,
  deleteCouponAction,
} from "@/actions/admin-coupon.actions";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface CouponsManagerProps {
  initialCoupons: AdminCouponItem[];
}

const PRESET_TEMPLATES = [
  {
    name: "Festive 10% Off",
    code: "FESTIVE10",
    discountType: "PERCENTAGE" as const,
    discountValue: 10,
    minOrderAmount: 1499,
    maxDiscount: 750,
    description: "10% off on all festive sarees up to ₹750",
  },
  {
    name: "Welcome ₹500 Flat",
    code: "WELCOME500",
    discountType: "FIXED" as const,
    discountValue: 500,
    minOrderAmount: 2999,
    maxDiscount: null,
    description: "Flat ₹500 instant discount on first purchase",
  },
  {
    name: "Bridal Silk 20%",
    code: "BRIDAL20",
    discountType: "PERCENTAGE" as const,
    discountValue: 20,
    minOrderAmount: 4999,
    maxDiscount: 2500,
    description: "Exclusive 20% discount on luxury bridal silks",
  },
  {
    name: "Handloom Special ₹300",
    code: "HANDLOOM300",
    discountType: "FIXED" as const,
    discountValue: 300,
    minOrderAmount: 1999,
    maxDiscount: null,
    description: "Flat ₹300 off on pure handloom drapes",
  },
];

export function CouponsManager({ initialCoupons }: CouponsManagerProps) {
  const [coupons, setCoupons] = useState<AdminCouponItem[]>(initialCoupons);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE" | "EXPIRED">("ALL");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "PERCENTAGE" | "FIXED">("ALL");

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState<CreateCouponInput>({
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minOrderAmount: 999,
    maxDiscount: 500,
    usageLimit: 500,
    usageLimitPerUser: 1,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    isActive: true,
  });

  // Edit Modal State
  const [editingCoupon, setEditingCoupon] = useState<AdminCouponItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete State
  const [deletingCoupon, setDeletingCoupon] = useState<AdminCouponItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter Coupons
  const filteredCoupons = coupons.filter((c) => {
    const isExpired = new Date(c.endDate) < new Date();
    const matchesSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = typeFilter === "ALL" || c.discountType === typeFilter;

    let matchesStatus = true;
    if (statusFilter === "ACTIVE") matchesStatus = c.isActive && !isExpired;
    else if (statusFilter === "INACTIVE") matchesStatus = !c.isActive && !isExpired;
    else if (statusFilter === "EXPIRED") matchesStatus = isExpired;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Summary Metrics
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((c) => c.isActive && new Date(c.endDate) >= new Date()).length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + c.usedCount, 0);
  const expiredCoupons = coupons.filter((c) => new Date(c.endDate) < new Date()).length;

  // Generate Random Code
  const handleGenerateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let randomStr = "";
    for (let i = 0; i < 6; i++) {
      randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const generated = `VARAH-${randomStr}`;
    setCreateForm((prev) => ({ ...prev, code: generated }));
    toast.info("Generated code: " + generated);
  };

  // Copy code to clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code ${code} copied!`);
  };

  // Toggle Active/Inactive
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    // Optimistic update
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: newStatus } : c))
    );

    try {
      const res = await toggleCouponStatusAction(id, newStatus);
      if (res.success) {
        toast.success(newStatus ? "Coupon activated" : "Coupon deactivated");
      } else {
        toast.error("Failed to update status");
        // Revert
        setCoupons((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isActive: currentStatus } : c))
        );
      }
    } catch {
      toast.error("Failed to update status");
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: currentStatus } : c))
      );
    }
  };

  // Handle Create Coupon
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.code.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    setIsCreating(true);

    try {
      const res = await createCouponAction(createForm);
      if (res.success && res.data) {
        toast.success(`Coupon ${res.data.code} created successfully!`);
        setCoupons((prev) => [res.data!, ...prev]);
        setIsCreateModalOpen(false);
        // Reset form
        setCreateForm({
          code: "",
          description: "",
          discountType: "PERCENTAGE",
          discountValue: 10,
          minOrderAmount: 999,
          maxDiscount: 500,
          usageLimit: 500,
          usageLimitPerUser: 1,
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          isActive: true,
        });
      } else {
        toast.error(res.error || "Failed to create coupon");
      }
    } catch {
      toast.error("An error occurred while creating coupon");
    } finally {
      setIsCreating(false);
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon) return;

    setIsUpdating(true);
    try {
      const res = await updateCouponAction(editingCoupon.id, {
        code: editingCoupon.code,
        description: editingCoupon.description,
        discountType: editingCoupon.discountType,
        discountValue: editingCoupon.discountValue,
        minOrderAmount: editingCoupon.minOrderAmount,
        maxDiscount: editingCoupon.maxDiscount,
        usageLimit: editingCoupon.usageLimit,
        usageLimitPerUser: editingCoupon.usageLimitPerUser,
        startDate: editingCoupon.startDate,
        endDate: editingCoupon.endDate,
        isActive: editingCoupon.isActive,
      });

      if (res.success && res.data) {
        toast.success(`Coupon ${res.data.code} updated!`);
        setCoupons((prev) =>
          prev.map((c) => (c.id === editingCoupon.id ? res.data! : c))
        );
        setEditingCoupon(null);
      } else {
        toast.error(res.error || "Failed to update coupon");
      }
    } catch {
      toast.error("Error updating coupon");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deletingCoupon) return;
    setIsDeleting(true);

    try {
      const res = await deleteCouponAction(deletingCoupon.id);
      if (res.success) {
        toast.success(`Coupon ${deletingCoupon.code} deleted`);
        setCoupons((prev) => prev.filter((c) => c.id !== deletingCoupon.id));
        setDeletingCoupon(null);
      } else {
        toast.error(res.error || "Failed to delete coupon");
      }
    } catch {
      toast.error("Error deleting coupon");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Ticket className="h-6 w-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-playfair tracking-tight text-foreground">
              Promotional Coupons & Vouchers
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Create discount codes, set cart limits and redemption caps, and track festive marketing campaigns.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95 flex-shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm">
          <p className="text-xs text-muted-foreground font-medium">Total Coupons</p>
          <p className="text-2xl font-bold text-foreground mt-1">{totalCoupons}</p>
        </div>

        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 shadow-sm">
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Active Campaigns
          </p>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
            {activeCoupons}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 shadow-sm">
          <p className="text-xs text-primary font-medium flex items-center gap-1">
            <Zap className="h-3.5 w-3.5" /> Total Redemptions
          </p>
          <p className="text-2xl font-bold text-primary mt-1">
            {totalRedemptions}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 shadow-sm">
          <p className="text-xs text-rose-700 dark:text-rose-400 font-medium flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> Expired Coupons
          </p>
          <p className="text-2xl font-bold text-rose-700 dark:text-rose-400 mt-1">
            {expiredCoupons}
          </p>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col md:flex-row gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by coupon code (e.g. VARAH10) or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="EXPIRED">Expired</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Discount Types</option>
            <option value="PERCENTAGE">Percentage (%)</option>
            <option value="FIXED">Flat (₹)</option>
          </select>
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCoupons.length === 0 ? (
          <div className="col-span-full text-center py-16 rounded-2xl border border-dashed border-border bg-card p-8">
            <Ticket className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <h3 className="text-base font-semibold text-foreground">No coupons found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              No promotional codes match your active filters or search query. Create a new coupon to get started.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Coupon
            </button>
          </div>
        ) : (
          filteredCoupons.map((coupon) => {
            const isExpired = new Date(coupon.endDate) < new Date();
            const usagePercent = coupon.usageLimit
              ? Math.min(Math.round((coupon.usedCount / coupon.usageLimit) * 100), 100)
              : null;

            return (
              <div
                key={coupon.id}
                className={`relative rounded-2xl border transition-all duration-200 bg-card overflow-hidden shadow-xs hover:shadow-md ${
                  isExpired
                    ? "border-border/60 opacity-80"
                    : coupon.isActive
                    ? "border-border hover:border-amber-500/40"
                    : "border-dashed border-border/80"
                }`}
              >
                {/* Coupon Header Banner */}
                <div className="p-5 pb-4 border-b border-border/60 bg-gradient-to-r from-amber-500/5 via-rose-500/5 to-transparent">
                  <div className="flex items-start justify-between gap-2">
                    {/* Code with Copy */}
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-background border border-border font-mono text-sm font-bold tracking-wider text-foreground shadow-xs group">
                        <span>{coupon.code}</span>
                        <button
                          onClick={() => handleCopyCode(coupon.code)}
                          className="text-muted-foreground hover:text-primary transition-colors ml-1 p-0.5"
                          title="Copy coupon code"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center gap-1.5 mt-2">
                        {isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            <Clock className="h-3 w-3" /> Expired
                          </span>
                        ) : coupon.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
                            <Ban className="h-3 w-3" /> Inactive
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                          {coupon.discountType === "PERCENTAGE" ? (
                            <>
                              <Percent className="h-3 w-3" /> {coupon.discountValue}% OFF
                            </>
                          ) : (
                            <>
                              <IndianRupee className="h-3 w-3" /> Flat {formatPrice(coupon.discountValue)} OFF
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Quick Active Toggle */}
                    <button
                      type="button"
                      disabled={isExpired}
                      onClick={() => handleToggleStatus(coupon.id, coupon.isActive)}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isExpired ? "opacity-40 cursor-not-allowed" : ""
                      } ${coupon.isActive && !isExpired ? "bg-emerald-600" : "bg-muted"}`}
                      title={coupon.isActive ? "Deactivate Coupon" : "Activate Coupon"}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          coupon.isActive && !isExpired ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {coupon.description && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {coupon.description}
                    </p>
                  )}
                </div>

                {/* Coupon Details Body */}
                <div className="p-5 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                    <div>
                      <span className="block text-[11px] text-muted-foreground/70">Min Cart Value</span>
                      <span className="font-semibold text-foreground">
                        {coupon.minOrderAmount ? formatPrice(coupon.minOrderAmount) : "None"}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[11px] text-muted-foreground/70">Max Discount</span>
                      <span className="font-semibold text-foreground">
                        {coupon.maxDiscount ? formatPrice(coupon.maxDiscount) : "Unlimited"}
                      </span>
                    </div>
                  </div>

                  {/* Usage Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" /> Redemptions
                      </span>
                      <span className="font-semibold text-foreground">
                        {coupon.usedCount}{" "}
                        {coupon.usageLimit ? `/ ${coupon.usageLimit}` : "used"}
                      </span>
                    </div>
                    {coupon.usageLimit && (
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            (usagePercent || 0) > 85 ? "bg-rose-500" : "bg-amber-500"
                          }`}
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Validity Dates */}
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
                    <span>
                      Valid: {new Date(coupon.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} -{" "}
                      {new Date(coupon.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    Limit: {coupon.usageLimitPerUser || 1} / user
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingCoupon(coupon)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      title="Edit Coupon"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingCoupon(coupon)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete Coupon"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: Create Coupon */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-card border border-border w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                  <Ticket className="h-5 w-5" />
                </span>
                <h2 className="text-lg font-bold font-playfair text-foreground">
                  Create Promotional Coupon
                </h2>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Fast Preset Templates */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                1-Click Preset Templates
              </p>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.code}
                    type="button"
                    onClick={() => {
                      setCreateForm((prev) => ({
                        ...prev,
                        code: tpl.code,
                        discountType: tpl.discountType,
                        discountValue: tpl.discountValue,
                        minOrderAmount: tpl.minOrderAmount,
                        maxDiscount: tpl.maxDiscount,
                        description: tpl.description,
                      }));
                      toast.info(`Loaded preset "${tpl.name}"`);
                    }}
                    className="p-2 text-left rounded-xl border border-border hover:border-amber-500/40 hover:bg-amber-500/5 transition-all text-xs"
                  >
                    <div className="font-bold text-foreground">{tpl.name}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Code: <span className="font-mono text-primary font-semibold">{tpl.code}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Code with Generator */}
              <div>
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Coupon Code *</span>
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" /> Auto-Generate
                  </button>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VARAH20"
                  value={createForm.code}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      code: e.target.value.toUpperCase().replace(/\s+/g, ""),
                    })
                  }
                  className="w-full mt-1.5 px-3 py-2 text-sm font-mono uppercase font-bold rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Discount Type *
                  </label>
                  <select
                    value={createForm.discountType}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        discountType: e.target.value as any,
                      })
                    }
                    className="w-full mt-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Flat Rupee Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Discount Value * ({createForm.discountType === "PERCENTAGE" ? "%" : "₹"})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={createForm.discountType === "PERCENTAGE" ? 100 : 100000}
                    required
                    value={createForm.discountValue}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        discountValue: Number(e.target.value),
                      })
                    }
                    className="w-full mt-1.5 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Min Order & Max Discount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Minimum Cart Subtotal (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 999"
                    value={createForm.minOrderAmount ?? ""}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        minOrderAmount: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full mt-1.5 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Maximum Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 1000 (Optional for % discounts)"
                    disabled={createForm.discountType === "FIXED"}
                    value={createForm.maxDiscount ?? ""}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        maxDiscount: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full mt-1.5 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Start Date & End Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={createForm.startDate}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, startDate: e.target.value })
                    }
                    className="w-full mt-1.5 px-3 py-2 text-xs rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={createForm.endDate}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, endDate: e.target.value })
                    }
                    className="w-full mt-1.5 px-3 py-2 text-xs rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Usage Limits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Total Usage Limit (Total times)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 500 (Empty for unlimited)"
                    value={createForm.usageLimit ?? ""}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        usageLimit: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full mt-1.5 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Usage Limit Per Customer
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={createForm.usageLimitPerUser ?? 1}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        usageLimitPerUser: Number(e.target.value),
                      })
                    }
                    className="w-full mt-1.5 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Description / Marketing Note
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 15% off for Diwali celebration on order above ₹1,999"
                  value={createForm.description}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, description: e.target.value })
                  }
                  className="w-full mt-1.5 px-3 py-2 text-xs rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-sm"
                >
                  {isCreating ? "Creating..." : "Publish Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Coupon */}
      {editingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-card border border-border w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-bold font-playfair text-foreground">
                Edit Coupon — {editingCoupon.code}
              </h2>
              <button
                onClick={() => setEditingCoupon(null)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={editingCoupon.code}
                  onChange={(e) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      code: e.target.value.toUpperCase().replace(/\s+/g, ""),
                    })
                  }
                  className="w-full mt-1.5 px-3 py-2 text-sm font-mono uppercase font-bold rounded-lg border border-border bg-background"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Discount Type *
                  </label>
                  <select
                    value={editingCoupon.discountType}
                    onChange={(e) =>
                      setEditingCoupon({
                        ...editingCoupon,
                        discountType: e.target.value as any,
                      })
                    }
                    className="w-full mt-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-border bg-background"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Flat Rupee Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Discount Value * ({editingCoupon.discountType === "PERCENTAGE" ? "%" : "₹"})
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingCoupon.discountValue}
                    onChange={(e) =>
                      setEditingCoupon({
                        ...editingCoupon,
                        discountValue: Number(e.target.value),
                      })
                    }
                    className="w-full mt-1.5 px-3 py-2 text-sm rounded-lg border border-border bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Minimum Cart Subtotal (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingCoupon.minOrderAmount ?? ""}
                    onChange={(e) =>
                      setEditingCoupon({
                        ...editingCoupon,
                        minOrderAmount: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full mt-1.5 px-3 py-2 text-sm rounded-lg border border-border bg-background"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Maximum Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    disabled={editingCoupon.discountType === "FIXED"}
                    value={editingCoupon.maxDiscount ?? ""}
                    onChange={(e) =>
                      setEditingCoupon({
                        ...editingCoupon,
                        maxDiscount: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full mt-1.5 px-3 py-2 text-sm rounded-lg border border-border bg-background disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={editingCoupon.startDate.split("T")[0]}
                    onChange={(e) =>
                      setEditingCoupon({
                        ...editingCoupon,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full mt-1.5 px-3 py-2 text-xs rounded-lg border border-border bg-background"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    required
                    value={editingCoupon.endDate.split("T")[0]}
                    onChange={(e) =>
                      setEditingCoupon({
                        ...editingCoupon,
                        endDate: e.target.value,
                      })
                    }
                    className="w-full mt-1.5 px-3 py-2 text-xs rounded-lg border border-border bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingCoupon.description || ""}
                  onChange={(e) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      description: e.target.value,
                    })
                  }
                  className="w-full mt-1.5 px-3 py-2 text-xs rounded-lg border border-border bg-background"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingCoupon(null)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-sm"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Delete Confirmation */}
      {deletingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-sm rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <div className="p-2 rounded-full bg-destructive/10">
                <AlertCircle className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Delete Coupon</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Are you sure you want to permanently delete coupon{" "}
              <strong className="text-foreground font-mono">{deletingCoupon.code}</strong>?
              Customers will no longer be able to apply this discount at checkout.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setDeletingCoupon(null)}
                className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="px-4 py-1.5 text-xs font-semibold bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 shadow-sm"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
