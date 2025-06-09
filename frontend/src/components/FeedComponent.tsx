import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Images } from 'lucide-react';
import PostComponent from './PostComponent';
import SAMPLE_POSTS from "@/assets/sample-posts"; // Assuming you have a sample posts data file

export default function FeedComponent() {


    // Todo: Call post context to fetch posts and display them

    // Test data for posts
    const posts = SAMPLE_POSTS; // Replace with actual post data from context or API


    return (
        <div className="flex flex-col items-center px-4 py-8 min-h-screen dark:bg-gray-900">
            {/* Create a new post container */}
            <div className="w-full max-w-2xl bg-white  border border-gray-200
             dark:border-slate-700 rounded-2xl py-4 px-6  dark:bg-slate-800">
                <div className="flex space-x-4">

                    {/* Avatar */}
                    <Avatar className="w-14 h-14 border border-gray-200">
                        <AvatarImage src={undefined} alt="User Profile" />
                        <AvatarFallback className="font-semibold dark:bg-slate-700 text-slate-600 dark:text-slate-200">
                            CN
                        </AvatarFallback>
                    </Avatar>

                    {/* Post Form */}
                    <form className="flex-1 flex flex-col">

                        {/* Textarea Input */}
                        <label htmlFor="post-content" className="sr-only">What&apos;s on your mind?</label>
                        <textarea
                            id="post-content"
                            rows={3}
                            placeholder="What's on your mind?"
                            className="w-full resize-none border border-slate-200 dark:border-slate-600
                             bg-transparent rounded-xl p-3 text-sm text-slate-800 dark:text-slate-200
                              placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
                        />

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center mt-3">
                            <button
                                type="button"
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