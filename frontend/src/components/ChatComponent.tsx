'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { messagesWithBessie, messagesWithAlex, messagesWithEthan } from '@/assets/sample-chats';
import { Message } from '@/interface/Message';
import mockChatHistoryInfo from '@/assets/sample-chats-history';



// This is the main component to display the chat page
export default function ChatComponent() {

    // Get the chatId from the URL parameters
    const params = useParams()
    const userId = params.chatId as string // use userId

    console.log('ChatComponent userId:', userId)

    const [messages, setMessages] = useState<Message[]>([])

    // For input message state
    const [newMessage, setNewMessage] = useState([])

    // Todo: Get header information from the chat history by userId
    // For now, we will use the mock data
    const chatHistory = mockChatHistoryInfo.find(chat => chat.user_id === userId)
    console.log('ChatComponent chatHistory:', chatHistory)



    // Use effect to fetch messages based on chatId
    useEffect(() => {
        // Here you would typically fetch messages from an API based on chatId
        // For now, we will use the mock data
        // Example: fetchMessages(chatId)
        // Todo: Fetch the chat based on userId

        // Mockup front-end: Validate userId and fetch messages accordingly
        if (userId === '0481d6cc-d641-4597') {
            setMessages(messagesWithBessie)
        } else if (userId === '0481d6cc-asdt-14524') {
            setMessages(messagesWithAlex)
        } else if (userId === '0481d6cc-dasd-t12fs') {
            setMessages(messagesWithEthan)
        } else {
            // Handle case where userId does not match any known chat
            console.warn(`No messages found for userId: ${userId}`)
            setMessages([]) // Clear messages if no match found

        }
    }, [userId])


    /// Handle an input for post request
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
                    {/* use chathistory to display the header */}
                    <div className="relative w-10 h-10">
                        <Avatar className="w-12 h-12">
                            <AvatarImage src={chatHistory?.avatar_URL || ''}
                                alt={chatHistory?.name} />
                            <AvatarFallback className="text-gray-700 bg-gray-300">
                                SO
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{chatHistory?.name}</h3>
                        <p className="text-xs text-gray-500">{chatHistory?.poistion || ''}</p>
                    </div>
                    <span className="ml-auto text-xs text-green-500 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Online
                    </span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 0">
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
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none 
                        focus:ring-2 focus:ring-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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