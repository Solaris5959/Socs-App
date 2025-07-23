'use client';
import React, { useEffect, useState } from 'react';

import PostComponent from './PostComponent';
import { usePostContext } from '@/contexts/PostContext';

import { PostType } from '@/interface/Post';
import { Skeleton } from "@/components/ui/skeleton";

export default function MyFavorites() {

    const { fetchFavoritePosts } = usePostContext();
    const [allPosts, setPosts] = useState<PostType[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Track loading state

    useEffect(() => {
        const getPosts = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));
            const postData = await fetchFavoritePosts();
            setPosts(postData);
            setIsLoading(false);
            console.log('Fetched posts:', postData);
        };
        getPosts();
    }, []);

    return (
        <div className="flex flex-col items-center px-4 py-8 min-h-screen dark:bg-gray-900">
            <div className="mt-8 w-full max-w-2xl space-y-4">

                {/* Loading state */}
                {isLoading && (
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

                {/* No favorites message */}
                {!isLoading && allPosts.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-300 mt-10">
                        You don’t have any favorite posts yet.
                    </div>
                )}

                {/* Favorite posts */}
                {allPosts.map(post => (
                    <PostComponent key={post.id} postInfo={post} />
                ))}

            </div>
        </div>
    );
}