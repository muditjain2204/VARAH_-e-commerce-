"use server";

import {
  createShipmentForOrder,
  updateShippingMilestone,
  getTrackingForOrder,
  searchPublicTracking,
  ShipmentDetails,
  CreateShipmentOptions,
} from "@/lib/services/shipping.service";
import { generateShippingLabel, ShiprocketTrackingResult } from "@/lib/shiprocket";
import { ShippingStatus } from "@prisma/client";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function createShipmentAction(
  orderId: string,
  options?: CreateShipmentOptions
): Promise<ActionResponse<ShipmentDetails>> {
  try {
    const result = await createShipmentForOrder(orderId, options);
    if (!result.success || !result.data) {
      return { success: false, error: result.error || "Failed to create shipment" };
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/account/orders/${orderId}`);
    revalidatePath("/track");

    return { success: true, data: result.data };
  } catch (error: unknown) {
    console.error("createShipmentAction error:", error);
    return { success: false, error: "Error initiating shipment" };
  }
}

export async function updateShippingMilestoneAction(
  orderId: string,
  newStatus: ShippingStatus
): Promise<ActionResponse<any>> {
  try {
    const result = await updateShippingMilestone(orderId, newStatus);
    if (!result.success) {
      return { success: false, error: result.error || "Failed to update milestone" };
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/account/orders/${orderId}`);
    revalidatePath("/track");

    return { success: true, data: result.data };
  } catch (error: unknown) {
    console.error("updateShippingMilestoneAction error:", error);
    return { success: false, error: "Error updating milestone" };
  }
}

export async function getTrackingAction(
  awbOrOrderId: string
): Promise<ActionResponse<ShiprocketTrackingResult>> {
  try {
    const tracking = await getTrackingForOrder(awbOrOrderId);
    return { success: true, data: tracking };
  } catch (error: unknown) {
    console.error("getTrackingAction error:", error);
    return { success: false, error: "Could not retrieve tracking details" };
  }
}

export async function getShippingLabelAction(
  shipmentId: string
): Promise<ActionResponse<{ label_url: string }>> {
  try {
    const label = await generateShippingLabel(shipmentId);
    return { success: true, data: label };
  } catch (error: unknown) {
    console.error("getShippingLabelAction error:", error);
    return { success: false, error: "Error generating shipping label" };
  }
}

export async function searchPublicTrackingAction(
  query: string
): Promise<ActionResponse<any>> {
  try {
    const result = await searchPublicTracking(query);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return { success: true, data: result.data };
  } catch (error: unknown) {
    console.error("searchPublicTrackingAction error:", error);
    return { success: false, error: "Error searching tracking" };
  }
}
