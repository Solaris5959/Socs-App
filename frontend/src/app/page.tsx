import { LoginForm } from "@/components/login-form";
import { Metadata } from "next";
import bgImage from "@/assets/works-space-bg.jpg";
import Image from "next/image";
import Footer from "@/components/Footer";

// Page title and description
export const metadata: Metadata = {
  title: "SOCS | Login",
  description: "Socs social media app",
};

// Login page component
export default function Page() {

  // Function to login the user





  return (
    <>
      {/* Background image layer */}
      <Image
        src={bgImage}
        alt="Co-working space with people working"
        fill
        priority
        className="absolute inset-0 -z-10 object-cover 
        dark:brightness-[0.2] dark:grayscale"
      />
      <div className="absolute inset-0 bg-black/40 -z-10" />

      {/* Page layout with sticky footer */}
      <div className="relative z-10 flex flex-col min-h-screen ">
        {/* Main content with form centered */}
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="w-full max-w-2xl">
            <LoginForm />
          </div>
        </div>

        {/* Sticky Footer at Bottom */}
        <Footer />
      </div>
    </>
  );
}