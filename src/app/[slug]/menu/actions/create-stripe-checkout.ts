"use server";

import { ConsumptionMethod } from "@prisma/client";
import { headers } from "next/headers";
import Stripe from "stripe";

import { db } from "@/lib/prisma";

import { CartProduct } from "../contexts/cart";

interface CreateStripeCheckoutInput {
  products: CartProduct[];
  orderId: number;
  slug: string;
  consumptionMethod: ConsumptionMethod;
}

export const createStripeCheckout = async ({
  orderId,
  products,
  slug,
  consumptionMethod,
}: CreateStripeCheckoutInput) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing Stripe secret key");
  }
  const origin = (await headers()).get("origin") as string;
  const productsWithPrices = await db.product.findMany({
    where: {
      id: {
        in: products.map((product) => product.id),
      },
    },
  });
  // Get the order to retrieve customer name
  const order = await db.order.findUnique({
    where: { id: orderId },
    select: { customerName: true },
  });
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
  });
  const searchParams = new URLSearchParams();
  searchParams.set("consumptionMethod", consumptionMethod);
  if (order?.customerName) {
    searchParams.set("name", encodeURIComponent(order.customerName));
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${origin}/${slug}/orders?${searchParams.toString()}`,
    cancel_url: `${origin}/${slug}/orders?${searchParams.toString()}`,
    metadata: {
      orderId: String(orderId),
    },
    line_items: products.map((product) => ({
      price_data: {
        currency: "nzd",
        product_data: {
          name: product.name,
          images: [product.imageUrl],
        },
        unit_amount: Math.round(
          productsWithPrices.find((p) => p.id === product.id)!.price * 100
        ),
      },
      quantity: product.quantity,
    })),
  });
  return { sessionId: session.id };
};