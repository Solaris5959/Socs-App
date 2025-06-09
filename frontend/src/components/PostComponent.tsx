'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, ThumbsUp, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import SamplePostImg from "@/assets/works-space-bg.jpg";
import { useState } from "react";
import CommentComponent from "@/components/CommentComponent";
import { Post } from "@/interface/Post";
import { formatDate, formatTime } from '@/lib/formatDate';

interface PostComponentProps {
    postInfo: Post;
}

// PostComponent to display individual posts with comments and likes
export default function PostComponent({ postInfo }: PostComponentProps) {
    // state for comment toggle
    const [isExpanded, setIsExpanded] = useState(false);
    const [showComments, setShowComments] = useState(false);


    // toggle function
    const handleToggle = () => setIsExpanded(prev => !prev);
    const toggleComments = () => setShowComments(prev => !prev);

    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl 
        p-5 text-slate-700 dark:text-slate-300">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <Avatar className="w-14 h-14 border border-gray-200">
                        <AvatarImage src={postInfo.author.avatarUrl || undefined} alt="User Profile" />
                        <AvatarFallback className="font-semibold dark:bg-slate-700 text-slate-600 dark:text-slate-200">
                            CN
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-sm">
                        <p className="text-slate-800 dark:text-white font-bold">{postInfo.author.name}</p>
                        <p className="text-slate-500 dark:text-slate-400">{postInfo.author.position} at {postInfo.author.company}</p>
                    </div>
                </div>
                <div className="text-right text-xs text-gray-500 dark:text-slate-400">
                    <p>{formatDate(postInfo.createdAt)}</p>
                    <p>{formatTime(postInfo.createdAt)}</p>
                </div>
            </div>

            {/* Post Content */}
            <div className={`w-full mb-2 text-left text-sm leading-relaxed text-slate-800
                 dark:text-slate-200 whitespace-pre-wrap ${isExpanded ? '' : 'line-clamp-5'}`}>
                {postInfo.content}
            </div>

            {/* Toggle Button */}
            <div className="mb-4">
                <button
                    className="text-slate-800 hover:text-slate-400 p-0 h-auto cursor-pointer
                     text-sm font-medium hover:underline"
                    onClick={handleToggle}
                >
                    {isExpanded ? "Show Less" : "Show More"}
                </button>
            </div>

            {/* Post Image */}
            <div className="w-full mb-4">
                <Image
                    src={SamplePostImg}
                    width={800}
                    height={450}
                    alt="Post Image"
                    className="w-full h-auto rounded-lg object-cover shadow-sm border
                     border-slate-200 dark:border-slate-700"
                />
            </div>



            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-4">
                    <button type="button" className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-400 cursor-pointer">
                        <ThumbsUp className="w-4 h-4" />

                        {postInfo.likesCount > 0 ? (
                            <span>{postInfo.likesCount} Likes</span>
                        ) : (
                            <span>Like</span>
                        )}

                    </button>

                    {/* Comment Toggle Button */}
                    <button
                        type="button"
                        className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-400 cursor-pointer"
                        onClick={toggleComments}
                    >
                        <MessageCircle className="w-4 h-4" />

                        {postInfo.comments.length > 0 ? (
                            <span>{postInfo.comments.length} Comments</span>
                        ) : (
                            <span>Comment</span>
                        )}
                    </button>
                </div>

                {/* Favorite */}
                <button type="button" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-400 cursor-pointer px-3 py-1 rounded-full">
                    <Heart className="w-4 h-4" />
                    {postInfo.favoritesCount > 0 ? (
                        <span>{postInfo.favoritesCount} Favorites</span>
                    ) : (
                        <span>Favorite</span>
                    )}
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-4 space-y-3">
                    <div className="text-sm text-slate-600 dark:text-slate-300 space-y-4">
                        {/* Render Comment Component */}
                        {postInfo.comments.map(comment => (
                            <CommentComponent key={comment.commentId} comment={comment} />
                        ))}
                    </div>

                    {/* Comment input */}
                    <div className="flex items-start space-x-3">
                        <Avatar className="w-12 h-12 border border-gray-200">
                            <AvatarImage src={undefined} alt="User Profile" />
                            <AvatarFallback className="font-semibold dark:bg-slate-700 text-slate-600 dark:text-slate-200">
                                CN
                            </AvatarFallback>
                        </Avatar>
                        <textarea
                            className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-400 dark:bg-slate-700 dark:text-white"
                            rows={2}
                            placeholder="Write a comment..."
                        />
                    </div>
                </div>
            )}
        </div>
    );
}