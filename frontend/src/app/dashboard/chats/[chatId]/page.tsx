import React from 'react'
import ChatComponent from '@/components/ChatComponent'
import { Metadata } from 'next'

// Metadata for the page
// Page title and description
export const metadata: Metadata = {
    title: "SOCS | Chats",
    description: "Chats section of the SOCS app",
};


// Dynamic route for 1-1 conversation by chat ID
export default function page() {
    return (
        <ChatComponent />
    )
}
