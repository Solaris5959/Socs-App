'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Images } from 'lucide-react';
import PostComponent from './PostComponent';
import { usePostContext } from '@/contexts/PostContext';
import { useProfile } from '@/contexts/UserContext';
import Image from 'next/image';
import { PostType } from '@/interface/Post';


export default function MyPosts() {

    // Context to manage posts
    const { addPost, fetchUserPosts } = usePostContext();

    // Get user profile from context
    const { userProfile } = useProfile();
    const [allPosts, setPosts] = useState<PostType[]>([]);

    // State to manage file input and preview image
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);



    // Method to re-load posts from the context
    const loadPosts = async () => {
        const postData = await fetchUserPosts();
        setPosts(postData);
    };


    // Effect to fetch posts on component mount
    useEffect(() => {

        // Fetch posts from the context
        const getPosts = async () => {

            // Call the fetchPosts function from context
            const postData = await fetchUserPosts();

            // Set the fetched posts to state
            setPosts(postData);

            console.log('Fetched posts:', postData);

        };

        // Call the function to fetch posts
        getPosts();

    }, []);


    // Handle post submission
    const handlePostSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const postContent = form.elements.namedItem('post-content') as HTMLTextAreaElement;
        const postImageInput = form.elements.namedItem('post-image') as HTMLInputElement;

        if (!postContent.value.trim()) return;

        // Prepare the post data
        const content = postContent.value.trim();
        const imageFile = postImageInput?.files?.[0];


        // Send the post data to the context
        const success = await addPost(content, imageFile);

        // If the post is successfully added, reset the form and clear the preview image
        if (success !== undefined && success) {
            // Reset form after submit
            form.reset();
            setPreviewImage(null);

            // Refresh posts
            await loadPosts();
        } else {
            // Handle error (e.g., show a notification)
            console.error('Failed to add post');
        }

    };


    // Handle image upload button click
    const handleImageButtonClick = () => {
        fileInputRef.current?.click();
    };


    // Handle image change
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };



    return (
        <div className="flex flex-col items-center px-4 py-8 min-h-screen dark:bg-gray-900">
            {/* New post input box */}
            <div className="w-full max-w-2xl bg-white border border-gray-200 dark:border-slate-700 rounded-2xl py-4 px-6 dark:bg-slate-800">
                <div className="flex space-x-4">
                    {/* Avatar */}
                    <Avatar className="w-14 h-14 border border-gray-50">
                        {userProfile && (
                            <AvatarImage src={userProfile.profile_pic_url} alt="User Profile" />
                        )}
                        <AvatarFallback className="font-semibold dark:bg-slate-700 text-slate-600 dark:text-slate-200">
                            CN
                        </AvatarFallback>
                    </Avatar>

                    {/* Post form */}
                    <form className="flex-1 flex flex-col" onSubmit={handlePostSubmit}>
                        <label htmlFor="post-content" className="sr-only">What&#39;s on your mind?</label>
                        <textarea
                            id="post-content"
                            name="post-content"
                            rows={3}
                            placeholder="What's on your mind?"
                            className="w-full resize-none border border-slate-200 dark:border-slate-600
                                bg-transparent rounded-xl p-3 text-sm text-slate-800 dark:text-slate-200
                                placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
                        />

                        {/* Image preview */}
                        {previewImage && (
                            <div className="relative mt-3">
                                {/* Delete button */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPreviewImage(null);
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }}
                                    className="absolute top-1 right-1 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs z-10"
                                    aria-label="Remove image"
                                >
                                    ✕
                                </button>

                                {/* Preview image */}
                                <Image
                                    src={previewImage}
                                    alt="Preview"
                                    width={500}
                                    height={500}
                                    className="w-full max-h-full rounded-lg object-cover border border-slate-300 dark:border-slate-600"
                                />
                            </div>
                        )}

                        {/* Hidden file input */}
                        <input
                            type="file"
                            id="post-image"
                            name="post-image"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        {/* Action buttons */}
                        <div className="flex justify-between items-center mt-3">
                            <button
                                type="button"
                                onClick={handleImageButtonClick}
                                className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-400 cursor-pointer"
                            >
                                <Images className="w-5 h-5" />
                                <span>Add Photo</span>
                            </button>

                            <button
                                type="submit"
                                className="px-8 py-2 bg-blue-500 hover:bg-blue-400 text-white text-sm 
                                    rounded-2xl font-medium cursor-pointer"
                            >
                                Post
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Post feed */}
            <div className="mt-8 w-full max-w-2xl space-y-4">
                {allPosts.map(post => (
                    <PostComponent key={post.id} postInfo={post} />
                ))}
            </div>
        </div>
    );
}