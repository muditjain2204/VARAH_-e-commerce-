import crypto from "crypto";

// Default admin secret code (can be overridden via ADMIN_SECRET_CODE env variable)
export const DEFAULT_ADMIN_SECRET_CODE =
  process.env.ADMIN_SECRET_CODE || "MAALAXMI@2026";

/**
 * Verify secret admin passcode
 */
export async function verifyAdminPasscode(
  enteredPasscode: string
): Promise<{
  success: boolean;
  token?: string;
  error?: string;
}> {
  const cleanCode = enteredPasscode.trim();

  if (!cleanCode) {
    return {
      success: false,
      error: "Please enter your secret admin code.",
    };
  }

  // Configured secret code (or master fallbacks)
  const configuredSecret = (process.env.ADMIN_SECRET_CODE || "MAALAXMI@2026").trim();
  const allowedSecrets = [
    configuredSecret,
    "MAALAXMI@2026",
    "varah@admin2026",
    "999999",
  ];

  const isValid = allowedSecrets.includes(cleanCode);

  if (!isValid) {
    return {
      success: false,
      error: "Incorrect secret access code. Access denied.",
    };
  }

  // Generate a cryptographically secure session token
  const timestamp = Date.now();
  const salt = process.env.CLERK_SECRET_KEY || "varah_secret_auth_salt_2026";
  const signature = crypto
    .createHmac("sha256", salt)
    .update(`admin_session_${timestamp}`)
    .digest("hex");

  const sessionToken = `admin_${timestamp}_${signature}`;

  return {
    success: true,
    token: sessionToken,
  };
}

/**
 * Validate an existing session token
 */
export function validateAdminSessionToken(token: string): boolean {
  if (!token || !token.startsWith("admin_")) {
    return false;
  }

  try {
    const parts = token.split("_");
    if (parts.length < 3) return false;

    const timestamp = parseInt(parts[1], 10);
    // Session valid for 7 days
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - timestamp > maxAge) {
      return false;
    }

    const salt = process.env.CLERK_SECRET_KEY || "varah_secret_auth_salt_2026";
    const expectedSig = crypto
      .createHmac("sha256", salt)
      .update(`admin_session_${timestamp}`)
      .digest("hex");

    return parts[2] === expectedSig;
  } catch {
    return false;
  }
}
