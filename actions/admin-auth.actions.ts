"use server";

import { cookies } from "next/headers";
import {
  verifyAdminPasscode,
  validateAdminSessionToken,
} from "@/lib/services/admin-auth.service";
import type { ActionResponse } from "@/types";

const ADMIN_COOKIE_NAME = "varah_admin_session";

/**
 * Verify secret admin passcode and create session cookie
 */
export async function verifyAdminPasscodeAction(
  passcode: string
): Promise<ActionResponse<{ success: boolean; token: string }>> {
  try {
    const result = await verifyAdminPasscode(passcode);
    if (!result.success || !result.token) {
      return {
        success: false,
        error: result.error || "Incorrect secret access code.",
      };
    }

    // Set secure admin session cookie (valid for 7 days)
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return {
      success: true,
      data: { success: true, token: result.token },
    };
  } catch (error: unknown) {
    console.error("verifyAdminPasscodeAction error:", error);
    return {
      success: false,
      error: "Error verifying admin code",
    };
  }
}

/**
 * Exit admin mode / lock admin portal
 */
export async function exitAdminModeAction(): Promise<ActionResponse<boolean>> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_COOKIE_NAME);
    return { success: true, data: true };
  } catch (error: unknown) {
    console.error("exitAdminModeAction error:", error);
    return { success: false, error: "Failed to exit admin mode" };
  }
}

/**
 * Check if current user has an active admin session
 */
export async function checkAdminSessionAction(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_COOKIE_NAME);
    if (!session?.value) return false;
    return validateAdminSessionToken(session.value);
  } catch {
    return false;
  }
}

// Backward compatibility stubs
export async function requestAdminOtpAction(): Promise<
  ActionResponse<{ message: string; otp?: string }>
> {
  return {
    success: true,
    data: { message: "Secret code authentication active." },
  };
}

export async function verifyAdminOtpAction(
  _phone: string,
  passcode: string
): Promise<ActionResponse<{ success: boolean; token: string }>> {
  return verifyAdminPasscodeAction(passcode);
}
