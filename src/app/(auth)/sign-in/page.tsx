"use client";

import Image from "next/image";
import Link from "next/link";
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
import { Eye, EyeOff } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const signUpFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function SignIn() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState({
    password: "password",
  });
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof signUpFormSchema>) {
    await authClient.signIn.email(
      {
        email: formData.email,
        password: formData.password,
      },
      {
        onRequest: () => {
          //show loading
        },
        onSuccess: () => {
          router.push("/");
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      },
    );
  }

  function toggleShowPassword(key: keyof typeof showPassword) {
    setShowPassword((prev) => ({
      ...prev,
      [key]: prev[key] === "password" ? "text" : "password",
    }));
  }

  return (
    <div className=" flex justify-center items-center h-screen">
      <main className="border-none md:border rounded-lg w-full max-w-4xl p-4 flex flex-col md:flex-row gap-2">
        <div className="flex-1">
          <h1>Admin EE</h1>
          <p>Welcome back</p>
          <Image
            src="/images/learning.svg"
            alt="logo"
            width={200}
            height={200}
          />
        </div>
        <div className="flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showPassword["password"]} {...field} />
                        <button
                          onClick={() => toggleShowPassword("password")}
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground"
                        >
                          {showPassword["password"] === "password" ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Login</Button>
              <p className="text-center">
                Don&apos;t have an account yet?{" "}
                <Link href="/sign-up">Register</Link>?{" "}
              </p>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}