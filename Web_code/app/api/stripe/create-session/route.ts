import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe only if the secret key is available
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-07-30.basil",
  });
};

export async function POST(request: NextRequest) {
  // Check if Stripe secret key is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY is not configured");
    return NextResponse.json(
      { success: false, error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const {
      reservationId,
      amount,
      currency,
      listingId,
      userId,
      startDate,
      endDate,
      description,
      customerEmail,
    } = body;

    // Validate required fields
    if (!amount || !description) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: amount and description are required",
        },
        { status: 400 }
      );
    }

    // Generate a temporary reservation ID if not provided
    const finalReservationId =
      reservationId ||
      `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create Stripe checkout session
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency || "usd",
            product_data: {
              name: description,
              description: `Reservation ID: ${finalReservationId}`,
              metadata: {
                listingId: listingId,
                userId: userId,
                startDate: startDate,
                endDate: endDate,
              },
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${
        process.env.NEXT_PUBLIC_APP_URL
      }/payment/success?session_id={CHECKOUT_SESSION_ID}&timestamp=${Date.now()}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
      customer_email: customerEmail,
      // ✅ إضافة إعدادات لمنع التوجيه المزدوج
      allow_promotion_codes: false,
      billing_address_collection: "auto",
      metadata: {
        reservationId: finalReservationId,
        amount: amount.toString(),
        currency: currency || "usd",
        listingId: listingId,
        userId: userId,
        startDate: startDate,
        endDate: endDate,
        totalPrice: amount.toString(),
        timestamp: Date.now().toString(), // إضافة timestamp لمنع التكرار
      },
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
      message: "Stripe checkout session created successfully",
    });
  } catch (error) {
    console.error("Stripe payment error:", error);

    // Handle specific Stripe errors
    let errorMessage = "Failed to create Stripe checkout session";

    if (error instanceof Error) {
      if (error.message.includes("Invalid API key")) {
        errorMessage = "Invalid Stripe API key";
      } else if (error.message.includes("amount")) {
        errorMessage = "Invalid amount value";
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
