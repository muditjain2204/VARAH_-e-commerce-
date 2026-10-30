"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export interface SareeCarouselItem {
  id: string;
  name: string;
  fabric: string;
  category: string;
  price: string;
  originalPrice: string;
  tag: string;
  slug: string;
  image: string;
  colorName: string;
}

export const HERO_SAREES: SareeCarouselItem[] = [
  {
    id: "saree-1",
    name: "Royal Lavender Banarasi",
    fabric: "Pure Katan Silk",
    category: "Banarasi",
    price: "₹7,499",
    originalPrice: "₹9,999",
    tag: "Gold Zari Booti",
    slug: "royal-banarasi-silk-saree-gold-zari",
    image: "/hero/saree-1-purple.webp",
    colorName: "Royal Lavender",
  },
  {
    id: "saree-2",
    name: "Blush Rose Floral Chanderi",
    fabric: "Chanderi Silk & Resham",
    category: "Chanderi",
    price: "₹5,299",
    originalPrice: "₹6,999",
    tag: "Pastel Flora",
    slug: "chanderi-silk-festive-saree",
    image: "/hero/saree-2-pink.webp",
    colorName: "Blush Rose",
  },
  {
    id: "saree-3",
    name: "Imperial Crimson Banarasi",
    fabric: "Bridal Banarasi Silk",
    category: "Banarasi",
    price: "₹8,999",
    originalPrice: "₹11,999",
    tag: "Heritage Bridal",
    slug: "royal-banarasi-silk-saree-gold-zari",
    image: "/hero/saree-3-red.webp",
    colorName: "Imperial Crimson",
  },
  {
    id: "saree-4",
    name: "Opulent Ivory Kanjivaram",
    fabric: "Pure Silk Gold Zari",
    category: "Kanjivaram",
    price: "₹12,999",
    originalPrice: "₹15,999",
    tag: "Pure Gold Zari",
    slug: "pure-kanjivaram-wedding-saree",
    image: "/hero/saree-4-ivory.webp",
    colorName: "Ivory & Gold",
  },
  {
    id: "saree-5",
    name: "Majestic Peacock Green",
    fabric: "Kanjivaram Brocade",
    category: "Kanjivaram",
    price: "₹6,999",
    originalPrice: "₹8,499",
    tag: "Temple Border",
    slug: "pure-kanjivaram-wedding-saree",
    image: "/hero/saree-5-green.webp",
    colorName: "Peacock Green",
  },
];

