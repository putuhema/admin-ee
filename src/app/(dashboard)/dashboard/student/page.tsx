"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { studentSchema } from "@/lib/zod-schema";

export default function StudentForm() {
  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      nickname: "",
      dateOfBirth: new Date(),
      joinDate: new Date(),
    },
  });

  async function onSubmit(formData: z.infer<typeof studentSchema>) {
    // do something
  }

  return (
    <div className=" flex justify-center items-center h-screen">
      <main className="border-none md:border rounded-lg w-full max-w-4xl p-4 flex flex-col md:flex-row gap-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Login</Button>
          </form>
        </Form>
      </main>
    </div>
  );
}
