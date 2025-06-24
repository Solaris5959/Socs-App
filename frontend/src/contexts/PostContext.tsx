'use client'
import { createContext, useContext, useState } from 'react';
import { PostContextType } from '@/interface/PostContextType';
import { PostType } from '@/interface/Post';
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
    const fetchPosts = async (limit = 20, offset = 0): Promise<PostType[]> => {
        setLoading(true);
        try {

            const token = localStorage.getItem("access_token");

            // Set limit and offset for pagination

            const response = await fetch(
                `${API_URL}/socs/api/v1/index/dashboard?limit=${limit}&offset=${offset}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }

            const data = await response.json();

            // Ensure it's an array before returning
            return data

        } catch (error) {
            console.error('Error fetching posts:', error);
            toast.error('Failed to fetch posts');
            return []; // Ensure fallback is always an array
        } finally {
            setLoading(false);
        }
    };

    // Fetch user posts from the API
    const fetchUserPosts = async (limit = 20, offset = 0): Promise<PostType[]> => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");

            const response = await fetch(
                `${API_URL}/socs/api/v1/index/dashboard/my-posts?limit=${limit}&offset=${offset}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }

            const data = await response.json();

            // Ensure it's an array before returning
            return data

        } catch (error) {
            console.error('Error fetching posts:', error);
            toast.error('Failed to fetch posts');
            return []; // Ensure fallback is always an array
        } finally {
            setLoading(false);
        }
    };

    // Fetch favorite posts from the API
    const fetchFavouritePosts = async (limit = 20, offset = 0): Promise<PostType[]> => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");

            const response = await fetch(
                `${API_URL}/socs/api/v1/index/dashboard/favorite-posts?limit=${limit}&offset=${offset}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }

            const data = await response.json();

            // Ensure it's an array before returning
            return data

        } catch (error) {
            console.error('Error fetching posts:', error);
            toast.error('Failed to fetch posts');
            return []; // Ensure fallback is always an array
        } finally {
            setLoading(false);
        }
    };

    // Get comments for a post by post ID
    const getCommentsForPost = async (postId: string) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");

            const response = await fetch(`${API_URL}/socs/api/v1/index/post/comments/${postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }

            const data = await response.json();
            return data; // Array of comments
        } catch (error) {
            console.error('Error fetching comments:', error);
            toast.error('Failed to fetch comments');
            return []; // Fallback
        } finally {
            setLoading(false);
        }
    };




    // Get replies for a comment by comment ID
    const getRepliesForComment = async (commentId: string) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");

            const response = await fetch(`${API_URL}/socs/api/v1/index/post/replies/${commentId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch replies');
            }

            const data = await response.json();
            return data; // Array of replies
        } catch (error) {
            console.error('Error fetching replies:', error);
            toast.error('Failed to fetch replies');
            return []; // Fallback
        } finally {
            setLoading(false);
        }
    };


    // Legacy alias for backward compatibility
    const fetchFavoritePosts = fetchFavouritePosts;


    // Method to add a new post
    const addPost = async (content: string, image?: File) => {
        setLoading(true);
        try {
            // get user token from local storage    
            const token = localStorage.getItem("access_token");

            let body: BodyInit;
            const headers: HeadersInit = {
                'Authorization': `Bearer ${token}`, // Use Bearer token for authentication
            };

            // If an image is provided, use FormData to send both content and image
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

            const response = await fetch(`${API_URL}/socs/api/v1/index/posts`, {
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
            return null; // Return null on error
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
            const response = await fetch(`${API_URL}/socs/api/v1/index/posts/comments/replies`, {
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
                const errorData = await response.json();
                if (response.status === 409) {
                    toast.error('Post already liked');
                    return null;
                }
                throw new Error(errorData.error || 'Failed to create post');
            }
            const data = await response.json();

            toast.success('Liked the post!');
            return data; // Return the liked post data

        } catch (error) {
            console.error('Error liking a post:', error);
            toast.error('Failed to like a post');
            return false; // Return false on error
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
            const response = await fetch(`${API_URL}/socs/api/v1/index/posts/favourite`, {
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
                throw new Error(errorData.error || 'Failed to create post');
            }
            const data = await response.json();

            toast.success('Added post to favourites!');
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

            toast.success('Unliked the post!');
            return data; // Return the unliked post data

        } catch (error) {
            console.error('Error deleting a like from a post:', error);
            toast.error('Failed to delete a like from a post');
            return false
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
            const response = await fetch(`${API_URL}/socs/api/v1/index/posts/favourite`, {
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

            toast.success('Removed post from favourites!');
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
        getCommentsForPost,
        getRepliesForComment,
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