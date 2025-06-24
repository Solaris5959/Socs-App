'use client';
import React, { useEffect, useState } from 'react';

import PostComponent from './PostComponent';
import { usePostContext } from '@/contexts/PostContext';

import { PostType } from '@/interface/Post';


export default function MyFavorites() {

    // Context to manage posts
    const { fetchFavoritePosts } = usePostContext();
    const [allPosts, setPosts] = useState<PostType[]>([]);



    // Effect to fetch posts on component mount
    useEffect(() => {

        // Fetch posts from the context
        const getPosts = async () => {

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
                {allPosts.map(post => (
                    <PostComponent key={post.id} postInfo={post} />
                ))}
            </div>
        </div>
    );
}