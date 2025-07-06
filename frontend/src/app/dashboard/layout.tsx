'use client'

import { UserProvider } from "@/contexts/UserContext"
import { PostProvider } from "@/contexts/PostContext"
import { ConnectionProvider } from "@/contexts/ConnectionContext"
import { ChatProvider } from "@/contexts/ChatContext"
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

import { SearchForm } from "@/components/search-form"

export default function Layout({ children }: { children: React.ReactNode }) {


    // Render breadcrumb based on current path
    const breadcrumbConfig = {
        '/dashboard': 'Home',
        '/dashboard/myposts': 'My Posts',
        '/dashboard/favorites': 'Favorite Posts',
        '/dashboard/connections': 'My Connections',
        '/dashboard/chats': 'Chats',
        '/dashboard/workspace': 'Workspace',
        '/dashboard/supports': 'Support',
        '/dashboard/profile': 'Profile',
    };


    // Store pathname only on client
    const [currentPath, setCurrentPath] = useState<string | null>(null)
    const pathname = usePathname()

    // Use useEffect to update current path
    useEffect(() => {
        setCurrentPath(pathname)
    }, [pathname]) // Runs only on client

    return (
        <UserProvider>
            <ConnectionProvider>
                <PostProvider>
                    <ChatProvider>
                        <SidebarProvider>
                            <AppSidebar />
                            <SidebarInset>
                                <header className="flex h-16 shrink-0 items-center gap-2 ">
                                    <div className="flex items-center gap-2 px-4 w-1/2 " >
                                        <SidebarTrigger className="-ml-1" />
                                        <Separator orientation="vertical" className="mr-2 h-4" />
                                        {/* Breadcrumb nav container  */}
                                        <Breadcrumb>
                                            <BreadcrumbList>
                                                <BreadcrumbItem className="hidden md:block ">
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
                                    <div className="flex-1" />
                                    {/* Searcher component */}
                                    <div className="mr-4  w-[300px]">
                                        <SearchForm />
                                    </div>
                                </header>
                                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">{children}</div>
                                </div>
                            </SidebarInset>
                        </SidebarProvider>
                    </ChatProvider>
                </PostProvider>
            </ConnectionProvider>
        </UserProvider>
    )
}