"use server";

import { cookies } from "next/headers";
import { sendAdminOtp, verifyAdminOtp, DEFAULT_ADMIN_PHONE } from "@/lib/services/admin-auth.service";
import type { ActionResponse } from "@/types";

const ADMIN_COOKIE_NAME = "varah_admin_session";

export async function requestAdminOtpAction(phone: string): Promise<
  ActionResponse<{
    message: string;
    otp?: string;
  }>
> {
  try {
    const result = await sendAdminOtp(phone);
    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to send OTP",
      };
    }

    return {
      success: true,
      data: {
        message: result.message,
        otp: result.otp,
      },
    };
  } catch (error: unknown) {
    console.error("requestAdminOtpAction error:", error);
    return {
      success: false,
      error: "Error processing OTP request",
    };
  }
}

export async function verifyAdminOtpAction(
  phone: string,
  otp: string
): Promise<ActionResponse<{ success: boolean; token: string }>> {
  try {
    const result = await verifyAdminOtp(phone, otp);
    if (!result.success || !result.token) {
      return {
        success: false,
        error: result.error || "Verification failed",
      };
    }

    // Set secure admin session cookie (valid for 24 hours)
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return {
      success: true,
      data: { success: true, token: result.token },
    };
  } catch (error: unknown) {
    console.error("verifyAdminOtpAction error:", error);
    return {
      success: false,
      error: "Error verifying OTP",
    };
  }
}

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

export async function checkAdminSessionAction(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_COOKIE_NAME);
    return !!session?.value;
  } catch {
    return false;
  }
}

export async function getDefaultAdminPhoneAction(): Promise<string> {
  return DEFAULT_ADMIN_PHONE;
}
