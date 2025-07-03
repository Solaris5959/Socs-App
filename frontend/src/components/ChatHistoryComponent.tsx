import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link'

// Mock chat history data
const mockChatHistory = [
    {
        id: '1',
        name: 'Bessie Cooper',
        lastMessage: 'Hi, Michael. I am doing well, thanks for asking!',
        avatar: 'https://ui-avatars.com/api/?name=Bessie+Cooper&background=random',
        time: '2 min ago'
    },
    {
        id: '2',
        name: 'Ethan Martinez',
        lastMessage: 'Not much, just planning to relax...',
        avatar: 'https://ui-avatars.com/api/?name=Ethan+Martinez&background=random',
        time: '15 min ago'
    },
    {
        id: '3',
        name: 'Alex Carter',
        lastMessage: 'Hey, did you finish the report?',
        avatar: 'https://ui-avatars.com/api/?name=Alex+Carter&background=random',
        time: '1 hour ago'
    }
]

export default function ChatHistoryComponent() {
    return (
        <div className="h-full">
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Chat History</h2>
            </div>
            <div className="space-y-2">
                {mockChatHistory.map((chat) => (
                    <Link href={`/dashboard/chats/${chat.id}`} key={chat.id}>
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
                            <div className="relative w-10 h-10">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={chat.avatar || 'empty'} alt={chat.name} />
                                    <AvatarFallback className="text-gray-700 bg-gray-300">
                                        SO
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm text-gray-900">{chat.name}</h3>
                                <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                            </div>
                            <span className="text-xs text-gray-400">{chat.time}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}