"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  // Generate page numbers to display
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <Link
        href={createPageUrl(Math.max(1, currentPage - 1))}
        className={`p-2 rounded-lg transition-colors ${
          currentPage === 1
            ? "text-muted-foreground/30 pointer-events-none"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        }`}
        aria-disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={createPageUrl(page)}
            className={`min-w-[36px] h-9 flex items-center justify-center text-sm rounded-lg transition-colors ${
              page === currentPage
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {page}
          </Link>
        )
      )}

      <Link
        href={createPageUrl(Math.min(totalPages, currentPage + 1))}
        className={`p-2 rounded-lg transition-colors ${
          currentPage === totalPages
            ? "text-muted-foreground/30 pointer-events-none"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        }`}
        aria-disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
