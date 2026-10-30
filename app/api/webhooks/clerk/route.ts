import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify the webhook signature
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as unknown as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }

  const eventType = evt.type;

  // Handle user.created
  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    const primaryEmail = email_addresses?.[0]?.email_address;
    if (!primaryEmail) {
      return NextResponse.json(
        { error: "No email address found" },
        { status: 400 }
      );
    }

    await prisma.user.create({
      data: {
        clerkId: id,
        email: primaryEmail,
        firstName: first_name || null,
        lastName: last_name || null,
        avatar: image_url || null,
      },
    });

    console.log(`[Clerk Webhook] User created: ${id}`);
  }

  // Handle user.updated
  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    const primaryEmail = email_addresses?.[0]?.email_address;

    await prisma.user.upsert({
      where: { clerkId: id },
      update: {
        email: primaryEmail || undefined,
        firstName: first_name || null,
        lastName: last_name || null,
        avatar: image_url || null,
      },
      create: {
        clerkId: id,
        email: primaryEmail || "",
        firstName: first_name || null,
        lastName: last_name || null,
        avatar: image_url || null,
      },
    });

    console.log(`[Clerk Webhook] User updated: ${id}`);
  }

  // Handle user.deleted
  if (eventType === "user.deleted") {
    const { id } = evt.data;

    if (id) {
      await prisma.user.delete({
        where: { clerkId: id },
      }).catch(() => {
        // User might not exist in our DB yet
        console.log(`[Clerk Webhook] User not found for deletion: ${id}`);
      });

      console.log(`[Clerk Webhook] User deleted: ${id}`);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
