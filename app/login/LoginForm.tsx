"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";
import type { LoginValues } from "@/types";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (values: LoginValues) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      toast.success("Logged in successfully");
      router.replace("/");
    } catch (error) {
      console.error(error);
      toast.error("Login failed");
    }
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <Toaster position="top-right" />
      <h1 className="mb-4 text-xl text-center font-semibold text-zinc-900 dark:text-zinc-50">
        Welcome to the Hydro CRM
      </h1>
      <h2 className="mb-4 text-xl text-center font-semibold text-zinc-900 dark:text-zinc-50">
        Login to your account
      </h2>
      <p className=" text-center mb-6 text-sm text-zinc-600 dark:text-zinc-300">
        Enter your email and password to login to your account.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-zinc-800 dark:text-zinc-100"
          >
            Email
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-zinc-400">
              <Mail className="h-4 w-4" />
            </span>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border border-zinc-300 bg-white py-2 pl-8 pr-3 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
              placeholder="Enter email"
              {...register("email", { required: "Email is required" })}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-zinc-800 dark:text-zinc-100"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full rounded-md border border-zinc-300 bg-white py-2 pl-8 pr-9 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
              placeholder="Enter password"
              {...register("password", { required: "Password is required" })}
            />
            <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-zinc-400">
              <Lock className="h-4 w-4" />
            </span>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isSubmitting ? "Sign in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
