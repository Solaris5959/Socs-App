
'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import logoImage from "@/assets/socs-logo.png";
import Link from "next/link"
import { useAuth } from '@/contexts/AuthContext';
import { useState } from "react";
import { Loader2 } from "lucide-react"




// LoginForm Component
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signIn } = useAuth();
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Get form data
    const formData = new FormData(e.currentTarget)
    const userEmail = formData.get("email") as string
    const userPassword = formData.get("password") as string

    // Reset errors
    const newErrors: { email?: string; password?: string } = {};

    // Validate email and password
    if (!userEmail) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      newErrors.email = "Invalid email format";
    }

    if (!userPassword) {
      newErrors.password = "Password is required";
    } else if (userPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/[A-Za-z]/.test(userPassword) || !/[0-9]/.test(userPassword)) {
      newErrors.password = "Password must contain both letters and numbers";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); // Clear errors if valid

    // Set loading state
    setIsLoading(true);

    try {
      await signIn(userEmail, userPassword);
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ email: "Invalid credentials. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="py-8 bg-white shadow-lg rounded-3xl dark:bg-slate-900">
        <CardHeader>
          <div className="flex items-center justify-center">
            <Image
              src={logoImage}
              alt="Logo"
              className="w-auto h-54"
            />
          </div>

          <CardTitle className="text-xl text-center sm:text-2xl">
            Login to your account
          </CardTitle>
          <CardDescription className="text-sm text-center sm:text-md text-slate-400">
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col w-full gap-6 mx-auto sm:w-2/3  ">
              <div className="grid gap-3">
                {/* Email input */}
                <Input
                  id="email"
                  name="email"
                  type="username"
                  placeholder="Username"
                  disabled={isLoading}
                  className={cn(
                    "w-full px-4 py-2 rounded-2xl border bg-gray-50 text-gray-900",
                    "focus:outline-none transition duration-150 ease-in-out",
                    errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'
                  )}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}

                {/* Password input */}
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  disabled={isLoading}
                  className={cn(
                    "w-full px-4 py-2 rounded-2xl border bg-gray-50 text-gray-900",
                    "focus:outline-none transition duration-150 ease-in-out",
                    errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'
                  )}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Submit button */}
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "w-full bg-blue-500 cursor-pointer rounded-xl hover:bg-blue-600",
                    isLoading && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>

              {/* Links */}
              <div className="flex flex-col items-center space-y-2 text-sm text-center text-gray-600
               dark:text-gray-400">
                <div>
                  <Link
                    href="/forgot-password"
                    className="text-blue-500 transition-colors hover:underline
                     hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div>
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-blue-500 transition-colors hover:underline hover:text-blue-700
                     dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Create an account
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}