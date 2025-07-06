

import { redirect } from 'next/navigation'
import mockChatHistory from '@/assets/sample-chats-history' // Mock chat history data
// This is a main page of chats section of the dashboard
// Todo: Get the chat history from ChatContext then get the first user_id from it

// This the main component to display the chat page
// ** Always redirect to the conversation with the first user in the chat history
export default function ChatPage() {
    redirect('chats/' + mockChatHistory[0].user_id) // Redirect to the first chat
}