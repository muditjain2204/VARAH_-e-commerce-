"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { X, SlidersHorizontal, IndianRupee } from "lucide-react";
import { PRICE_RANGES } from "@/constants";

interface ProductFiltersProps {
  fabrics: string[];
  occasions: string[];
  colors: string[];
  isOpen: boolean;
  onClose: () => void;
}

export function ProductFilters({
  fabrics,
  occasions,
  colors,
  isOpen,
  onClose,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeFabric = searchParams.get("fabric") || "";
  const activeOccasion = searchParams.get("occasion") || "";
  const activeColor = searchParams.get("color") || "";
  const activeMinPrice = searchParams.get("minPrice") || "";
  const activeMaxPrice = searchParams.get("maxPrice") || "";

  const [customMin, setCustomMin] = useState(activeMinPrice);
  const [customMax, setCustomMax] = useState(activeMaxPrice);

  // Sync input fields when query params change externally
  useEffect(() => {
    setCustomMin(activeMinPrice);
    setCustomMax(activeMaxPrice);
  }, [activeMinPrice, activeMaxPrice]);

  const createQueryString = useCallback(
    (params: Record<string, string>) => {
      const current = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          current.set(key, value);
        } else {
          current.delete(key);
        }
      });

      // Reset page when filters change
      current.delete("page");

      return current.toString();
    },
    [searchParams]
  );

  const setFilter = (key: string, value: string) => {
    const currentValue = searchParams.get(key);
    const newValue = currentValue === value ? "" : value;
    router.push(`${pathname}?${createQueryString({ [key]: newValue })}`, {
      scroll: false,
    });
  };

  const applyCustomPrice = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    router.push(
      `${pathname}?${createQueryString({
        minPrice: customMin ? String(Math.max(0, Number(customMin))) : "",
        maxPrice: customMax ? String(Math.max(0, Number(customMax))) : "",
      })}`,
      { scroll: false }
    );
  };

  const setPriceRange = (min: number, max: number) => {
    const isActive =
      activeMinPrice === String(min) &&
      (max === Infinity
        ? !activeMaxPrice
        : activeMaxPrice === String(max));

    if (isActive) {
      setCustomMin("");
      setCustomMax("");
      router.push(
        `${pathname}?${createQueryString({ minPrice: "", maxPrice: "" })}`,
        { scroll: false }
      );
    } else {
      setCustomMin(String(min));
      setCustomMax(max === Infinity ? "" : String(max));
      router.push(
        `${pathname}?${createQueryString({
          minPrice: String(min),
          maxPrice: max === Infinity ? "" : String(max),
        })}`,
        { scroll: false }
      );
    }
  };

  const clearFilters = () => {
    setCustomMin("");
    setCustomMax("");
    router.push(pathname, { scroll: false });
  };

  const hasActiveFilters =
    activeFabric || activeOccasion || activeColor || activeMinPrice;

  const filterContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <h3 className="font-semibold text-foreground">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-primary hover:text-primary/80 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Fabric */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Fabric</h4>
        <div className="space-y-1.5">
          {fabrics.map((fabric) => (
            <button
              key={fabric}
              onClick={() => setFilter("fabric", fabric)}
              className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                activeFabric === fabric
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {fabric}
            </button>
          ))}
        </div>
      </div>

      {/* Occasion */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Occasion</h4>
        <div className="space-y-1.5">
          {occasions.map((occasion) => (
            <button
              key={occasion}
              onClick={() => setFilter("occasion", occasion)}
              className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                activeOccasion === occasion
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {occasion}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-foreground">Price Range</h4>
          {(activeMinPrice || activeMaxPrice) && (
            <button
              onClick={() => {
                setCustomMin("");
                setCustomMax("");
                router.push(
                  `${pathname}?${createQueryString({ minPrice: "", maxPrice: "" })}`,
                  { scroll: false }
                );
              }}
              className="text-xs text-primary hover:underline font-medium"
            >
              Reset
            </button>
          )}
        </div>

        {/* Custom Price Inputs */}
        <form onSubmit={applyCustomPrice} className="space-y-2 mb-3 bg-accent/30 p-2.5 rounded-xl border border-border/60">
          <span className="text-[11px] font-medium text-muted-foreground block">
            Custom Range (₹)
          </span>
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₹</span>
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={customMin}
                onChange={(e) => setCustomMin(e.target.value)}
                className="w-full h-8 pl-5 pr-1.5 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <span className="text-muted-foreground text-xs font-semibold">-</span>
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₹</span>
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={customMax}
                onChange={(e) => setCustomMax(e.target.value)}
                className="w-full h-8 pl-5 pr-1.5 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full h-7 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            Apply Custom Range
          </button>
        </form>

        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => {
            const isActive =
              activeMinPrice === String(range.min) &&
              (range.max === Infinity
                ? !activeMaxPrice
                : activeMaxPrice === String(range.max));
            return (
              <button
                key={range.label}
                onClick={() => setPriceRange(range.min, range.max)}
                className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Color</h4>
        <div className="flex flex-wrap gap-1.5">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setFilter("color", color)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                activeColor === color
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-6">{filterContent}</div>
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background p-6 overflow-y-auto shadow-xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            {filterContent}
          </div>
        </div>
      )}
    </>
  );
}
