"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Flame, ArrowRight, LayoutDashboard, Sparkles } from "lucide-react";
import { CurateShowcaseModal } from "@/components/admin/curate-showcase-modal";

interface AdminPreviewBarProps {
  isAdmin: boolean;
}

export function AdminPreviewBar({ isAdmin }: AdminPreviewBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isAdmin) return null;

  return (
    <>
      <div className="sticky top-0 z-[60] bg-amber-500 text-amber-950 px-4 py-2 text-xs font-semibold shadow-md flex flex-wrap items-center justify-between gap-2 border-b border-amber-600/20">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-amber-900 animate-pulse" />
          <ShieldCheck className="h-4 w-4" />
          <span>Admin Preview Mode: You are viewing live home page merchandising</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-1 bg-amber-950 text-amber-100 rounded-lg text-[11px] font-bold hover:bg-black transition-all shadow-xs active:scale-95"
          >
            <Flame className="h-3 w-3 text-amber-400" />
            <span>Curate Trending & Showcase Sarees</span>
          </button>

          <Link
            href="/admin"
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-400/80 text-amber-950 rounded-lg text-[11px] font-bold hover:bg-amber-400 transition-colors"
          >
            <LayoutDashboard className="h-3 w-3" />
            <span>Admin Dashboard</span>
          </Link>
        </div>
      </div>

      <CurateShowcaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => window.location.reload()}
      />
    </>
  );
}
