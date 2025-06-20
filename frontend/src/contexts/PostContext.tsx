
'use client'
import { createContext, useContext, useState } from 'react';
import { PostContextType } from '@/interface/PostContextType';

import { toast } from "sonner"


// Create a context for post management
// Todo: Add toast for each method to show success or error messages
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

            return data; // Return the fetched posts data

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

            return data; // Return the fetched user posts data

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

            return data; // Return the fetched favorite posts data

        } catch (error) {
            console.error('Error fetching favorite posts:', error);
            toast.error('Failed to fetch favorite posts');
        } finally {
            setLoading(false);
        }
    }




    // Todo: Method to add a new post
    const addPost = async (content: string, image?: File) => {
        setLoading(true);
        try {
            // get user token from local storage    
            const token = localStorage.getItem("access_token");

            let body: BodyInit;

            if (image) {
                // Use FormData if there's an image
                const formData = new FormData();
                formData.append("content", content);
                formData.append("image", image);
                body = formData;
                // Do not set 'Content-Type', browser will set it to multipart/form-data with boundary
            } else {
                // Send JSON if no image
                body = JSON.stringify({ content });
            }
            // Fetch favorite posts from the API
            const response = await fetch(`${API_URL}/socs/api/v1/index/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Use Bearer token for authentication
                },
                body,
            });
            if (!response.ok) {
                throw new Error('Failed to add a post');
            }
            const data = await response.json();

            return data; // Return the added post data



        } catch (error) {
            console.error('Error adding a post:', error);
            toast.error('Failed to add a post.');
        } finally {
            setLoading(false);
        }
    }

    // Todo: Method to add a comment to a post
    const addComment = async (postId: string, content: string) => {
        setLoading(true);
        try {
            // get user token from local storage    
            const token = localStorage.getItem("access_token");

            // Fetch favorite posts from the API
            const response = await fetch(`${API_URL}/socs/api/v1/index/posts/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Use Bearer token for authentication
                },
                body: JSON.stringify({
                    postId,
                    content,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to add a comment');
            }
            const data = await response.json();

            return data; // Return the added comment data

        } catch (error) {
            console.error('Error adding a comment:', error);
            toast.error('Failed to add a comment');
        } finally {
            setLoading(false);
        }
    }

    const addReply = async (postId: string, commentId: string, content: string) => {
        setLoading(true);
        try {
            // get user token from local storage    
            const token = localStorage.getItem("access_token");

            // Fetch favorite posts from the API
            const response = await fetch(`${API_URL}/socs/api/v1/index/posts/comments/replies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Use Bearer token for authentication
                },
                body: JSON.stringify({
                    postId,
                    commentId,
                    content,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to add a reply');
            }
            const data = await response.json();

            return data; // Return the added reply data

        } catch (error) {
            console.error('Error adding a replay:', error);
            toast.error('Failed to add a replay');
        } finally {
            setLoading(false);
        }
    }


    // Todo: Method to like a post
    const likePost = async (postId: string) => {
        setLoading(true);
        try {
            // get user token from local storage    
            const token = localStorage.getItem("access_token");

            // Fetch favorite posts from the API
            const response = await fetch(`${API_URL}/socs/api/v1/index/posts/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Use Bearer token for authentication
                },
                body: JSON.stringify({
                    postId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to like a post');
            }
            const data = await response.json();

            return data; // Return the liked post data

        } catch (error) {
            console.error('Error liking a post:', error);
            toast.error('Failed to like a post');
        } finally {
            setLoading(false);
        }
    }

    // Todo: Method to favorite a post
    const favoritePost = async (postId: string) => {
        setLoading(true);
        try {
            // get user token from local storage    
            const token = localStorage.getItem("access_token");

            // Fetch favorite posts from the API
            const response = await fetch(`${API_URL}/socs/api/v1/index/posts/favorite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Use Bearer token for authentication
                },
                body: JSON.stringify({
                    postId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to add a favorite post');
            }
            const data = await response.json();

            return data; // Return the favorited post data

        } catch (error) {
            console.error('Error adding a favorite post:', error);
            toast.error('Failed to add a favorite post');
        } finally {
            setLoading(false);
        }
    }

    // Todo: Method to unlike a post
    const unlikePost = async (postId: string) => {
        setLoading(true);
        try {
            // get user token from local storage    
            const token = localStorage.getItem("access_token");

            // Fetch favorite posts from the API
            const response = await fetch(`${API_URL}/socs/api/v1/index/posts/like`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Use Bearer token for authentication
                },
                body: JSON.stringify({
                    postId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to delete a like from a post');
            }
            const data = await response.json();

            return data; // Return the unliked post data

        } catch (error) {
            console.error('Error deleting a like from a post:', error);
            toast.error('Failed to delete a like from a post');
        } finally {
            setLoading(false);
        }
    }

    // Todo: Method to unfavorite a post
    const unfavoritePost = async (postId: string) => {
        setLoading(true);
        try {
            // get user token from local storage    
            const token = localStorage.getItem("access_token");

            // Fetch favorite posts from the API
            const response = await fetch(`${API_URL}/socs/api/v1/index/posts/favorite`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Use Bearer token for authentication
                },
                body: JSON.stringify({
                    postId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to delete a favorite from a post');
            }
            const data = await response.json();

            return data; // Return the unfavorited post data

        } catch (error) {
            console.error('Error deleting a favorite from a post:', error);
            toast.error('Failed to delete a favorite from a post');
        } finally {
            setLoading(false);
        }
    }





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