import React from 'react';

import PostComponent from './PostComponent';
import SAMPLE_POSTS from "@/assets/sample-posts"; // Assuming you have a sample posts data file

export default function MyFavorites() {


    // Todo: Call post context to fetch posts and display them

    // Test data for posts
    const posts = SAMPLE_POSTS; // Replace with actual post data from context or API


    return (
        <div className="flex flex-col items-center px-4 py-8 min-h-screen dark:bg-gray-900">

            {/* Feed Content Placeholder */}
            <div className="mt-8 w-full max-w-2xl space-y-4">
                {/* Render each post using PostComponent */}
                {posts.map(post => (
                    <PostComponent key={post.postId} postInfo={post} />
                ))}
            </div>
        </div>
    );
}