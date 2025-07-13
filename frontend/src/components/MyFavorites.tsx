'use client';
import React, { useEffect, useState } from 'react';

import PostComponent from './PostComponent';
import { usePostContext } from '@/contexts/PostContext';

import { PostType } from '@/interface/Post';
import { Skeleton } from "@/components/ui/skeleton"

export default function MyFavorites() {

    // Context to manage posts
    const { fetchFavoritePosts } = usePostContext();
    const [allPosts, setPosts] = useState<PostType[]>([]);



    // Effect to fetch posts on component mount
    useEffect(() => {

        // Fetch posts from the context
        const getPosts = async () => {

            // ! Simulate a delay 0.5 s
            await new Promise(resolve => setTimeout(resolve, 500));


            // Call the fetchPosts function from context
            const postData = await fetchFavoritePosts();

            // Set the fetched posts to state
            setPosts(postData);

            console.log('Fetched posts:', postData);

        };

        // Call the function to fetch posts
        getPosts();

    }, []);




    return (
        <div className="flex flex-col items-center px-4 py-8 min-h-screen dark:bg-gray-900">


            {/* Favorite Post feed */}
            <div className="mt-8 w-full max-w-2xl space-y-4">

                {/* Loading skeleton while posts are being fetched */}
                {allPosts.length === 0 && (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                <div className="flex items-center space-x-3 mb-4">
                                    <Skeleton className="w-10 h-10 rounded-full" />
                                    <Skeleton className="w-24 h-4" />
                                </div>
                                <Skeleton className="h-6 mb-2" />
                                <Skeleton className="h-40" />
                            </div>
                        ))}
                    </div>
                )}
                {allPosts.map(post => (
                    <PostComponent key={post.id} postInfo={post} />
                ))}
            </div>
        </div>
    );
}