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
import { useAuth } from '../contexts/AuthContext';
import { useState } from "react"

// SignupForm Component
export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  // Use the AuthContext to get the signUp function
  const { resetPassword } = useAuth();

  const [errors, setErrors] = useState<{
      password?: string
      password2?: string
    }>({})

  // Function to handle form submission
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Get form data
    const formData = new FormData(e.currentTarget)

    // Get the form values
    const password = formData.get("password") as string
    const password2 = formData.get("password2") as string

    const newErrors: typeof errors = {}


    // Todo: Validate the form data and display error messages if needed
    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      newErrors.password = "Password must contain both letters and numbers"
    }

    // Confirm password validation
    if (password !== password2) {
      newErrors.password2 = "Passwords do not match"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})

    // Call the resetpassword function from AuthContext
    const result = await resetPassword(password)

    return result; // Return the result of the resetPassword function

  }

  return (
    <div className={cn("flex items-center justify-center", className)} {...props}>
      <Card className="w-full max-w-md p-10 rounded-3xl bg-white dark:bg-slate-900 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
            Reset Password
          </CardTitle>
          <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
            Enter your new password below to reset it.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

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
                className={`w-full px-4 py-2 rounded-xl border bg-gray-50 text-gray-900 focus:outline-none transition duration-150 ease-in-out
        ${errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}`}
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
                className={`w-full px-4 py-2 rounded-xl border bg-gray-50 text-gray-900 focus:outline-none transition duration-150 ease-in-out
        ${errors.password2 ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}`}
              />
              {errors.password2 && <p className="text-sm text-red-500">{errors.password2}</p>}
            </div>


            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4">
              <Button type="submit" className="w-full rounded-xl 
              bg-blue-500 hover:bg-blue-700 text-white cursor-pointer">
                Reset Password
              </Button>
              <Link href="/" passHref>
                <Button variant="outline" className="w-full rounded-xl cursor-pointer">
                  Back to login
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}