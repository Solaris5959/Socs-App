
import { Metadata } from "next";
import bgImage from "@/assets/works-space-bg.jpg";
import Image from "next/image";
import Footer from "@/components/Footer";
import { SignUpForm } from "@/components/signup-form";

// Page title and description
export const metadata: Metadata = {
    title: "SOCS | Sign Up",
    description: "Socs social media app",
};

// Signup page component
export default function Page() {

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
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Page layout with sticky footer */}
            <div className="relative z-10 flex flex-col min-h-screen ">
                {/* Main content with form centered */}
                <div className="flex-grow flex items-center justify-center px-4">
                    <div className="w-full max-w-2xl">
                        {/* Render sign-up form here*/}
                        <SignUpForm />
                    </div>
                </div>

                {/* Sticky Footer at Bottom */}
                <Footer />
            </div>
        </>
    );
}