export function SareeCarousel3D() {
  // Current 5 sarees mapped to 5 spatial positions:
  // index 0 -> Position 1: Far Left Back
  // index 1 -> Position 2: Left Front
  // index 2 -> Position 3: Center Active
  // index 3 -> Position 4: Right Front
  // index 4 -> Position 5: Far Right Back
  const [items, setItems] = useState<SareeCarouselItem[]>(HERO_SAREES);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(1100);
  const isAnimatingRef = useRef(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Track wrapping item so it fades out to 0 opacity rather than sliding across the screen
  const [wrapInfo, setWrapInfo] = useState<{
    id: string | null;
    direction: "left-to-right" | "right-to-left";
  }>({ id: null, direction: "left-to-right" });

  // Measure stage width for responsive spacing
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setStageWidth(entry.contentRect.width);
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Infinite carousel navigation:
  // LEFT ARROW: [1, 2, 3, 4, 5] -> [2, 3, 4, 5, 1]
  // Saree at index 0 wraps to index 4 (left to right) -> opacity 0 fade rather than crossing
  const handlePrev = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    setItems((prev) => {
      const wrappingId = prev[0].id;
      setWrapInfo({ id: wrappingId, direction: "left-to-right" });
      return [prev[1], prev[2], prev[3], prev[4], prev[0]];
    });

    setTimeout(() => {
      setWrapInfo({ id: null, direction: "left-to-right" });
      isAnimatingRef.current = false;
    }, 720);
  }, []);

  // RIGHT ARROW: [1, 2, 3, 4, 5] -> [5, 1, 2, 3, 4]
  // Saree at index 4 wraps to index 0 (right to left) -> opacity 0 fade rather than crossing
  const handleNext = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    setItems((prev) => {
      const wrappingId = prev[4].id;
      setWrapInfo({ id: wrappingId, direction: "right-to-left" });
      return [prev[4], prev[0], prev[1], prev[2], prev[3]];
    });

    setTimeout(() => {
      setWrapInfo({ id: null, direction: "right-to-left" });
      isAnimatingRef.current = false;
    }, 720);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Click on any saree in slot to bring to center
  const handleSelectSlot = (slotIndex: number) => {
    if (slotIndex === 1) handleNext();
    else if (slotIndex === 3) handlePrev();
    else if (slotIndex === 0) {
      handleNext();
      setTimeout(handleNext, 400);
    } else if (slotIndex === 4) {
      handlePrev();
      setTimeout(handlePrev, 400);
    }
  };

  // Jump to specific saree via pagination dots
  const handleJumpToSaree = (sareeId: string) => {
    const currentIndex = items.findIndex((item) => item.id === sareeId);
    if (currentIndex === 2) return;
    if (currentIndex === 1) handleNext();
    else if (currentIndex === 3) handlePrev();
    else if (currentIndex === 0) {
      handleNext();
      setTimeout(handleNext, 400);
    } else if (currentIndex === 4) {
      handlePrev();
      setTimeout(handlePrev, 400);
    }
  };

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 45) handleNext();
    else if (diff < -45) handlePrev();
    touchStartX.current = null;
  };

  // 3D Spatial Geometry based on container width
  const isMobile = stageWidth < 640;
  const isTablet = stageWidth >= 640 && stageWidth < 1024;

  const spacingFactor = isMobile ? 0.22 : isTablet ? 0.20 : 0.18;
  const maxSpacing = isMobile ? 62 : isTablet ? 110 : 155;
  const spacing = Math.min(stageWidth * spacingFactor, maxSpacing);

  // Slot styles matching user specification
  const getSlotStyle = (slotIndex: number) => {
    switch (slotIndex) {
      case 0:
        // Position 1: Far Left Back
        return {
          x: -spacing * 2,
          y: isMobile ? -6 : -10,
          scale: isMobile ? 0.65 : 0.72,
          z: -150,
          zIndex: 10,
          opacity: isMobile ? 0.5 : 0.78,
        };
      case 1:
        // Position 2: Left Front
        return {
          x: -spacing,
          y: isMobile ? -2 : -4,
          scale: isMobile ? 0.78 : 0.88,
          z: -75,
          zIndex: 20,
          opacity: 0.92,
        };
      case 2:
        // Position 3: Center Active
        return {
          x: 0,
          y: isMobile ? 4 : 8,
          scale: isMobile ? 0.98 : 1.10,
          z: 100,
          zIndex: 35,
          opacity: 1,
        };
      case 3:
        // Position 4: Right Front
        return {
          x: spacing,
          y: isMobile ? -2 : -4,
          scale: isMobile ? 0.78 : 0.88,
          z: -75,
          zIndex: 20,
          opacity: 0.92,
        };
      case 4:
      default:
        // Position 5: Far Right Back
        return {
          x: spacing * 2,
          y: isMobile ? -6 : -10,
          scale: isMobile ? 0.65 : 0.72,
          z: -150,
          zIndex: 10,
          opacity: isMobile ? 0.5 : 0.78,
        };
    }
  };

  const centerSaree = items[2];

  return (
    <div
      className="relative w-full select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D Stage Container — Perfectly sized to fit completely within the window view */}
      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-5xl h-[210px] sm:h-[240px] md:h-[270px] lg:h-[300px] flex items-end justify-center overflow-visible"
        style={{
          perspective: 1200,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous Saree"
          className="absolute left-1 sm:left-3 md:left-6 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white text-stone-900 shadow-lg border border-stone-200/70 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-stone-800 transition-transform group-hover:-translate-x-0.5" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          aria-label="Next Saree"
          className="absolute right-1 sm:right-3 md:right-6 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white text-stone-900 shadow-lg border border-stone-200/70 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-stone-800 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* 5 Sarees in 3D V-Formation */}
        {items.map((item, index) => {
          const slot = getSlotStyle(index);
          const isCenter = index === 2;
          const isWrapping = wrapInfo.id === item.id;

          // Animation logic:
          // If this is the wrapping saree, fade it out to 0 opacity on its side and fade in on the other side,
          // NEVER sliding across the center!
          let animationTarget: any;
          let transitionConfig: any;

          if (isWrapping && wrapInfo.direction === "left-to-right") {
            // Saree moved from Far Left (slot 0) to Far Right (slot 4)
            // Fade out on left, teleport offstage right while invisible, fade in on right
            animationTarget = {
              x: [-spacing * 2, -spacing * 2.2, spacing * 2.2, spacing * 2],
              opacity: [0.78, 0, 0, 0.78],
              scale: [0.72, 0.65, 0.65, 0.72],
              z: -150,
              zIndex: 10,
              y: isMobile ? -6 : -10,
            };
            transitionConfig = {
              duration: 0.7,
              times: [0, 0.35, 0.5, 1],
              ease: "easeInOut",
            };
          } else if (isWrapping && wrapInfo.direction === "right-to-left") {
            // Saree moved from Far Right (slot 4) to Far Left (slot 0)
            // Fade out on right, teleport offstage left while invisible, fade in on left
            animationTarget = {
              x: [spacing * 2, spacing * 2.2, -spacing * 2.2, -spacing * 2],
              opacity: [0.78, 0, 0, 0.78],
              scale: [0.72, 0.65, 0.65, 0.72],
              z: -150,
              zIndex: 10,
              y: isMobile ? -6 : -10,
            };
            transitionConfig = {
              duration: 0.7,
              times: [0, 0.35, 0.5, 1],
              ease: "easeInOut",
            };
          } else {
            // Normal smooth slide for the other 4 sarees
            animationTarget = {
              x: slot.x,
              y: slot.y,
              scale: slot.scale,
              z: slot.z,
              zIndex: slot.zIndex,
              opacity: slot.opacity,
            };
            transitionConfig = {
              duration: 0.7,
              ease: [0.42, 0, 0.58, 1], // ease-in-out
            };
          }

          const isCardHovered = hoveredId === item.id;

          return (
            <motion.div
              key={item.id}
              animate={animationTarget}
              transition={transitionConfig}
              style={{
                position: "absolute",
                bottom: 8,
                transformOrigin: "bottom center",
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
                zIndex: isCardHovered ? 50 : animationTarget.zIndex,
              }}
              className="cursor-pointer pointer-events-auto"
              onClick={() => handleSelectSlot(index)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Premium 3D Hover Popout: 8%-12% Scale, Forward in Z, Brightness & Shadow (300ms easeOut) */}
              <motion.div
                whileHover={{
                  scale: 1.10,
                  z: 60,
                  y: -6,
                  filter: "brightness(1.08) drop-shadow(0 20px 28px rgba(0,0,0,0.32))",
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                style={{
                  transformStyle: "preserve-3d",
                  willChange: "transform, filter",
                }}
                className="relative flex flex-col items-center"
              >
                {/* Floating Animation Wrapper */}
                <motion.div
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: (index % 5) * 0.45,
                  }}
                  className="relative flex flex-col items-center"
                >
                  {/* Standardized Saree Image Container (Exact 896/1200 aspect ratio) */}
                  <div className="relative w-[95px] sm:w-[115px] md:w-[138px] lg:w-[158px] aspect-[896/1200] flex items-end justify-center">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 95px, (max-width: 1024px) 130px, 160px"
                      priority={isCenter}
                      className="object-contain object-bottom drop-shadow-[0_8px_16px_rgba(0,0,0,0.18)] select-none pointer-events-none transition-[filter] duration-300"
                    />
                  </div>

                  {/* Pedestal Grounding Shadow */}
                  <div
                    className="w-[80%] h-3.5 -mt-1.5 rounded-[100%] transition-all duration-300"
                    style={{
                      backgroundColor: isCardHovered
                        ? "rgba(40, 15, 10, 0.45)"
                        : isCenter
                        ? "rgba(70, 30, 20, 0.32)"
                        : "rgba(0, 0, 0, 0.18)",
                      filter: isCardHovered ? "blur(6px)" : "blur(4px)",
                      transform: isCardHovered
                        ? "scale(1.25) translateY(3px)"
                        : isCenter
                        ? "scale(1.15)"
                        : "scale(0.85)",
                    }}
                  />

                  {/* Subtle active center golden aura */}
                  {(isCenter || isCardHovered) && (
                    <div
                      className={`absolute -bottom-1 w-[85%] h-5 rounded-[100%] border border-amber-500/40 bg-amber-400/10 blur-[2px] pointer-events-none transition-all duration-300 ${
                        isCardHovered ? "opacity-100 scale-110" : "opacity-80 animate-pulse"
                      }`}
                    />
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Center Active Saree Details & Indicator Dots */}
      <div className="mt-1 sm:mt-1.5 flex flex-col items-center justify-center gap-1.5">
        {/* Active Saree Detail Pill */}
        <Link
          href={`/products/${centerSaree.slug}`}
          className="group inline-flex items-center gap-2 px-3 py-1 sm:py-1.5 rounded-full bg-white/85 hover:bg-white text-stone-800 shadow-sm border border-stone-200/70 backdrop-blur-md transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="font-playfair font-medium text-xs sm:text-sm text-stone-900">
            {centerSaree.name}
          </span>
          <span className="text-xs text-stone-300 font-light">•</span>
          <span className="text-[11px] font-medium text-amber-900 bg-amber-50/80 px-2 py-0.5 rounded-full border border-amber-200/50">
            {centerSaree.fabric}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-primary">{centerSaree.price}</span>
          <ArrowRight className="w-3 h-3 text-stone-400 transition-transform group-hover:translate-x-0.5" />
        </Link>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center gap-1.5 pt-0.5" aria-label="Carousel pagination">
          {HERO_SAREES.map((saree) => {
            const isActive = centerSaree.id === saree.id;
            return (
              <button
                key={saree.id}
                onClick={() => handleJumpToSaree(saree.id)}
                aria-label={`Switch to ${saree.name}`}
                className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                  isActive
                    ? "w-6 h-1.5 bg-primary shadow-sm"
                    : "w-1.5 h-1.5 bg-stone-300 hover:bg-stone-400"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
