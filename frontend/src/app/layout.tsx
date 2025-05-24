import "./globals.css";

import { Toaster } from "@/components/ui/sonner"

// Root layout for the application
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body>
        <main>
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
