
import Image from "next/image"
import bgImage from "@/assets/works-space-bg.jpg"
import Footer from "@/components/Footer"
import { LoginForm } from "@/components/LoginForm"
import { Metadata } from "next"
export const metadata: Metadata = {
  title: "SOCS | Login",
  description: "Login to SOCS - the social media platform for creators and professionals.",
}

export default function Page() {
  return (
    <>
      {/* Background image */}
      <div className="absolute inset-0 -z-10">

        <Image
          src={bgImage}
          alt="Workspace background"
          fill
          priority
          className="object-cover dark:brightness-[0.2] dark:grayscale"
        />

        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      {/* Page layout */}
      <div className="relative z-10 flex flex-col min-h-screen">


        {/* Main content */}
        <main className="flex-grow flex items-center justify-center px-4">
          <section className="w-full max-w-2xl">
            <LoginForm />
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}