import Image from "next/image";
import { notFound } from "next/navigation";

import { db } from "@/lib/prisma";

import ConsumptionMethodOption from "./components/consumption-method-option";

interface RestaurantPageProps {
  params: Promise<{ slug: string }>;
}

const RestaurantPage = async ({ params }: RestaurantPageProps) => {
  const { slug } = await params;
  const restaurant = await db.restaurant.findUnique({ where: { slug } });
  if (!restaurant) {
    return notFound();
  }
  return (
    <div className="flex h-screen flex-col items-center justify-center px-6 pt-24">
      {/* LOGO E TITULO */}
      <div className="flex flex-col items-center gap-2">
        <Image
          src={restaurant.avatarImageUrl}
          alt={restaurant.name}
          width={82}
          height={82}
        />
        <h2 className="font-semibold">{restaurant.name}</h2>
      </div>
      {/* WELCOME */}
      <div className="space-y-2 pt-24 text-center">
        <h3 className="text-2xl font-semibold">Welcome!</h3>
        <p className="opacity-55">
          Choose how you prefer to enjoy your meal. We are here to
          offer convenience and flavor in every detail!
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-14">
        <ConsumptionMethodOption
          slug={slug}
          option="DINE_IN"
          buttonText="Dine In"
          imageAlt="Dine In"
          imageUrl="/dine_in.png"
        />
        <ConsumptionMethodOption
          slug={slug}
          option="TAKEAWAY"
          buttonText="Takeaway"
          imageAlt="Takeaway"
          imageUrl="/takeaway.png"
        />
      </div>
    </div>
  );
};

export default RestaurantPage;