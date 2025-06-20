
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



// LoginForm Component
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {


  // Use the AuthContext to get the signIn function
  const { signIn } = useAuth();

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});


  // Function to handle form submission
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Get form data
    const formData = new FormData(e.currentTarget)
    // Get the form values
    const userEmail = formData.get("email") as string
    const userPassword = formData.get("password") as string

    // Reset errors
    const newErrors: { email?: string; password?: string } = {};

    // Todo: Validate the form data and display error messages if needed
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

    // Call the signIn function from AuthContext
    await signIn(userEmail, userPassword);


  }

  return (

    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="p-10 rounded-3xl bg-white dark:bg-slate-900 shadow-lg">

        {/* Card header with logo and title */}
        <CardHeader>
          <div className="flex items-center justify-center ">
            <Image
              src={logoImage}
              alt="Logo"
              className="h-54 w-auto"
            />
          </div>

          <CardTitle className="sm:text-2xl text-xl text-center">Login to your account</CardTitle>
          <CardDescription className="sm:text-md text-sm text-center text-slate-400">
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>


        {/* Card content with form */}
        <CardContent>
          <form onSubmit={handleSubmit} >
            <div className="flex flex-col gap-6 sm:w-1/2 w-full mx-auto">
              <div className="grid gap-3">
                {/* Email input */}
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Username"
                  className={`w-full px-4 py-2 rounded-2xl border bg-gray-50 text-gray-900 
            focus:outline-none transition duration-150 ease-in-out
            ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}`}
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
                  className={`w-full px-4 py-2 rounded-2xl border bg-gray-50 text-gray-900 
            focus:outline-none transition duration-150 ease-in-out
            ${errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}`}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Submit button */}
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full rounded-xl bg-blue-500 hover:bg-blue-600 cursor-pointer"
                >
                  Login
                </Button>
              </div>

            </div>
            <div className="mt-4 text-center text-sm">


            </div>


            {/* Forgot pw and Signup link */}
            <div className="flex flex-col items-center text-center text-sm space-y-2 text-gray-600 dark:text-gray-400">
              <div>
                <Link
                  href="/forgot-password"
                  className="text-blue-500 hover:underline 
                  hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <div>
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-blue-500 hover:underline hover:text-blue-700 
                  dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>

  )
}
