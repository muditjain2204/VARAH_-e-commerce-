"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: { url: string; alt?: string | null }[];
  productName: string;
  discount?: number;
}

export function ProductGallery({
  images,
  productName,
  discount = 0,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Fallback to empty placeholder if no images
  const safeImages =
    images.length > 0
      ? images
      : [
          {
            url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
            alt: productName,
          },
        ];

  const currentImage = safeImages[activeIndex] || safeImages[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : safeImages.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev < safeImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      <div className="space-y-3 max-w-lg mx-auto w-full lg:sticky lg:top-24">
        {/* Main Image Stage */}
        <div className="relative w-full h-[360px] sm:h-[440px] md:h-[480px] lg:h-[500px] max-h-[65vh] rounded-2xl overflow-hidden bg-neutral-900/5 dark:bg-neutral-900/40 border border-border flex items-center justify-center group shadow-xs">
          <Image
            src={currentImage.url}
            alt={currentImage.alt || productName}
            fill
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />

          {/* Discount Badge */}
          {discount > 0 && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg shadow-sm">
              {discount}% OFF
            </span>
          )}

          {/* Full-view Zoom Trigger */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="absolute top-3 right-3 p-2 rounded-xl bg-background/80 hover:bg-background text-foreground backdrop-blur-md border border-border/60 transition-all opacity-80 group-hover:opacity-100 shadow-sm"
            title="Expand Full Resolution View"
            aria-label="Expand image"
          >
            <Maximize2 className="h-4 w-4" />
          </button>

          {/* Quick Prev / Next Arrows if multiple images */}
          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background text-foreground backdrop-blur-md border border-border/60 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background text-foreground backdrop-blur-md border border-border/60 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next photo"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Image Counter indicator */}
          {safeImages.length > 1 && (
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-[11px] font-medium backdrop-blur-xs">
              {activeIndex + 1} / {safeImages.length}
            </div>
          )}
        </div>

        {/* Thumbnail Selector */}
        {safeImages.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin">
            {safeImages.map((img, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={`${img.url}-${idx}`}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`relative w-16 h-20 sm:w-18 sm:h-22 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all bg-muted/20 ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/30 shadow-sm scale-105"
                      : "border-border hover:border-foreground/40 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || `${productName} thumbnail ${idx + 1}`}
                    fill
                    className="object-contain p-1"
                    sizes="80px"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Full-Screen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage.url}
              alt={currentImage.alt || productName}
              fill
              className="object-contain"
              sizes="90vw"
            />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Lightbox Arrows */}
            {safeImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-colors"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-colors"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
