"use client";

import { useState } from "react";
import {
  Truck,
  Package,
  MapPin,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  RotateCw,
  AlertCircle,
} from "lucide-react";
import { getTrackingAction } from "@/actions/shipping.actions";
import { toast } from "sonner";

interface RealtimeTrackingProps {
  orderId: string;
  orderNumber: string;
  initialAwb?: string | null;
  courierName?: string | null;
  initialStatus?: string;
  estimatedDelivery?: Date | string | null;
}

export function RealtimeTracking({
  orderId,
  orderNumber,
  initialAwb,
  courierName = "Delhivery Surface",
  initialStatus = "PICKUP_SCHEDULED",
  estimatedDelivery,
}: RealtimeTrackingProps) {
  const [awb, setAwb] = useState(initialAwb);
  const [courier, setCourier] = useState(courierName);
  const [status, setStatus] = useState(initialStatus);
  const [activities, setActivities] = useState<
    { date: string; activity: string; location: string; status: string }[]
  >([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasLoadedActivities, setHasLoadedActivities] = useState(false);

  const copyAwb = () => {
    if (!awb) return;
    navigator.clipboard.writeText(awb);
    toast.success("AWB Number copied to clipboard!");
  };

  const handleRefreshTracking = async () => {
    if (!awb && !orderId) return;
    setIsRefreshing(true);
    try {
      const res = await getTrackingAction(awb || orderId);
      if (res.success && res.data?.tracking_data) {
        const data = res.data.tracking_data;
        if (data.shipment_track?.[0]) {
          setCourier(data.shipment_track[0].courier_name || courier);
          setStatus(data.shipment_track[0].current_status || status);
        }
        if (data.shipment_track_activities) {
          setActivities(data.shipment_track_activities);
          setHasLoadedActivities(true);
        }
        toast.success("Tracking timeline updated!");
      } else {
        toast.error("Could not fetch latest tracking");
      }
    } catch {
      toast.error("Error connecting to courier tracking");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Determine milestone step
  const normalizedStatus = status.toUpperCase();
  const isDelivered = normalizedStatus.includes("DELIVERED");
  const isOutForDelivery = isDelivered || normalizedStatus.includes("OUT FOR DELIVERY");
  const isInTransit =
    isOutForDelivery ||
    normalizedStatus.includes("IN_TRANSIT") ||
    normalizedStatus.includes("TRANSIT") ||
    normalizedStatus.includes("PICKED");
  const isAwbAssigned = isInTransit || Boolean(awb) || normalizedStatus.includes("SCHEDULED");

  const milestones = [
    { label: "Order Placed", done: true },
    { label: "AWB Generated", done: isAwbAssigned },
    { label: "In Transit", done: isInTransit },
    { label: "Out for Delivery", done: isOutForDelivery },
    { label: "Delivered", done: isDelivered },
  ];

  return (
    <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">
              Live Courier Tracking
            </h3>
            <p className="text-xs text-muted-foreground">
              Handled by {courier || "Varah Express Logistics"}
            </p>
          </div>
        </div>

        <button
          onClick={handleRefreshTracking}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
        >
          <RotateCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
          <span>{isRefreshing ? "Updating..." : "Refresh"}</span>
        </button>
      </div>

      {/* AWB & Courier Info Pill */}
      {awb ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-muted/40 border border-border">
          <div>
            <p className="text-[11px] text-muted-foreground font-medium">Tracking Number (AWB)</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono font-bold text-sm text-foreground">{awb}</span>
              <button
                onClick={copyAwb}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                title="Copy AWB"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div>
            <p className="text-[11px] text-muted-foreground font-medium">Courier Partner</p>
            <p className="font-semibold text-sm text-foreground mt-1">{courier}</p>
          </div>

          <div>
            <p className="text-[11px] text-muted-foreground font-medium">Estimated Arrival</p>
            <p className="font-semibold text-sm text-emerald-600 mt-1">
              {estimatedDelivery
                ? new Intl.DateTimeFormat("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(estimatedDelivery))
                : "3-4 Business Days"}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <Clock className="h-4 w-4 flex-shrink-0 text-amber-600" />
          <span>Your saree is being carefully packed at our workshop. Courier AWB will appear shortly.</span>
        </div>
      )}

      {/* 5-Step Progress Stepper */}
      <div className="space-y-3 pt-2">
        <div className="grid grid-cols-5 gap-1 text-center">
          {milestones.map((m, idx) => (
            <div key={idx} className="space-y-2">
              <div className="relative flex items-center justify-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all ${
                    m.done
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {m.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
              </div>
              <p
                className={`text-[10px] sm:text-xs leading-tight font-medium ${
                  m.done ? "text-foreground font-semibold" : "text-muted-foreground"
                }`}
              >
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Tracking Activity Feed */}
      {activities.length > 0 && (
        <div className="pt-3 border-t border-border space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Activity Log
          </h4>
          <div className="space-y-2.5">
            {activities.map((act, index) => (
              <div
                key={index}
                className="flex items-start gap-3 text-xs p-2.5 rounded-lg bg-muted/20 border border-border/50"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{act.activity}</p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" />
                    <span>{act.location}</span>
                  </p>
                </div>
                <div className="text-[10px] text-muted-foreground text-right whitespace-nowrap">
                  {new Intl.DateTimeFormat("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(act.date))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {awb && (
        <div className="pt-2 flex justify-end">
          <a
            href={`https://shiprocket.co/tracking/${awb}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
          >
            <span>Open in Official Courier Portal</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  );
}
