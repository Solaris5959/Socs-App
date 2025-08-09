'use client'

import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'
import { useChat } from '@/contexts/ChatContext'
import { ChatHistoryType } from '@/interface/Chat'

export default function ChatHistoryComponent() {
    const router = useRouter()
    const { chatHistory, fetchChatByUserId, loading } = useChat()

    const [isLocalLoading, setIsLocalLoading] = useState(true)

    useEffect(() => {
        if (!loading) {
            const timeout = setTimeout(() => setIsLocalLoading(false), 300)
            return () => clearTimeout(timeout)
        }
    }, [loading])

    const handleChatClick = async (user_id: string) => {
        try {
            await fetchChatByUserId(user_id)
            router.push(`/dashboard/chats/${user_id}`)
        } catch (error) {
            console.error('Failed to fetch chat by user_id:', error)
        }
    }

    return (
        <div className="h-full w-full sm:max-w-xs">
            <div className="mb-4 px-2 sm:px-0">
                <h2 className="text-lg font-semibold text-gray-800">Chat History</h2>
            </div>

            <div className="space-y-2 px-2 sm:px-0">
                {/* Skeleton while loading */}
                {loading && (
                    Array.from({ length: 3 }).map((_, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                    ))
                )}

                {/* Empty state */}
                {!loading && !isLocalLoading && chatHistory.length === 0 && (
                    <div className="text-center text-gray-400 italic mt-6">
                        No conversations yet. Start one!
                    </div>
                )}

                {/* Render chat list */}
                {!loading && chatHistory.length > 0 &&
                    chatHistory.map((chat: ChatHistoryType) => (
                        <Link href={`/dashboard/chats/${chat.user_id}`} key={chat.id}>
                            <div
                                onClick={() => handleChatClick(chat.user_id)}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                            >
                                <Avatar className="w-12 h-12">
                                    <AvatarImage
                                        src={chat.profile_pic_url || ''}
                                        alt={chat.display_name}
                                    />
                                    <AvatarFallback className="bg-blue-100 text-blue-600">
                                        {chat.display_name?.charAt(0) ?? 'U'}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-sm text-gray-900 truncate">
                                        {chat.display_name}
                                    </h3>
                                    <p className="text-xs text-gray-500 truncate">
                                        {chat.last_content || 'No messages yet.'}
                                    </p>
                                </div>

                                {chat.sent_at && (
                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                        {formatDistanceToNow(new Date(chat.sent_at), { addSuffix: true })}
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}