'use client'



import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

import { usePathname } from 'next/navigation'
import { useEffect, useState } from "react"
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {

    /// Todo: Breadcrumb configuration
    // Render breadcrumb based on current path
    const breadcrumbConfig = {
        '/dashboard': 'Home',
        '/dashboard/myposts': 'My Posts', // Example path


    };


    // Store pathname only on client
    const [currentPath, setCurrentPath] = useState<string | null>(null)
    const pathname = usePathname()

    // Use useEffect to update current path
    useEffect(() => {
        setCurrentPath(pathname)
    }, [pathname]) // Runs only on client



    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        {/* Breadcrumb nav container  */}
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink asChild>
                                        <Link href="/dashboard">
                                            <span >Home</span>
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {currentPath && currentPath !== '/dashboard' && (
                                    <>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>
                                                <span>
                                                    {breadcrumbConfig[currentPath as keyof typeof breadcrumbConfig]}
                                                </span>
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </>
                                )}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">{children}</div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}