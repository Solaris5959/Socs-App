
'use client'
import { createContext, useContext, useState } from 'react';
import { PostContextType } from '@/interface/PostContextType';

import { toast } from "sonner"


// Create a context for post management
export const PostContext = createContext<PostContextType | undefined>(undefined);

// URL for the authentication service
const API_URL = process.env.NEXT_PUBLIC_LOCAL_API;


// PostProvider component to provide post context to the application
export function PostProvider({ children }: { children: React.ReactNode }) {

    // State to manage posts, favorite posts, and user posts

    const [loading, setLoading] = useState<boolean>(false);


    // Fetch posts from the API
    const fetchPosts = async () => {
        setLoading(true);
        try {
            // get user token from local storage
            const token = localStorage.getItem("access_token");

            // Fetch posts from the API
            const response = await fetch(`${API_URL}/socs/api/v1/index/posts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Use Bearer token for authentication 
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const data = await response.json();

        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    }

    // Fetch user posts from the API
    const fetchUserPosts = async () => {
        setLoading(true);
        try {
            // get user token from local storage
            const token = localStorage.getItem("access_token");
            // Fetch user posts from the API
            const response = await fetch(`${API_URL}/socs/api/v1/index/posts/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Use Bearer token for authentication
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user posts');
            }
            const data = await response.json();

        } catch (error) {
            console.error('Error fetching user posts:', error);
            toast.error('Failed to fetch user posts');
        } finally {
            setLoading(false);
        }
    }

    // Fetch favorite posts from the API
    const fetchFavoritePosts = async () => {
        setLoading(true);
        try {
            // get user token from local storage    
            const token = localStorage.getItem("access_token");
            // Fetch favorite posts from the API
            const response = await fetch(`${API_URL}/socs/api/v1/index/posts/favorites`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Use Bearer token for authentication
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch favorite posts');
            }
            const data = await response.json();

        } catch (error) {
            console.error('Error fetching favorite posts:', error);
            toast.error('Failed to fetch favorite posts');
        } finally {
            setLoading(false);
        }
    }




    // Todo: Method to add a new post
    const addPost = async (content: string, image?: File) => {



    }

    // Todo: Method to add a comment to a post
    const addComment = async (postId: string, content: string) => {

    }

    const addReply = async (postId: string, commentId: string, content: string) => {

    }


    // Todo: Method to like a post
    const likePost = async (postId: string) => {

    }

    // Todo: Method to favorite a post
    const favoritePost = async (postId: string) => {
    }

    // Todo: Method to unlike a post
    const unlikePost = async (postId: string) => {

    }

    // Todo: Method to unfavorite a post
    const unfavoritePost = async (postId: string) => {

    }  // Todo: Method to add a reply to a comment





    // State variables to manage post features
    const value = {
        loading,
        fetchPosts,
        fetchUserPosts,
        fetchFavoritePosts,
        addPost,
        addComment,
        addReply,
        favoritePost,
        likePost,
        unlikePost,
        unfavoritePost,
    }

    return (
        <PostContext.Provider value={value}>
            {children}
        </PostContext.Provider>
    );


}

// Custom hook to use the PostContext
export function usePostContext() {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error('usePostContext must be used within a PostProvider');
    }
    return context;
}