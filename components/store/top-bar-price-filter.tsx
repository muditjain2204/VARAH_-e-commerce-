"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Sliders, X, Check, ArrowRight, IndianRupee } from "lucide-react";

interface TopBarPriceFilterProps {
  className?: string;
}

const QUICK_PRESETS = [
  { label: "All Prices", min: null, max: null },
  { label: "Under ₹2,000", min: 0, max: 2000 },
  { label: "₹2,000 - ₹5,000", min: 2000, max: 5000 },
  { label: "₹5,000 - ₹10,000", min: 5000, max: 10000 },
  { label: "Above ₹10,000", min: 10000, max: null },
];

export function TopBarPriceFilter({ className = "" }: TopBarPriceFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const minParam = searchParams.get("minPrice") || "";
  const maxParam = searchParams.get("maxPrice") || "";

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [customMin, setCustomMin] = useState(minParam);
  const [customMax, setCustomMax] = useState(maxParam);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCustomMin(minParam);
    setCustomMax(maxParam);
  }, [minParam, maxParam]);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
      }
    }
    if (isPopoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopoverOpen]);

  const updatePriceParams = (min: string, max: string) => {
    const current = new URLSearchParams(searchParams.toString());
    if (min) {
      current.set("minPrice", min);
    } else {
      current.delete("minPrice");
    }
    if (max) {
      current.set("maxPrice", max);
    } else {
      current.delete("maxPrice");
    }
    current.delete("page");
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  };

  const handleApplyCustom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanMin = customMin ? String(Math.max(0, Number(customMin))) : "";
    const cleanMax = customMax ? String(Math.max(0, Number(customMax))) : "";
    updatePriceParams(cleanMin, cleanMax);
    setIsPopoverOpen(false);
  };

  const handleClearPrice = () => {
    setCustomMin("");
    setCustomMax("");
    updatePriceParams("", "");
    setIsPopoverOpen(false);
  };

  const isCustomActive =
    (minParam || maxParam) &&
    !QUICK_PRESETS.some(
      (p) =>
        p.min !== null &&
        String(p.min) === minParam &&
        (p.max === null ? !maxParam : String(p.max) === maxParam)
    );

  const getActiveLabel = () => {
    if (!minParam && !maxParam) return null;
    const matched = QUICK_PRESETS.find(
      (p) =>
        p.min !== null &&
        String(p.min) === minParam &&
        (p.max === null ? !maxParam : String(p.max) === maxParam)
    );
    if (matched) return matched.label;
    if (minParam && maxParam) return `₹${Number(minParam).toLocaleString("en-IN")} - ₹${Number(maxParam).toLocaleString("en-IN")}`;
    if (minParam) return `Above ₹${Number(minParam).toLocaleString("en-IN")}`;
    if (maxParam) return `Under ₹${Number(maxParam).toLocaleString("en-IN")}`;
    return null;
  };

  const activeLabel = getActiveLabel();

  return (
    <div className={`relative flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
        <IndianRupee className="h-3 w-3" />
        Price:
      </span>

      {/* Preset pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {QUICK_PRESETS.map((preset) => {
          const isSelected =
            preset.min === null
              ? !minParam && !maxParam
              : minParam === String(preset.min) &&
                (preset.max === null
                  ? !maxParam
                  : maxParam === String(preset.max));

          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                if (preset.min === null) {
                  handleClearPrice();
                } else {
                  updatePriceParams(
                    String(preset.min),
                    preset.max !== null ? String(preset.max) : ""
                  );
                }
              }}
              className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary font-medium shadow-xs"
                  : "bg-background text-foreground/80 border-border hover:bg-accent hover:text-foreground"
              }`}
            >
              {preset.label}
            </button>
          );
        })}

        {/* Custom Price Button & Popover */}
        <div className="relative" ref={popoverRef}>
          <button
            type="button"
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            className={`px-3 py-1 text-xs rounded-full border flex items-center gap-1.5 transition-all ${
              isCustomActive || isPopoverOpen
                ? "bg-amber-600/10 text-amber-700 dark:text-amber-400 border-amber-600/40 font-semibold"
                : "bg-background text-foreground/80 border-border hover:bg-accent hover:text-foreground"
            }`}
          >
            <Sliders className="h-3 w-3" />
            <span>{isCustomActive ? "Custom Range Active" : "Custom Range"}</span>
          </button>

          {isPopoverOpen && (
            <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-72 bg-popover text-popover-foreground border border-border rounded-2xl shadow-xl p-4 z-50 animate-in fade-in-50 zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-border">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-primary" />
                  Custom Price Range
                </span>
                {(minParam || maxParam) && (
                  <button
                    type="button"
                    onClick={handleClearPrice}
                    className="text-[11px] text-muted-foreground hover:text-primary transition-colors font-medium"
                  >
                    Reset
                  </button>
                )}
              </div>

              <form onSubmit={handleApplyCustom} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                      Min Price (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={customMin}
                        onChange={(e) => setCustomMin(e.target.value)}
                        className="w-full h-8 pl-6 pr-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                      Max Price (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        placeholder="Any"
                        value={customMax}
                        onChange={(e) => setCustomMax(e.target.value)}
                        className="w-full h-8 pl-6 pr-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsPopoverOpen(false)}
                    className="flex-1 h-8 rounded-lg border border-input text-xs font-medium hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-8 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs"
                  >
                    Apply Range
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Active Badge if filtered */}
        {activeLabel && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium">
            <span>{activeLabel}</span>
            <button
              type="button"
              onClick={handleClearPrice}
              className="hover:text-primary/70 transition-colors"
              title="Remove price filter"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
