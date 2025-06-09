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
import Link from "next/link"
import { useAuth } from '../../contexts/AuthContext';
import { useState } from "react";

// SignupForm Component
export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  // Use the AuthContext to get the signUp function
  const { signUp } = useAuth();

  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    password2?: string
    displayName?: string
  }>({})

  // Function to handle form submission
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Get form data
    const formData = new FormData(e.currentTarget)

    // Get the form values
    const userEmail = formData.get("email") as string
    const userPassword = formData.get("password") as string
    const userPassword2 = formData.get("password2") as string
    const userDisplayName = formData.get("displayName") as string

     const newErrors: typeof errors = {}
    // Todo: Validate the form data and display error messages if needed
    // Email validation
    if (!userEmail) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      newErrors.email = "Invalid email format"
    }

    // Password validation
    if (!userPassword) {
      newErrors.password = "Password is required"
    } else if (userPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/[A-Za-z]/.test(userPassword) || !/[0-9]/.test(userPassword)) {
      newErrors.password = "Password must contain both letters and numbers"
    }

    // Confirm password validation
    if (userPassword !== userPassword2) {
      newErrors.password2 = "Passwords do not match"
    }

    // Display name validation
    if (!userDisplayName) {
      newErrors.displayName = "Display name is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})

    // Call the signUp function from AuthContext
    await signUp(userEmail, userPassword, userDisplayName);


  }

  return (
    <div className={cn("flex items-center justify-center", className)} {...props}>
      <Card className="w-full max-w-md p-10 rounded-3xl bg-white dark:bg-slate-900 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
            Create a new account
          </CardTitle>
          <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
            Fill in your details to sign up.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
            

            {/* Conirm Password Field */}
            <div className="grid gap-2">
              <label htmlFor="password2" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Confirm Password
              </label>
              <Input
                id="password2"
                name="password2"
                type="password"
                placeholder="••••••••"
                required
              />
              {errors.password2 && <p className="text-sm text-red-500">{errors.password2}</p>}
            </div>

            {/* Display Name */}
            <div className="grid gap-2">
              <label htmlFor="displayName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Display Name
              </label>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                placeholder="Your display name"
                required
              />
              {errors.displayName && <p className="text-sm text-red-500">{errors.displayName}</p>}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4">
              <Button type="submit" className="w-full rounded-xl 
              bg-blue-500 hover:bg-blue-700 text-white cursor-pointer">
                Create Account
              </Button>
              <Link href="/" passHref>
                <Button variant="outline" className="w-full rounded-xl cursor-pointer">
                  Back
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}