import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
//import mockChatHistory from '@/assets/sample-chats-history';
import { useChat } from '@/contexts/ChatContext';
//import { ChatType } from '@/interface/Chat';
//import { ChatContextType } from '@/interface/ChatContextType';
import { ChatHistoryType } from '@/interface/Chat'; // make sure this exists
import { useRouter } from 'next/navigation';
// Mock chat history data


export default function ChatHistoryComponent() {

    // Todo: Use chathistory from the ChatContext
    const {chatHistory, fetchChatByUserId} = useChat();
    const router = useRouter();

    const handleChatClick = async(user_id: string) => {
        try{
            await fetchChatByUserId(user_id);
            router.push(`/dashboard/chats/${user_id}`);
        }catch(error){  
            console.error('Failed to fetch chat by user_id:', error);
        }
    };


    return (
        <div className="h-full">
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Chat History</h2>
            </div>
            <div className="space-y-2">
                {chatHistory.map((chat: ChatHistoryType) => (
                    // Link to the chat page with user_id
                    <Link href={`/dashboard/chats/${chat.user_id}`} key={chat.id}>
                        <div
                        key={chat.id} onClick={() => handleChatClick(chat.user_id)} 
                        className="flex items-center gap-3 p-2 rounded-lg
                         hover:bg-gray-200 cursor-pointer transition-colors">
                            <div className="relative ">
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
                            <span className="text-xs text-gray-400">
                                {formatDistanceToNow(new Date(chat.time), { addSuffix: true })}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}