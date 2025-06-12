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

// SignupForm Component
export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  // Use the AuthContext to get the signUp function
  const { forgetPassword } = useAuth();

  // Function to handle form submission
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Get form data
    const formData = new FormData(e.currentTarget)

    // Get the form values
    const userEmail = formData.get("email") as string

    // Todo: Validate the form data and display error messages if needed



    // Call the resetpassword function from AuthContext
    const result = await forgetPassword(userEmail);

    return result; // Return the result of the resetPassword function
  }

  return (
    <div className={cn("flex items-center justify-center", className)} {...props}>
      <Card className="w-full max-w-md p-10 rounded-3xl bg-white dark:bg-slate-900 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
            Enter your email and we&apos;ll send you a reset link
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

              />
            </div>





            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4">
              <Button type="submit" className="w-full rounded-xl 
              bg-blue-500 hover:bg-blue-700 text-white cursor-pointer">
                Send Reset Link
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