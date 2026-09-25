"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { lemonSqueezySetup, createCheckout } from "@lemonsqueezy/lemonsqueezy.js";

export async function createCheckoutSession(formData: FormData) {
  // 1. Ensure the user is securely logged in
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // 2. Get the specific plan they clicked on
  const variantId = formData.get("variantId") as string;
  let checkoutUrl = "/dashboard?payment=simulated"; // Fallback URL for our demo!

  try {
    // 3. Connect to Lemon Squeezy
    lemonSqueezySetup({ apiKey: process.env.LEMON_SQUEEZY_API_KEY || "dummy" });
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID || "dummy";

    // 4. Request a secure checkout link
    const checkout = await createCheckout(storeId, variantId, {
      checkoutOptions: { embed: false },
      checkoutData: {
        email: session.user.email || undefined,
        // VERY IMPORTANT: We attach the user ID so when they pay, 
        // the webhook knows exactly who gets the credits!
        custom: { user_id: session.user.id },
      },
    });

    if (checkout.data?.data.attributes.url) {
      checkoutUrl = checkout.data.data.attributes.url;
    }
  } catch (error) {
    // Since you don't have real API keys in your .env yet, the API will fail.
    // We catch the error here so we don't crash, allowing you to test the UI flow!
    console.log("Demo Mode: Using simulated checkout URL.");
  }

  // 5. Redirect the user to the checkout page
  // (In Next.js, redirect() must always be called OUTSIDE of a try/catch block)
  redirect(checkoutUrl);
}