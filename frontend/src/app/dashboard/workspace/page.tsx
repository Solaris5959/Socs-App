import React from 'react'
import WorkSpaceComponent from '@/components/WorkSpaceComponent'
import { Metadata } from 'next';

// Metadata for the page
// Page title and description
export const metadata: Metadata = {
    title: "SOCS | Workspace",
    description: "Chats section of the SOCS app",
};


// This is the user profile page component
export default function page() {
    return (
        <div className="flex flex-row items-center justify-center">
            <WorkSpaceComponent />
        </div>
    )
}
