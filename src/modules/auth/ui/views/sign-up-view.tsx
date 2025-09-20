"use client";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { OctagonAlertIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { FaGithub, FaGoogle} from "react-icons/fa";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { use, useState } from "react";

const formSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email(),
    password: z.string().min(1, { message: "Password is required" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const SignUpView = () => {
  const router= useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);

    const { error } = await authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setPending(false);
          router.push("/");
        },
        onError: ({ error }) => {
          setError(error.message);
        },
      }
    );
  };

  const onSocial = (provider: "github" | "google") => {
    setError(null);
    setPending(true);

    authClient.signIn.social({
      provider: provider,
      callbackURL: "/"
    },
      {
        onSuccess: () => {
          setPending(false);
        },
        onError: ({ error }) => {
          setError(error.message);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6 md:p-8 flex flex-col justify-center min-h-full"
            >
              <div className="flex flex-col gap-6 max-w-sm mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col items-center text-center gap-2 mb-4">
                  <h1 className="text-2xl font-bold">Let&apos;s Get Started</h1>
                  <p className="text-muted-foreground text-balance">
                    Create your account
                  </p>
                </div>

                {/* Form Fields */}
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Your name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
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
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Error Alert */}
                {!!error && (
                  <Alert className="bg-destructive/10 border-destructive/20">
                    <OctagonAlertIcon className="h-4 w-4 text-destructive" />
                    <AlertTitle className="text-destructive">
                      {error}
                    </AlertTitle>
                  </Alert>
                )}

                {/* Sign Up Button */}
                <Button
                  disabled={pending}
                  type="submit"
                  className="w-full mt-2"
                >
                  Sign Up
                </Button>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                  disabled={pending}
                  onClick={() => onSocial("google")}
                    variant="outline"
                    type="button"
                    className="w-full"
                  >
                    <FaGoogle/>
                  </Button>
                  <Button
                
                    onClick={()=> onSocial("github")}
                    disabled={pending}
                    variant="outline"
                    type="button"
                    className="w-full"
                  >
                    <FaGithub/>
                  </Button>
                </div>

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="underline underline-offset-4"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </form>
          </Form>

          <div className="relative hidden md:flex flex-col gap-y-6 items-center justify-center bg-gradient-to-br from-green-500 to-green-900 p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <img src="/logo.svg" alt="Meet.AI Logo" className="h-16 w-16" />
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Meet.AI</h2>
                <p className="text-white/80 text-lg">
                  Connect. Collaborate. Create.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div
        className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs 
      text-balance *:[a]:underline *:[a]:underline-offset-4"
      >
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#"> privacy policy</a>
      </div>
    </div>
  );
};