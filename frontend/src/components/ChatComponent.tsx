'use client'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Message, FetchMessage } from '@/interface/Message';
import { useChat } from '@/contexts/ChatContext';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { Skeleton } from "@/components/ui/skeleton"

// This is the main component to display the chat page
export default function ChatComponent() {

    // Use the custom hook to access chat context
    const { chatHistory, chatParticipant, setChatParticipant, sendMessage } = useChat();

    // State to manage typing indicator
    const [isTyping, setIsTyping] = useState(false);
    let typingTimer: NodeJS.Timeout;

    // Sending state
    const [sending, setSending] = useState(false);


    // Get the chatId from the URL parameters
    const params = useParams()
    const userId = params.chatId as string // use userId
    const [messages, setMessages] = useState<Message[]>([])

    // Find the current chat history based on userId
    const currentChatHistory = chatHistory.find(chat => chat.user_id === userId);
    // For input message state
    const [newMessage, setNewMessage] = useState<string>('')
    // Loading state for messages
    const [loading, setLoading] = useState(true);


    // Sroll to bottom of the chat when new messages are added
    const bottomRef = useRef<HTMLDivElement | null>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);


    // Unified participant source: use context if available, else fallback to history
    useEffect(() => {
        if (userId && currentChatHistory && (!chatParticipant || chatParticipant.user_id !== userId)) {
            setChatParticipant({
                user_id: currentChatHistory.user_id,
                display_name: currentChatHistory.display_name,
                profile_pic_url: currentChatHistory.profile_pic_url,
                position: currentChatHistory.position,
                company: currentChatHistory.company,
                is_online: currentChatHistory.is_online
            });

        }
    }, [userId, currentChatHistory, chatParticipant, setChatParticipant]);

    // Use effect to fetch messages when the component mounts or userId changes
    useEffect(() => {
        const myUserId = localStorage.getItem('user_id');
        // Loading state
        setLoading(true);

        // Fetch historical messages
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .or(`and(sender_id.eq.${myUserId},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${myUserId})`)
                .order('sent_at', { ascending: true });

            if (!error && data && myUserId) {
                const formatted = formatMessages(data, myUserId);
                //console.log('Fetched and formatted messages:', formatted);
                setMessages(formatted);

                setLoading(false);
            } else {
                console.error('Error fetching messages:', error);
            }
        };

        // Subscribe to new messages
        const channel = supabase
            .channel(`chat-${userId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
            }, (payload) => {
                const msg = payload.new;
                console.log('Realtime INSERT received:', msg);

                if (
                    (msg.sender_id === myUserId && msg.receiver_id === userId) ||
                    (msg.sender_id === userId && msg.receiver_id === myUserId)
                ) {
                    if (myUserId) {
                        const formatted = formatMessages([msg], myUserId);
                        setMessages(prev => [...prev, ...formatted]);
                    } else {
                        console.error('myUserId is null, cannot format messages.');
                    }
                }
            })
            .subscribe();

        // Fetch once on mount
        fetchMessages();

        // Cleanup
        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    // Helper function typing indicator
    const handleTyping = (value: string) => {
        setNewMessage(value);

        setIsTyping(true);
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            setIsTyping(false);
        }, 1000); // hide after 1 second of inactivity
    };

    // Helper function to format messages
    function formatMessages(data: unknown[], currentUserId: string) {

        // Mapping through the data to format messages
        return data.map((msgUnknown) => {
            const msg = msgUnknown as FetchMessage
            const isCurrentUser = msg.sender_id === currentUserId;

            return {
                id: msg.id,
                text: msg.content, // rename 'content' to 'text'
                sender: isCurrentUser ? 'user' : 'other',
                timestamp: format(new Date(msg.sent_at), 'hh:mm a'),
                ...(isCurrentUser
                    ? {}
                    : {
                        avatar: currentChatHistory?.profile_pic_url,
                        name: currentChatHistory?.display_name,
                    }),
            };
        });
    }


    // Handle an input for post request
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        setSending(true);
        try {
            // Send the message using the sendMessage function from context
            await sendMessage(userId, newMessage.trim());
            setNewMessage('');
            setIsTyping(false);
        } catch (err) {
            console.error('Error sending message:', err);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full max-w-screen-md mx-auto">
            {/* Chat Header */}
            <div className="sticky top-0 z-10 px-4 py-3 border-b border-gray-200 bg-white md:px-6">
                <div className="flex items-center gap-3">
                    {/* use chathistory to display the header */}

                    <div>
                        <h3 className="font-semibold text-gray-900">{chatParticipant?.display_name}</h3>
                        <p className="text-xs text-gray-500">{chatParticipant?.position || ''}</p>
                    </div>
                    {chatParticipant?.is_online && (
                        <span className="ml-auto text-xs text-green-500 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Online
                        </span>
                    )}

                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 sm:px-6">

                {/* Messages when empty */}
                {messages.length === 0 && !loading && (
                    <div className="text-center text-gray-400 italic mt-6">
                        No conversations yet, start the conversation with {chatParticipant?.display_name}
                    </div>
                )}


                {/* Messages Area */}
                {loading ? (
                    // Display skeletons while loading
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex gap-3 max-w-xs lg:max-w-md">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-40 rounded" />
                                    <Skeleton className="h-4 w-20 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`flex gap-3 max-w-[80%] sm:max-w-[70%] md:max-w-md ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                {message.sender === 'other' && (
                                    <div className="relative w-8 h-8 flex-shrink-0">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={message.avatar || ''} alt={message.name || ''} />
                                            <AvatarFallback className="bg-blue-100 text-blue-600">
                                                {chatParticipant?.display_name?.charAt(0) ?? 'U'}
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
                                    <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/* Animate typing indicator */}
                <AnimatePresence>
                    {isTyping && (
                        <motion.div
                            key="typing-indicator"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            transition={{ duration: 0.3 }}
                            className="text-sm text-gray-400 italic text-right mt-2"
                        >
                            typing ...
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Dummy div to anchor scroll */}
                <div ref={bottomRef} />
            </div>

            {/* Message Input */}
            <div className="px-4 py-3 md:px-6 bg-white border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => handleTyping(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2  border border-gray-300 rounded-full focus:outline-none 
                        focus:ring-2 focus:ring-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        type="submit"
                        disabled={sending}
                        className={`p-3 rounded-full cursor-pointer transition-colors ${sending ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                    >
                        <Send />
                    </button>
                </form>
            </div>
        </div>
    )
}