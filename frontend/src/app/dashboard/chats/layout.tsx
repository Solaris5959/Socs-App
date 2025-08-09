'use client'

import ChatHistoryComponent from "@/components/ChatHistoryComponent"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { MessagesSquare, X } from 'lucide-react'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 justify-center">
            {/* Trigger only visible on mobile */}
            <div className="fixed right-6 z-50 md:hidden">
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button size="icon" className="rounded-full shadow-lg cursor-pointer">
                            <MessagesSquare />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="max-h-[90vh] rounded-t-xl border-t bg-white">
                        <DrawerHeader className="flex items-center justify-between px-4 pt-4">
                            <DrawerTitle className="text-lg font-semibold"></DrawerTitle>
                            <DrawerClose asChild>
                                <div className=" w-full item-right flex justify-end">
                                    <Button variant="ghost" size="icon"
                                        className="rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer ">
                                        <X />
                                    </Button>
                                </div>
                            </DrawerClose>
                        </DrawerHeader>
                        {/* Render children inside the drawer */}
                        <div className=" flex flex-col items-center justify-start overflow-y-auto max-h-[calc(90vh-4rem)]">
                            <div className="w-full max-w-sm">
                                <ChatHistoryComponent />
                            </div>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>

            {/* Main chat area layout */}
            <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-5rem)]">
                {/* Sidebar for md+ only */}
                <aside className="hidden md:block  lg:w-[350px]  rounded-lg p-4 shadow-sm border border-gray-200 overflow-y-auto">
                    <ChatHistoryComponent />
                </aside>

                {/* Chat area */}
                <main className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}