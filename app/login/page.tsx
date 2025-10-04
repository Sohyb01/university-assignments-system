"use client";

import { useEffect, useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { redirectOnServer } from "@/app/actions/redirectOnServer";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(1, "Required").max(255, "Too long!"),
  password: z.string().min(1, "Required").max(255, "Too long!"),
});

export default function LoginPage() {
  useEffect(() => {
    // 1. Immediately clear any existing session cookie
    signOut({
      redirect: false, // → don't bounce anywhere yet
      callbackUrl: window.location.href, // → stay on this page
    });
  }, []);

  const [error, setError] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    setError(false);

    const res = await signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: false,
    });
    if (!res?.ok) {
      setError(true);
      setSubmitting(false);
    } else {
      const session = await fetch("/api/auth/session").then((res) =>
        res.json()
      );
      if (session?.user?.role) {
        redirectOnServer(`/dashboard/${session.user.role}`);
      } else {
        setError(true);
        setSubmitting(false);
      }
    }
  }

  return (
    <div className="dashboard-tab-wrapper gap-0">
      <section className="bg-foreground h-screen w-screen">
        <div className="flex flex-col lg:flex-row items-center lg:items-start text-start text-foreground gap-10 lg:gap-0 h-full justify-start">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="lg:max-w-none flex lg:justify-center w-full lg:w-[50%] bg-card border-border p-6 h-full mr-auto border-r-[1px] border-solid section-px lg:px-[60px] py-20"
            >
              <div className="flex flex-col gap-8 items-start max-w-[448px] mx-auto w-full lg:justify-center lg:pb-20">
                <div className="text-h3 w-full">
                  Welcome
                  <div className="text-p_ui text-muted-foreground mt-1">
                    Please log in to continue
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="pt-2">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <Link href="/dashboard/signup" className="text-subtle">
                    {t("forgotPassword")}
                  </Link> */}
                </div>

                <div className="flex flex-col gap-4 w-full">
                  {error && (
                    <div className="text-destructive">
                      Incorrect username or password
                    </div>
                  )}
                  <Button
                    disabled={submitting}
                    type="submit"
                    className="w-full"
                  >
                    {submitting && <Loader2 className="animate-spin" />}
                    {submitting ? "Logging in..." : "Log in"}
                  </Button>
                  {/* <Link href="/dashboard/signup" className="text-subtle">
                    {t("noAccount")}{" "}
                    <span className="underline">{t("signUp")}</span>
                  </Link> */}
                </div>
              </div>
            </form>
          </Form>

          {/* <div className="hidden lg:grid h-full w-[50%] place-items-center lg:pb-20 overflow-hidden px-5">
            <div className="relative w-full max-w-[600px] aspect-[1907/1516]">
              <Image
                fill
                src="/graphics/reason_1.png"
                alt="Login graphic"
                className="object-cover z-[1]"
              />
              <div className="hidden lg:block absolute aspect-[1027/527] -bottom-[0%] lg:bottom-[3%] w-[770px] lg:w-[897px] -right-[19%] lg:-right-[9%]">
                <Image
                  fill
                  src="/graphics/whypesgraphics.png"
                  alt="Login graphic"
                />
              </div>
            </div>
          </div> */}
        </div>
      </section>
    </div>
  );
}
