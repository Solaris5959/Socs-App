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
          <CardTitle className="text-2xl text-center">Login to your account</CardTitle>
          <CardDescription className="text-md text-center text-slate-400">
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>


        {/* Card content with form */}
        <CardContent>
          <form>
            <div className="flex flex-col gap-6 w-1/2 mx-auto">
              <div className="grid gap-3 ">
                {/* username input */}
                <Input
                  id="email"
                  type="email"
                  placeholder="Username"
                  required
                  className="rounded-xl bg-gray-50 dark:bg-slate-800 
                    focus-visible:ring-slate-400 focus-visible:ring-offset-slate-200 focus-visible:ring-offset-2 focus-visible:outline-none"
                />
              </div>
              <div className="grid gap-3">


                {/* password input */}
                <Input id="password" type="password" placeholder="Password" required
                  className="rounded-xl bg-gray-50 dark:bg-slate-800 
                    focus-visible:ring-slate-400 focus-visible:ring-offset-slate-200 focus-visible:ring-offset-2 focus-visible:outline-none" />
              </div>


              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full rounded-xl bg-blue-500 hover:bg-blue-600 cursor-pointer">
                  Login
                </Button>

              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>

  )
}
