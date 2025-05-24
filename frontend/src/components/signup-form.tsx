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
import React from "react"



// URL for the authentication service
const API_URL = process.env.NEXT_PUBLIC_LOCAL_API;



// SignupForm component
export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {


  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)


    // Check if the email is already registered
    console.log("Form data:", {
      email: formData.get("email"),
      password: formData.get("password"),
      displayName: formData.get("displayName"),
    })

    console.log("API URL:", API_URL)

    const response = await fetch(`${API_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
        displayname: formData.get("displayName"),
      }),
    })

    const result = await response.json()
    if (!response.ok) {
      console.error("Registration error:", result.error)
      // show toast or alert
      alert("Error: " + result.error)
    } else {
      console.log("User registered:", result)
      // redirect or notify
      alert("User registered successfully!")
    }
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
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4">
              <Button type="submit" className="w-full rounded-xl 
              bg-blue-500 hover:bg-blue-700 text-white">
                Create Account
              </Button>
              <Link href="/" passHref>
                <Button variant="outline" className="w-full rounded-xl">
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