import React from 'react';

import SAMPLE_POSTS from "@/assets/sample-posts"; // Assuming you have a sample posts data file

export default function ConnectionComponent() {


    // Todo: Call post context to fetch posts and display them

    // Todo: Scoll to reveal the rest of the feed when user scrolls down

    // Test data for posts
    const posts = SAMPLE_POSTS; // Replace with actual post data from context or API


    return (
        <div className="flex flex-col items-center px-4 py-8 min-h-screen dark:bg-gray-900">
            {/* Connection container */}
            <div className="w-full max-w-6xl bg-white  border border-gray-200
             dark:border-slate-700 rounded-lg py-4 px-6  dark:bg-slate-800 ">

            </div>

        </div>
    );
}