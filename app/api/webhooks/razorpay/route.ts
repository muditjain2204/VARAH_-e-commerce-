import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "webhook_secret_placeholder";
  const signature = req.headers.get("x-razorpay-signature");

  const rawBody = await req.text();

  if (secret !== "webhook_secret_placeholder" && signature) {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  }

  try {
    const event = JSON.parse(rawBody);

    if (event.event === "order.paid" || event.event === "payment.captured") {
      const paymentEntity = event.payload?.payment?.entity;
      const rzpOrderId = paymentEntity?.order_id;
      const rzpPaymentId = paymentEntity?.id;

      if (rzpOrderId) {
        const paymentRecord = await prisma.payment.findUnique({
          where: { razorpayOrderId: rzpOrderId },
        });

        if (paymentRecord) {
          await prisma.$transaction([
            prisma.payment.update({
              where: { id: paymentRecord.id },
              data: {
                status: "CAPTURED",
                razorpayPaymentId: rzpPaymentId,
              },
            }),
            prisma.order.update({
              where: { id: paymentRecord.orderId },
              data: {
                status: "CONFIRMED",
              },
            }),
          ]);
        }
      }
    } else if (event.event === "payment.failed") {
      const paymentEntity = event.payload?.payment?.entity;
      const rzpOrderId = paymentEntity?.order_id;

      if (rzpOrderId) {
        await prisma.payment.updateMany({
          where: { razorpayOrderId: rzpOrderId },
          data: {
            status: "FAILED",
            failureReason: paymentEntity?.error_description || "Payment failed",
          },
        });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
