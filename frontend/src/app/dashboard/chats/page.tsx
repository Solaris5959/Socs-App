
'use client'
import { redirect } from 'next/navigation'

// This is a main page of chats section of the dashboard
import { useChat } from '@/contexts/ChatContext'

// This the main component to display the chat page
// ** Always redirect to the conversation with the first user in the chat history
export default function ChatPage() {
    // Use the custom hook to access chat context
    const { chatHistory } = useChat();

    if (chatHistory.length > 0) {
        redirect('chats/' + chatHistory[0].user_id) // Redirect to the first chat
    }
}