"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ConsumptionMethod } from "@prisma/client";
import { loadStripe } from "@stripe/stripe-js";
import { Loader2Icon } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { createOrder } from "../actions/create-order";
import { createStripeCheckout } from "../actions/create-stripe-checkout";
import { CartContext } from "../contexts/cart";

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Name is required.",
  }),
});

type FormSchema = z.infer<typeof formSchema>;

interface FinishOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FinishOrderDialog = ({ open, onOpenChange }: FinishOrderDialogProps) => {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useContext(CartContext);
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
    shouldUnregister: true,
  });
  const onSubmit = async (data: FormSchema) => {
    try {
      setIsLoading(true);
      const consumptionMethod = searchParams.get(
        "consumptionMethod",
      ) as ConsumptionMethod;

      const order = await createOrder({
        consumptionMethod,
        customerName: data.name,
        products,
        slug,
      });
      const { sessionId } = await createStripeCheckout({
        products,
        orderId: order.id,
        slug,
        consumptionMethod,
      });
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) return;
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
      );
      stripe?.redirectToCheckout({
        sessionId: sessionId,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Complete Order</DrawerTitle>
          <DrawerDescription>
            Enter your information below to complete your order.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DrawerFooter>
                <Button
                  type="submit"
                  variant="destructive"
                  className="rounded-full"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2Icon className="animate-spin" />}
                  Complete Order
                </Button>
                <DrawerClose asChild>
                  <Button className="w-full rounded-full" variant="outline">
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FinishOrderDialog;