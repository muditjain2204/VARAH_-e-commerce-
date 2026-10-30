import Razorpay from "razorpay";
import crypto from "crypto";

const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder";
const key_secret = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret";

export const razorpay = new Razorpay({
  key_id,
  key_secret,
});

/**
 * Verify Razorpay payment signature from client checkout modal.
 */
export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
  secret = key_secret,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
  secret?: string;
}): boolean {
  try {
    const text = `${orderId}|${paymentId}`;
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(text)
      .digest("hex");

    return generatedSignature === signature;
  } catch (error) {
    console.error("Error verifying Razorpay signature:", error);
    return false;
  }
}
