

import { redirect } from 'next/navigation'
import mockChatHistory from '@/assets/sample-chats-history'
// This is a main page of chats section of the dashboard
// Todo: You need to fetch 1st chatId to navigate to the chat page

// This the main component to display the chat page
// ** Always redirect to the conversation with the first user in the chat history
export default function ChatPage() {
    redirect('chats/' + mockChatHistory[0].user_id) // Redirect to the first chat
}