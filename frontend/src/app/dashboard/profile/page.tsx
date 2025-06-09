import React from 'react'
import { UserProfile } from '@/components/UserProfile'


import { Metadata } from "next"
export const metadata: Metadata = {
    title: "User Profile | SOCS",
    description: "View and manage your profile settings, including personal information, account details, and preferences.",
}


// This is the user profile page component
export default function page() {
    return (
        // Profile Component Container
        <div className="flex-1 md:min-h-min ">
            {/* Render Profile Component */}
            <UserProfile />
        </div>

    )
}
