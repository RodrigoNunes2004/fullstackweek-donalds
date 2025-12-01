import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing Stripe secret key");
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
  });

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.error();
  }
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY;
  if (!webhookSecret) {
    throw new Error("Missing Stripe webhook secret key");
  }
  const text = await request.text();
  const event = stripe.webhooks.constructEvent(text, signature, webhookSecret);

  if (event.type === "checkout.session.completed") {
    const orderId = event.data.object.metadata?.orderId;
    if (!orderId) {
      console.error("No orderId in metadata for checkout.session.completed");
      return NextResponse.json({
        received: true,
        error: "No orderId in metadata",
      });
    }
    try {
      const parsedOrderId = parseInt(String(orderId), 10);
      if (isNaN(parsedOrderId)) {
        throw new Error(`Invalid orderId: ${orderId}`);
      }
      const order = await db.order.update({
        where: {
          id: parsedOrderId,
        },
        data: {
          status: "PAYMENT_CONFIRMED",
        },
        include: {
          restaurant: {
            select: {
              slug: true,
            },
          },
        },
      });
      // Revalidate the orders page - this will refresh all variations
      revalidatePath(`/${order.restaurant.slug}/orders`, "page");
      // Also revalidate the layout to ensure cache is cleared
      revalidatePath(`/${order.restaurant.slug}`, "layout");
      console.log(`Order ${parsedOrderId} updated to PAYMENT_CONFIRMED for restaurant ${order.restaurant.slug}`);
    } catch (error) {
      console.error(`Error updating order ${orderId}:`, error);
      return NextResponse.json({
        received: true,
        error: "Failed to update order",
      }, { status: 500 });
    }
  } else if (event.type === "charge.failed") {
    const orderId = event.data.object.metadata?.orderId;
    if (!orderId) {
      console.error("No orderId in metadata for charge.failed");
      return NextResponse.json({
        received: true,
        error: "No orderId in metadata",
      });
    }
    try {
      const parsedOrderId = parseInt(String(orderId), 10);
      if (isNaN(parsedOrderId)) {
        throw new Error(`Invalid orderId: ${orderId}`);
      }
      const order = await db.order.update({
        where: {
          id: parsedOrderId,
        },
        data: {
          status: "PAYMENT_FAILED",
        },
        include: {
          restaurant: {
            select: {
              slug: true,
            },
          },
        },
      });
      revalidatePath(`/${order.restaurant.slug}/orders`, "page");
      revalidatePath(`/${order.restaurant.slug}`, "layout");
      console.log(`Order ${parsedOrderId} updated to PAYMENT_FAILED for restaurant ${order.restaurant.slug}`);
    } catch (error) {
      console.error(`Error updating order ${orderId}:`, error);
      return NextResponse.json({
        received: true,
        error: "Failed to update order",
      }, { status: 500 });
    }
  }

  return NextResponse.json({
    received: true,
  });
}