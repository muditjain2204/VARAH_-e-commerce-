"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Tags,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  Ban,
  Package,
  X,
  Sparkles,
  AlertCircle,
  Eye,
} from "lucide-react";
import {
  AdminCategoryItem,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  toggleCategoryStatusAction,
  CreateCategoryInput,
} from "@/actions/admin-category.actions";
import { toast } from "sonner";

interface CategoriesManagerProps {
  initialCategories: AdminCategoryItem[];
}

const CATEGORY_PRESETS = [
  {
    name: "Banarasi Silk",
    description: "Varanasi handcrafted brocade sarees with intricate gold zari jaal.",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Kanjivaram Silk",
    description: "Traditional pure mulberry silk sarees with contrasting korvai borders.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Chanderi Cotton",
    description: "Lightweight, sheer drapes woven with silk and fine cotton yarns.",
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Organza Silk",
    description: "Crisp and lustrous sheer sarees with modern floral threadwork.",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
  },
];

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const [categories, setCategories] = useState<AdminCategoryItem[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");

  // Add Category Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCat, setNewCat] = useState<CreateCategoryInput>({
    name: "",
    slug: "",
    description: "",
    image: CATEGORY_PRESETS[0].image,
    sortOrder: 0,
    isActive: true,
  });

  // Edit Category Modal State
  const [editingCategory, setEditingCategory] = useState<AdminCategoryItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Delete Category Confirmation Modal State
  const [deletingCategory, setDeletingCategory] = useState<AdminCategoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setIsCreating(true);
    try {
      const res = await createCategoryAction(newCat);
      if (res.success && res.data) {
        setCategories((prev) => [...prev, res.data!]);
        toast.success(`Category "${res.data.name}" created successfully!`);
        setIsAddModalOpen(false);
        setNewCat({
          name: "",
          slug: "",
          description: "",
          image: CATEGORY_PRESETS[0].image,
          sortOrder: 0,
          isActive: true,
        });
      } else {
        toast.error(res.error || "Failed to create category");
      }
    } catch {
      toast.error("Error creating category");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    setIsEditing(true);
    try {
      const res = await updateCategoryAction(editingCategory.id, {
        name: editingCategory.name,
        slug: editingCategory.slug,
        description: editingCategory.description,
        image: editingCategory.image || undefined,
        sortOrder: editingCategory.sortOrder,
        isActive: editingCategory.isActive,
      });

      if (res.success) {
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? editingCategory : c))
        );
        toast.success(`Category "${editingCategory.name}" updated!`);
        setEditingCategory(null);
      } else {
        toast.error(res.error || "Failed to update category");
      }
    } catch {
      toast.error("Error updating category");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;

    setIsDeleting(true);
    try {
      const res = await deleteCategoryAction(deletingCategory.id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
        toast.success(`Deleted category "${deletingCategory.name}"`);
        setDeletingCategory(null);
      } else {
        toast.error(res.error || "Failed to delete category");
      }
    } catch {
      toast.error("Error deleting category");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (cat: AdminCategoryItem) => {
    const updatedStatus = !cat.isActive;

    // Optimistic update
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, isActive: updatedStatus } : c))
    );

    try {
      const res = await toggleCategoryStatusAction(cat.id, updatedStatus);
      if (res.success) {
        toast.success(`${cat.name} is now ${updatedStatus ? "Active" : "Hidden"}`);
      } else {
        toast.error(res.error || "Failed to toggle status");
      }
    } catch {
      toast.error("Error changing category status");
    }
  };

  const handleApplyPreset = (preset: (typeof CATEGORY_PRESETS)[0]) => {
    setNewCat({
      ...newCat,
      name: preset.name,
      description: preset.description,
      image: preset.image,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-playfair tracking-tight text-foreground">
            Saree Categories & Weaves
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Organize catalog weaves into categories (Silk, Banarasi, Cotton, Chanderi, Organza) with display ordering and descriptions.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95 flex-shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm">
          <p className="text-xs text-muted-foreground font-medium">Total Categories</p>
          <p className="text-2xl font-bold text-foreground mt-1">{categories.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 shadow-sm">
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Active in Store
          </p>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
            {categories.filter((c) => c.isActive).length}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm">
          <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <Package className="h-3.5 w-3.5" /> Catalog Products
          </p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {categories.reduce((sum, c) => sum + c.productCount, 0)} Sarees
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search categories by name, slug, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.length === 0 ? (
          <div className="col-span-full text-center py-12 rounded-2xl border border-border bg-card p-6 text-muted-foreground">
            <Tags className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p>No categories found.</p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div
              key={category.id}
              className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image & Header */}
                <div className="relative h-36 w-full bg-muted overflow-hidden">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="350px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl">
                      🪷
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 inset-x-3 flex items-end justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white leading-tight">
                        {category.name}
                      </h3>
                      <span className="text-[11px] font-mono text-white/80">
                        /{category.slug}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white/90 text-foreground shadow-xs">
                      {category.productCount} Sarees
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
                    {category.description || "Traditional Indian saree weave collection."}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
                {/* Active Toggle Switch */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(category)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                    category.isActive
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {category.isActive ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <Ban className="h-3 w-3" />
                      <span>Hidden</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(category)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingCategory(category)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL 1: Add New Category */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-xl font-bold font-playfair text-foreground">
                Add Saree Category
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Presets Helper */}
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                Quick-Fill Traditional Weaves:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-muted hover:bg-primary/10 hover:text-primary transition-colors border border-border/60"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Category Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kanjivaram Silk"
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Weave history, zari details, and styling notes..."
                  value={newCat.description || ""}
                  onChange={(e) =>
                    setNewCat({ ...newCat, description: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-border bg-background"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newCat.image || ""}
                  onChange={(e) => setNewCat({ ...newCat, image: e.target.value })}
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-border bg-background font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newCat.isActive}
                    onChange={(e) =>
                      setNewCat({ ...newCat, isActive: e.target.checked })
                    }
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  <span>Active & Visible in Store Navigation</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 shadow-sm disabled:opacity-50"
                >
                  {isCreating ? "Creating..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Category */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-xl font-bold font-playfair text-foreground">
                Edit Category: {editingCategory.name}
              </h2>
              <button
                onClick={() => setEditingCategory(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Category Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  }
                  className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-border bg-background"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={editingCategory.slug}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      slug: e.target.value,
                    })
                  }
                  className="w-full mt-1 px-3 py-2 text-xs font-mono rounded-xl border border-border bg-background"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ""}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      description: e.target.value,
                    })
                  }
                  className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-border bg-background"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  Image URL
                </label>
                <input
                  type="url"
                  value={editingCategory.image || ""}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      image: e.target.value,
                    })
                  }
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-border bg-background font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingCategory.isActive}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        isActive: e.target.checked,
                      })
                    }
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  <span>Active & Visible in Navigation</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditing}
                  className="px-5 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 shadow-sm disabled:opacity-50"
                >
                  {isEditing ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Delete Category Confirmation */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-6 w-6" />
              <h2 className="text-lg font-bold text-foreground">Delete Category</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete the category{" "}
              <strong>{deletingCategory.name}</strong>? Sarees linked to this
              category will remain in inventory but will no longer appear under this category filter.
            </p>
            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteCategory}
                className="px-4 py-2 text-xs font-semibold bg-destructive text-destructive-foreground rounded-xl hover:bg-destructive/90 shadow-sm"
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
