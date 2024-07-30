"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import logo from "@/public/logo.png";
import mainImage from "@/public/signUpPageImg.svg";
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast({
          title: "Login Failed",
          description: "Incorrect username or password",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    }

    if (result?.url) {
      router.replace("/");
    }
  };

  return (
    <div className="flex md:justify-center items-center min-h-screen bg-black gap-5 flex-col md:flex-row">
      <div className="w-full max-w-md space-y-8 bg-white rounded-lg shadow-md hidden md:block">
        <Image
          src={mainImage}
          alt=""
          width={100}
          height={100}
          className=" w-full h-full rounded-lg"
        />
      </div>
      <Link href={"/"}>
        <Image
          src={logo}
          alt=""
          width={100}
          height={100}
          className=" md:hidden w-52"
        ></Image>
      </Link>
      <div className="w-full max-w-md p-8 md:space-y-8 bg-black text-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Login
          </h1>
          <p className="mb-4">
            Enter your email below to login to your account
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input {...field} className="bg-black text-white" />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                      className="bg-black text-white pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer"
                    >
                      {showPassword ? (
                        <span>👁️</span> // Eye icon to show password
                      ) : (
                        <span>👁️‍🗨️</span> // Eye icon with a line through it to hide password
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit">
              Sign In
            </Button>
          </form>
        </Form>
        <div className=" flex justify-center">
          <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800">
            Forgot Password?
          </Link>
        </div>
        <div className="text-center mt-4">
          <div></div>
          <p>
            Not a member yet?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
