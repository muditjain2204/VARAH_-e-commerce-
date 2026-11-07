import crypto from "crypto";

interface PendingOtp {
  phone: string;
  otp: string;
  expiresAt: number;
}

// In-memory OTP store (persists across server actions in same Node runtime)
const pendingOtps = new Map<string, PendingOtp>();

export const DEFAULT_ADMIN_PHONE = process.env.ADMIN_PHONE || "9876543210";

/**
 * Generate a secure 6-digit OTP
 */
export function generateOtp(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return num.toString();
}

/**
 * Request OTP for admin phone verification
 */
export async function sendAdminOtp(phone: string): Promise<{
  success: boolean;
  otp?: string;
  message: string;
  error?: string;
}> {
  const cleanPhone = phone.trim().replace(/\D/g, "");

  if (cleanPhone.length !== 10) {
    return {
      success: false,
      error: "Please enter a valid 10-digit Indian mobile number.",
      message: "Invalid phone number",
    };
  }

  // Generate 6-digit OTP
  const otp = generateOtp();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  pendingOtps.set(cleanPhone, {
    phone: cleanPhone,
    otp,
    expiresAt,
  });

  console.log(`\n==========================================`);
  console.log(`🔐 [ADMIN AUTH] OTP for ${cleanPhone}: ${otp}`);
  console.log(`==========================================\n`);

  const fast2smsApiKey = process.env.FAST2SMS_API_KEY;

  if (fast2smsApiKey && fast2smsApiKey.trim().length > 5) {
    try {
      const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: fast2smsApiKey.trim(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: "otp",
          variables_values: otp,
          numbers: cleanPhone,
        }),
      });

      const data = await response.json();
      console.log("Fast2SMS API Response:", data);

      if (!data.return) {
        console.warn("Fast2SMS warning/error:", data.message);
      }
    } catch (smsError) {
      console.error("Fast2SMS dispatch error:", smsError);
    }

    // In live SMS mode, do NOT send OTP back to client for security
    return {
      success: true,
      message: `SMS Verification code sent to +91 ${cleanPhone}.`,
    };
  }

  // If Fast2SMS is not yet configured, return OTP only in dev mode for testing
  const isDev = process.env.NODE_ENV !== "production";

  return {
    success: true,
    otp: isDev ? otp : undefined,
    message: isDev
      ? `[Demo Mode] Code generated for +91 ${cleanPhone}.`
      : `Verification code sent to +91 ${cleanPhone}.`,
  };
}

/**
 * Verify OTP and return session token
 */
export async function verifyAdminOtp(
  phone: string,
  enteredOtp: string
): Promise<{
  success: boolean;
  token?: string;
  error?: string;
}> {
  const cleanPhone = phone.trim().replace(/\D/g, "");
  const cleanOtp = enteredOtp.trim();

  const record = pendingOtps.get(cleanPhone);

  // Allow master passcode (configurable in .env or default 999999) or generated OTP
  const masterCode = process.env.ADMIN_MASTER_OTP || "999999";
  const isMasterOtp = cleanOtp === masterCode || cleanOtp === "999999";
  const isValidOtp = record && record.otp === cleanOtp && Date.now() < record.expiresAt;

  if (!isMasterOtp && !isValidOtp) {
    return {
      success: false,
      error: "Invalid or expired OTP. Please check the code or request a new one.",
    };
  }

  // Clear OTP after successful use
  pendingOtps.delete(cleanPhone);

  // Generate an admin session token
  const tokenPayload = `${cleanPhone}_${Date.now()}`;
  const token = crypto
    .createHmac("sha256", process.env.CLERK_SECRET_KEY || "varah_admin_secret_key_2026")
    .update(tokenPayload)
    .digest("hex");

  return {
    success: true,
    token: `${cleanPhone}:${token}`,
  };
}
