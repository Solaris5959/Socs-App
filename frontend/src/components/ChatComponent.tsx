'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
interface Message {
    id: string
    text: string
    sender: 'user' | 'other'
    timestamp: string
    avatar?: string
    name?: string
}

const mockMessages: Message[] = [
    {
        id: '1',
        text: "Hi, Michael. I'm facing some challenges in optimizing my code for performance. Can you help?",
        sender: 'other',
        timestamp: '10:45 AM',
        avatar: 'https://ui-avatars.com/api/?name=Bessie+Cooper&background=random',
        name: 'Bessie'
    },
    {
        id: '2',
        text: "Hi, Bessie! 👋 I'd be glad to help you with optimizing your code for better performance. To get started, could you provide me with some more details about the specific challenges you're facing?",
        sender: 'user',
        timestamp: '10:53 AM'
    }
]

export default function ChatComponent() {
    const params = useParams()
    const chatId = params.chatId as string
    const [messages] = useState<Message[]>(mockMessages)
    const [newMessage, setNewMessage] = useState('')

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle sending message logic here
        setNewMessage('')
    }

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white rounded-t-xl">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                        <Avatar className="w-12 h-12">
                            <AvatarImage src="https://ui-avatars.com/api/?name=Bessie+Cooper&background=random"
                                alt="Bessie Cooper" />
                            <AvatarFallback className="text-gray-700 bg-gray-300">
                                SO
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Bessie Cooper</h3>
                        <p className="text-xs text-gray-500">Marketing Manager</p>
                    </div>
                    <span className="ml-auto text-xs text-green-500 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Online
                    </span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex gap-3 max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                            {message.sender === 'other' && (
                                <div className="relative w-8 h-8 flex-shrink-0">


                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src={message.avatar || ''}
                                            alt={message.name || ''} />
                                        <AvatarFallback className="text-gray-700 bg-gray-300">
                                            SO
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            )}
                            <div>
                                {message.sender === 'other' && (
                                    <p className="text-xs font-medium text-gray-700 mb-1">{message.name}</p>
                                )}
                                <div
                                    className={`rounded-lg px-4 py-2 ${message.sender === 'user'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-green-100 text-gray-800'
                                        }`}
                                >
                                    <p className="text-sm">{message.text}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {message.timestamp}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Message Input */}
            <div className="px-6 py-4 bg-white border-t border-gray-200 rounded-b-xl">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    )
}