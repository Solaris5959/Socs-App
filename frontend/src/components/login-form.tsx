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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
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
          <form>
            <div className="flex flex-col gap-6 sm:w-1/2 w-full mx-auto">
              <div className="grid gap-3 ">
                {/* username input */}
                <Input
                  id="email"
                  type="email"
                  placeholder="Username"
                  required
                  className="w-full px-4 py-2 rounded-2xl border border-gray-200 
                  bg-gray-50 text-gray-900 
                  focus:outline-none transition duration-150 ease-in-out"
                />
              </div>
              <div className="grid gap-3">

                {/* Password input */}
                <Input id="password" type="password" placeholder="Password" required
                  className="w-full px-4 py-2 rounded-2xl border border-gray-200 
                  bg-gray-50 text-gray-900 
                  focus:outline-none transition duration-150 ease-in-out" />
              </div>


              <div className="flex flex-col gap-3">
                <Button type="submit" className="w- rounded-xl bg-blue-500 hover:bg-blue-600 cursor-pointer">
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
