import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

// This is a test endpoint to manually update order status
// Only use this for development/testing
export async function POST(request: Request) {
  try {
    const { orderId, status } = await request.json();
    
    if (!orderId || !status) {
      return NextResponse.json(
        { error: "orderId and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["PENDING", "PAYMENT_CONFIRMED", "PAYMENT_FAILED", "IN_PREPARATION", "FINISHED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const order = await db.order.update({
      where: { id: parseInt(String(orderId), 10) },
      data: { status: status as any },
      include: {
        restaurant: {
          select: { slug: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        restaurant: order.restaurant.slug,
      },
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

