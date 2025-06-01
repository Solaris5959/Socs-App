import React from 'react'
import { UserProfile } from '@/components/UserProfile'

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
