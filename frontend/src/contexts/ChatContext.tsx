'use client'

import { createContext, useContext } from 'react';
import { ChatContextType } from '@/interface/ChatContextType';
import { useEffect, useState } from 'react';
import { toast } from "sonner"
import { ChatHistoryType, ChatType } from '@/interface/Chat';

// Create a context for chat functionality
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// URL for the authentication service
const API_URL = process.env.NEXT_PUBLIC_LOCAL_API;


// ChatProvider component to wrap around your application
export function ChatProvider({ children }: { children: React.ReactNode }) {

    // State to manage chat history
    const [chatHistory, setChatHistory] = useState<ChatHistoryType[]>([]);

    // State to manage posts, favorite posts, and user posts
    const [loading, setLoading] = useState<boolean>(false);


    // Todo: useEffect to fetch chat history when the component mounts
    useEffect(() => {
        // Fetch chat history from the server
        // Todo: Method to fetch chat history (GET: /socs/api/v1/index/chat)
        const fetchChatHistory = async (): Promise<ChatHistoryType[]> => {
            // Logic to fetch chat history from the server
            setLoading(true);
            try {
                const token = localStorage.getItem("access_token");

                const response = await fetch(
                    `${API_URL}/socs/api/v1/index/chat`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch chat history');
                }

                const data = await response.json();

                return data

            } catch (error) {
                console.error('Error fetching chat history: ', error);
                toast.error('Failed to fetch chat history');
                return []; // Ensure fallback is always an array
            } finally {
                setLoading(false);
            }
        }

        // Fetch chat history when the component mounts
        fetchChatHistory().then(history => {
            setChatHistory(history);
        }).catch(error => {
            console.error('Error fetching chat history:', error);
        });
    }, []);




    // Todo: Method to receive a message by userId (GET: /socs/api/v1/index/chat/:user_id)
    const fetchChatByUserId = async (user_id: string): Promise<ChatType[]> => {
        // Logic to receive a message
        console.log(`Fetching chat for user_id: ${user_id}`);

        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");

            const response = await fetch(
                `${API_URL}/socs/api/v1/index/chat/${user_id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            )

            if (!response.ok) {
                throw new Error('Failed to fetch chat history');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching chat history: ', error);
            toast.error('Failed to fetch chat history');
            return []; // Ensure fallback is always an array
        } finally {
            setLoading(false);
        }
    };


    // Todo: Method to send a message (POST: /socs/api/v1/index/chat)
    const sendMessage = async (receiver_id: string, message: string): Promise<void> => {
        // Logic to send a message
        console.log(`Sending message to ${receiver_id}: ${message}`);
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");

            const headers: HeadersInit = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            const body = JSON.stringify({
                receiver_id,
                message
            });

            const response = await fetch(`${API_URL}/socs/api/v1/index/chat`, {
                method: 'POST',
                headers,
                body
            })

            if (!response.ok) {
                throw new Error('Failed to add a post');
            }

            toast.success('Message sent successfully!');
        } catch (error) {
            console.error('Error sending a message:', error);
            toast.error('Failed to send a message.');
        } finally {
            setLoading(false);
        }

    };



    // State variables to manage user and session
    const value = {
        loading,
        chatHistory,
        fetchChatByUserId,
        sendMessage,
    };



    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );

}



// Custom hook to use the AuthContext
// This hook allows you to access the authentication context in your components
export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('userChat must be used within an ChatProvider');
    }
    return context;
};

