

import { redirect } from 'next/navigation'
// This is a main page of chats section of the dashboard
// Todo: You need to fetch 1st chatId to navigate to the chat page

// This the main component to display the chat page
export default function ChatPage() {
    redirect('chats/1')
}