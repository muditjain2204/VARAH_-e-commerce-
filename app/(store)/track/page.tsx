import { Suspense } from "react";
import type { Metadata } from "next";
import { PublicTracker } from "@/components/store/public-tracker";
import { RotateCw } from "lucide-react";

export const metadata: Metadata = {
  title: "Track Your Saree Delivery | MAA LAXMI",
  description:
    "Track live shipment milestones for your handcrafted Indian saree order. View real-time courier updates, AWB tracking, and delivery timelines.",
};

export default function TrackOrderPage() {
  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      <Suspense
        fallback={
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <RotateCw className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm">Connecting to logistics tracking network...</p>
          </div>
        }
      >
        <PublicTracker />
      </Suspense>
    </div>
  );
}

