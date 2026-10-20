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
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("Missing STRIPE_SECRET_KEY environment variable");
      throw new Error("Missing Stripe secret key");
    }

    const origin = (await headers()).get("origin") as string;
    if (!origin) {
      console.error("Missing origin header");
      throw new Error("Missing origin header");
    }

    const productsWithPrices = await db.product.findMany({
      where: {
        id: {
          in: products.map((product) => product.id),
        },
      },
    });

    if (productsWithPrices.length !== products.length) {
      console.error("Some products not found in database", {
        requested: products.map((p) => p.id),
        found: productsWithPrices.map((p) => p.id),
      });
      throw new Error("Some products not found");
    }

    // Get the order to retrieve customer name
    const order = await db.order.findUnique({
      where: { id: orderId },
      select: { customerName: true },
    });

    if (!order) {
      console.error("Order not found", { orderId });
      throw new Error("Order not found");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    });

    const searchParams = new URLSearchParams();
    searchParams.set("consumptionMethod", consumptionMethod);
    if (order.customerName) {
      searchParams.set("name", encodeURIComponent(order.customerName));
    }

    const lineItems = products.map((product) => {
      const productWithPrice = productsWithPrices.find((p) => p.id === product.id);
      if (!productWithPrice) {
        throw new Error(`Product ${product.id} not found with price`);
      }
      return {
        price_data: {
          currency: "nzd",
          product_data: {
            name: product.name,
            images: [product.imageUrl],
          },
          unit_amount: Math.round(productWithPrice.price * 100),
        },
        quantity: product.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${origin}/${slug}/orders?${searchParams.toString()}`,
      cancel_url: `${origin}/${slug}/orders?${searchParams.toString()}`,
      metadata: {
        orderId: String(orderId),
      },
      line_items: lineItems,
    });

    return { sessionId: session.id };
  } catch (error) {
    console.error("Error creating Stripe checkout:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to create checkout: ${error.message}`);
    }
    throw error;
  }
};