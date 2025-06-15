import "./globals.css";

import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/contexts/AuthContext";

import RouteGuard from "./RouteGuard";

// Root layout for the application
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <AuthProvider>
        <body>
          <main>
            <RouteGuard>
              {children}
              <Toaster />
            </RouteGuard>
          </main>
        </body>
      </AuthProvider>
    </html>
  );
}
