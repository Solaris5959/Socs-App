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

            // URL matches backend route: GET /posts
            const response = await fetch(`${API_URL}/posts`, {
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
            toast.error('Failed to fetch posts');
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
            // URL matches backend route: GET /posts/user
            const response = await fetch(`${API_URL}/posts/user`, {
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
    // Note: Backend returns only post IDs, you may need to fetch full post data separately
    const fetchFavouritePosts = async () => {
        setLoading(true);
        try {
            // get user token from local storage    
            const token = localStorage.getItem("access_token");
            // URL matches backend route: GET /posts/favourites
            const response = await fetch(`${API_URL}/posts/favourites`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Use Bearer token for authentication
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch favourite posts');
            }
            const data = await response.json();

            return data; // Return the fetched favourite post IDs (not full post data)

        } catch (error) {
            console.error('Error fetching favourite posts:', error);
            toast.error('Failed to fetch favourite posts');
        } finally {
            setLoading(false);
        }
    }

    // Legacy alias for backward compatibility
    const fetchFavoritePosts = fetchFavouritePosts;


    // Method to add a new post
    const addPost = async (content: string, image?: File) => {
        setLoading(true);
        try {
            // get user token from local storage    
            const token = localStorage.getItem("access_token");

            let body: BodyInit;
            let headers: HeadersInit = {
                'Authorization': `Bearer ${token}`, // Use Bearer token for authentication
            };

            if (image) {
                // Use FormData if there's an image
                const formData = new FormData();
                formData.append("content", content);
                formData.append("image", image);
                body = formData;
                // Do not set 'Content-Type' for FormData, browser will set it automatically
            } else {
                // Send JSON if no image
                headers['Content-Type'] = 'application/json';
                body = JSON.stringify({ content });
            }

            const response = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers,
                body,
            });
            if (!response.ok) {
                throw new Error('Failed to add a post');
            }
            const data = await response.json();

            toast.success('Post created successfully!');
            return data; // Return the added post data

        } catch (error) {
            console.error('Error adding a post:', error);
            toast.error('Failed to add a post.');
        } finally {
            setLoading(false);
        }
    }

    // Method to add a comment to a post
    const addComment = async (postId: string, content: string) => {
        setLoading(true);
        try {
            // get user token from local storage    
            const token = localStorage.getItem("access_token");

            // URL matches backend route: POST /posts/comments
            const response = await fetch(`${API_URL}/posts/comments`, {
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

            toast.success('Comment added successfully!');
            return data; // Return the added comment data

        } catch (error) {
            console.error('Error adding a comment:', error);
            toast.error('Failed to add a comment');
        } finally {
            setLoading(false);
        }
    }

    // Method to add a reply to a comment
    const addReply = async (commentId: string, content: string) => {
        setLoading(true);
        try {
            // get user token from local storage    
            const token = localStorage.getItem("access_token");

            // URL matches backend route: POST /posts/comments/replies
            const response = await fetch(`${API_URL}/posts/comments/replies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Use Bearer token for authentication
                },
                body: JSON.stringify({
                    commentId, // Backend only needs commentId, not postId
                    content,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to add a reply');
            }
            const data = await response.json();

            toast.success('Reply added successfully!');
            return data; // Return the added reply data

        } catch (error) {
            console.error('Error adding a reply:', error);
            toast.error('Failed to add a reply');
        } finally {
            setLoading(false);
        }
    }


    // Method to like a post
    const likePost = async (postId: string) => {
        setLoading(true);
        try {
            // get user token from local storage    
            const token = localStorage.getItem("access_token");

            // URL matches backend route: POST /posts/like
            const response = await fetch(`${API_URL}/posts/like`, {
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
                const errorData = await response.json();
                if (response.status === 409) {
                    toast.error('Post already liked');
                    return null;
                }
                throw new Error('Failed to like a post');
            }
            const data = await response.json();

            toast.success('Post liked!');
            return data; // Return the liked post data

        } catch (error) {
            console.error('Error liking a post:', error);
            toast.error('Failed to like a post');
        } finally {
            setLoading(false);
        }
    }

    // Method to favourite a post (British spelling to match backend)
    const favouritePost = async (postId: string) => {
        setLoading(true);
        try {
            // get user token from local storage    
            const token = localStorage.getItem("access_token");

            // URL matches backend route: POST /posts/favourite
            const response = await fetch(`${API_URL}/posts/favourite`, {
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
                const errorData = await response.json();
                if (response.status === 409) {
                    toast.error('Post already favourited');
                    return null;
                }
                throw new Error('Failed to add a favourite post');
            }
            const data = await response.json();

            toast.success('Post favourited!');
            return data; // Return the favourited post data

        } catch (error) {
            console.error('Error adding a favourite post:', error);
            toast.error('Failed to add a favourite post');
        } finally {
            setLoading(false);
        }
    }

    // Legacy alias for backward compatibility
    const favoritePost = favouritePost;

    // Method to unlike a post
    const unlikePost = async (postId: string) => {
        setLoading(true);
        try {
            // get user token from local storage    
            const token = localStorage.getItem("access_token");

            // URL matches backend route: DELETE /posts/like
            const response = await fetch(`${API_URL}/posts/like`, {
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

            toast.success('Post unliked!');
            return data; // Return the unliked post data

        } catch (error) {
            console.error('Error deleting a like from a post:', error);
            toast.error('Failed to delete a like from a post');
        } finally {
            setLoading(false);
        }
    }

    // Method to unfavourite a post (British spelling to match backend)
    const unfavouritePost = async (postId: string) => {
        setLoading(true);
        try {
            // get user token from local storage    
            const token = localStorage.getItem("access_token");

            // URL matches backend route: DELETE /posts/favourite
            const response = await fetch(`${API_URL}/posts/favourite`, {
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
                throw new Error('Failed to delete a favourite from a post');
            }
            const data = await response.json();

            toast.success('Post unfavourited!');
            return data; // Return the unfavourited post data

        } catch (error) {
            console.error('Error deleting a favourite from a post:', error);
            toast.error('Failed to delete a favourite from a post');
        } finally {
            setLoading(false);
        }
    }

    // Legacy alias for backward compatibility
    const unfavoritePost = unfavouritePost;

    // State variables to manage post features
    const value = {
        loading,
        fetchPosts,
        fetchUserPosts,
        fetchFavouritePosts,
        fetchFavoritePosts, // Legacy alias
        addPost,
        addComment,
        addReply,
        favouritePost,
        favoritePost, // Legacy alias
        likePost,
        unlikePost,
        unfavouritePost,
        unfavoritePost, // Legacy alias
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