"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
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

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, {
      message: "Name is required.",
    }),
});

type FormSchema = z.infer<typeof formSchema>;

const NameForm = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });
  const router = useRouter();
  const pathname = usePathname();
  const onSubmit = (data: FormSchema) => {
    router.replace(`${pathname}?name=${encodeURIComponent(data.name.trim())}`);
  };
  const handleCancel = () => {
    router.back();
  };
  return (
    <Drawer open>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>View Orders</DrawerTitle>
          <DrawerDescription>
            Enter your name below to view your orders.
          </DrawerDescription>
        </DrawerHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="px-4">
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DrawerFooter>
              <Button variant="destructive" className="w-full rounded-full">
                Confirm
              </Button>
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};

export default NameForm;