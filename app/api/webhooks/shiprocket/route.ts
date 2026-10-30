import { NextRequest, NextResponse } from "next/server";
import { updateShippingStatusFromWebhook } from "@/lib/services/shipping.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Shiprocket sends payload with awb and current_status
    const awb = body.awb || body.awb_code || body.shipment_track?.[0]?.awb_code;
    const status =
      body.current_status ||
      body.shipment_status ||
      body.status ||
      body.shipment_track?.[0]?.current_status;

    if (!awb || !status) {
      return NextResponse.json(
        { success: false, error: "Missing AWB or status in payload" },
        { status: 400 }
      );
    }

    console.log(`📦 [SHIPROCKET WEBHOOK] AWB: ${awb}, Status: ${status}`);

    const updated = await updateShippingStatusFromWebhook(awb, status);

    return NextResponse.json({
      success: true,
      message: "Shipping status updated successfully",
      updated,
    });
  } catch (error: unknown) {
    console.error("Error processing Shiprocket webhook:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
