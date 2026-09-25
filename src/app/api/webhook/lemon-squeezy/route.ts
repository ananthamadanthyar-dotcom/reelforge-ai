import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // 1. Get your secret from the .env file
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json({ message: "Webhook secret not set" }, { status: 500 });
    }

    // 2. Get the raw text body (required for cryptographic verification)
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature");

    if (!signature) {
      return NextResponse.json({ message: "Missing signature" }, { status: 400 });
    }

    // 3. Create our own hash to compare against Lemon Squeezy's hash
    const hmac = crypto.createHmac("sha256", secret);
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signatureBuffer = Buffer.from(signature, "utf8");

    // Prevent timing attacks and crashes by comparing lengths first
    if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
    }

    // 4. If we reach here, the request is 100% authentically from Lemon Squeezy!
    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const customData = payload.meta.custom_data; // This holds our user_id!

    // 5. Handle successful payments
    if (eventName === "order_created" || eventName === "subscription_payment_success") {
      const userId = customData?.user_id;
      
      // Lemon Squeezy hides the variant_id in different places depending on if it's a subscription or order
      const variantId = payload.data.attributes.variant_id || payload.data.attributes.first_order_item?.variant_id;

      if (userId) {
        // Map the variant they bought to the credits they deserve
        let creditsToAdd = 500; // Default to Creator plan
        let newPlan = "CREATOR";

        if (variantId === "pro_variant_456" || variantId == 456) {
          creditsToAdd = 2000;
          newPlan = "PRO";
        } else if (variantId === "business_variant_789" || variantId == 789) {
          creditsToAdd = 5000;
          newPlan = "BUSINESS";
        }

        // Add the credits and update their plan level simultaneously!
        await prisma.user.update({
          where: { id: userId },
          data: { 
            plan: newPlan as any,
            creditBalance: {
              upsert: {
                update: { amount: { increment: creditsToAdd } },
                create: { amount: creditsToAdd }
              }
            }
          }
        });
        
        console.log(`Successfully added ${creditsToAdd} credits to user ${userId}`);
      }
    }

    // 6. Tell Lemon Squeezy we received it successfully so they don't retry
    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });
    
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ message: "Webhook handler failed" }, { status: 500 });
  }
}