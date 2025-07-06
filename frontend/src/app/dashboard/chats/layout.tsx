'use client'
import ChatHistoryComponent from "@/components/ChatHistoryComponent"

export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <div className=" mx-auto">
            <div className="flex gap-4 h-[calc(100vh-5rem)]">
                {/* Chat History Sidebar */}
                <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 overflow-hidden">
                    <ChatHistoryComponent />
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {children}
                </div>
            </div>
        </div>
    )
}