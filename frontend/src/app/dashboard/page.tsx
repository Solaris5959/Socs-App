import React from 'react'

import { Metadata } from "next";
// Page title and description
export const metadata: Metadata = {
    title: "SOCS | Home",
    description: "Socs social media app",
};

// This is home page of the dashboard where you r

export default function page() {
    return (
        <div className="flex flex-row items-center justify-center">
            <h1 className='text-2xl text-center'>Feed goes here</h1>
        </div>
    )
}
