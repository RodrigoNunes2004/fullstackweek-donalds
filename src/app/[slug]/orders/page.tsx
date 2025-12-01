import { db } from "@/lib/prisma";

import NameForm from "./components/cpf-form";
import OrderList from "./components/order-list";

interface OrdersPageProps {
  searchParams: Promise<{ name: string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

const OrdersPage = async ({ searchParams }: OrdersPageProps) => {
  const { name } = await searchParams;
  if (!name || name.trim() === "") {
    return <NameForm />;
  }
  const decodedName = decodeURIComponent(name.trim());
  const orders = await db.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      customerName: {
        equals: decodedName,
        mode: "insensitive",
      },
    },
    include: {
      restaurant: {
        select: {
          name: true,
          avatarImageUrl: true,
        },
      },
      orderProducts: {
        include: {
          product: true,
        },
      },
    },
  });
  return <OrderList orders={orders} />;
};

export default OrdersPage;