import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json({ message: "Webhook secret not set" }, { status: 500 });
    }

    const rawBody = await request.text();
    const signature = request.headers.get("x-signature");

    if (!signature) {
      return NextResponse.json({ message: "Missing signature" }, { status: 400 });
    }

    const hmac = crypto.createHmac("sha256", secret);
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signatureBuffer = Buffer.from(signature, "utf8");

    if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const customData = payload.meta.custom_data; 

    if (eventName === "order_created" || eventName === "subscription_payment_success") {
      const userId = customData?.user_id;
      
      const variantId = payload.data.attributes.variant_id || payload.data.attributes.first_order_item?.variant_id;
      const seriesQuantity = payload.data.attributes.first_order_item?.quantity || payload.data.attributes.quantity || 1;

      if (userId) {
        let baseCredits = 500; 
        let newPlan = "HOBBY";

        // Map Monthly & Yearly Variant IDs
        // Daily Variants: Monthly (1389874) | Yearly (1408356)
        if (variantId == 1389874 || variantId == 1408356 || variantId === "1389874" || variantId === "1408356") {
          baseCredits = 2000;
          newPlan = "DAILY";
        } 
        // Pro Variants: Monthly (1389882) | Yearly (1408360)
        else if (variantId == 1389882 || variantId == 1408360 || variantId === "1389882" || variantId === "1408360") {
          baseCredits = 5000;
          newPlan = "PRO";
        }
        // Hobby Variants: Monthly (1389864) | Yearly (1408350) covers default

        const totalCreditsToAdd = baseCredits * seriesQuantity;

        await prisma.user.update({
          where: { id: userId },
          data: { 
            plan: newPlan as any,
            creditBalance: {
              upsert: {
                update: { amount: { increment: totalCreditsToAdd } },
                create: { amount: totalCreditsToAdd }
              }
            }
          }
        });
        
        console.log(`Successfully added ${totalCreditsToAdd} credits to user ${userId} for ${seriesQuantity} series (${newPlan})`);
      }
    }

    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });
    
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ message: "Webhook handler failed" }, { status: 500 });
  }
}