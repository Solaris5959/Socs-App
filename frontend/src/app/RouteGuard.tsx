'use client';

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/authenticate";

// Routes that do not require authentication
const PUBLIC_PATHS = ["/", "/signup", "/error", "/forgot-password", "/reset-password"];

export default function RouteGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const path = pathname?.split("?")[0];
            const isAuth = isAuthenticated();

            // 🔐 If user is not authenticated and tries to access private page
            if (!isAuth && !PUBLIC_PATHS.includes(path)) {
                setAuthorized(false);
                router.push("/"); // Redirect to login
            }
            // 🔁 If user is authenticated and tries to access login or signup
            else if (isAuth && PUBLIC_PATHS.includes(path)) {
                setAuthorized(false);
                router.push("/dashboard"); // Redirect to dashboard
            }
            else {
                setAuthorized(true); // Allow access
            }
        };

        checkAuth();
    }, [pathname]);

    if (!authorized) return null;

    return <>{children}</>;
}