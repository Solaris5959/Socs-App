'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, ThumbsUp, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { toast } from "sonner"
import { useState, useEffect } from "react";
import { useProfile } from '@/contexts/UserContext';
import CommentComponent from "@/components/CommentComponent";
import { PostType } from "@/interface/Post";
import { formatDate, formatTime } from '@/lib/formatDate';
import { usePostContext } from "@/contexts/PostContext";
import { CommentType } from "@/interface/Post";

interface PostComponentProps {
    postInfo: PostType;
}

// PostComponent to display individual posts with comments and likes
export default function PostComponent({ postInfo }: PostComponentProps) {

    // Get post context to manage posts
    const { getCommentsForPost, addComment, likePost, unlikePost, favoritePost, unfavoritePost } = usePostContext();
    const { userProfile } = useProfile();

    // State for comments
    const [comments, setComments] = useState<CommentType[]>([]);
    const [commentLoading, setCommentLoading] = useState(false);

    // Steate for like and favorite counts
    const [likeCount, setLikeCount] = useState(postInfo.like_count || 0);
    const [toggledLike, setToggledLike] = useState(false);
    const [favouriteCount, setFavouriteCount] = useState(postInfo.favourite_count || 0);
    const [toggledFavourite, setToggledFavourite] = useState(false);


    // state for comment toggle
    const [isExpanded, setIsExpanded] = useState(false);
    const [showComments, setShowComments] = useState(false);


    useEffect(() => {
        if (postInfo.liked_by_user) {
            setToggledLike(true);
        }

        if (postInfo.favourited_by_user) {
            setToggledFavourite(true);
        }
    }, [postInfo.liked_by_user, postInfo.favourited_by_user]);

    // Function to handle expanding/collapsing post content
    const handleToggle = () => setIsExpanded(prev => !prev);

    // Function to add a new comment
    const handleAddComment = async (event: React.FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const commentInput = form.elements.namedItem('comment-input') as HTMLTextAreaElement;
        const newComment = commentInput.value.trim();

        if (!newComment) {
            toast.error('Comment cannot be empty. Please enter a comment.');
            return;
        }

        try {
            // Add comment to backend
            await addComment(postInfo.id, newComment);

            // Refresh comment list from backend
            const fetchedComments = await getCommentsForPost(postInfo.id);
            setComments(fetchedComments);

            // Clear input field
            commentInput.value = '';

        } catch (err) {
            console.error("Failed to add comment:", err);
        }
    };


    // Toggle comment section and fetch comments when needed
    const toggleComments = async () => {
        setShowComments((prev) => !prev);

        if (!showComments) { // Only fetch on expanding
            setCommentLoading(true);
            try {
                const fetchedComments = await getCommentsForPost(postInfo.id);
                setComments(fetchedComments);

                console.log("Fetched comments:", fetchedComments);
            } catch (err) {
                console.error("Failed to fetch comments:", err);
            } finally {
                setCommentLoading(false);
            }
        }
    };

    // Method to handle like post
    const handleLikePost = async () => {

        // Get the post ID from postInfo
        const postId = postInfo.id;

        try {
            if (!toggledLike) {
                // Call likePost function from context
                await likePost(postId);
                setLikeCount((prev) => prev + 1);
                setToggledLike(true);

            } else {
                // Call unlikePost function from context
                await unlikePost(postId);
                setLikeCount((prev) => prev - 1);
                setToggledLike(false);

            }
        } catch (err) {
            console.error("Failed to toggle like:", err);
        }
    };

    // Method to handle favorite post
    const handleFavouritePost = async () => {

        // Get the post ID from postInfo
        const postId = postInfo.id;

        try {
            if (!toggledFavourite) {
                // Call favouritePost function from context
                await favoritePost(postId);
                setFavouriteCount((prev) => prev + 1);
                setToggledFavourite(true);

            } else {
                // Call unfavoritePost function from context
                await unfavoritePost(postId);
                setFavouriteCount((prev) => prev - 1);
                setToggledFavourite(false);

            }
        } catch (err) {
            console.error("Failed to toggle favorite:", err);
        }
    };




    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl 
        p-5 text-slate-700 dark:text-slate-300">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <Avatar className="w-14 h-14 border border-gray-200">
                        <AvatarImage src={postInfo.profile_pic_url || undefined} alt="User Profile" />
                        <AvatarFallback className="font-semibold dark:bg-slate-700 text-slate-600 dark:text-slate-200">
                            SO
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-sm">
                        <p className="text-slate-800 dark:text-white font-bold">{postInfo.display_name}</p>
                        {/* Display company and position if available */}
                        {postInfo.profile_company && postInfo.profile_company !== 'N/A'
                            && postInfo.profile_position && postInfo.profile_position !== 'N/A' && (
                                <p className="text-slate-500 dark:text-slate-400">{postInfo.profile_position} at {postInfo.profile_company}</p>
                            )}
                    </div>
                </div>
                <div className="text-right text-xs text-gray-500 dark:text-slate-400">
                    <p>{formatDate(postInfo.created_at)}</p>
                    <p>{formatTime(postInfo.created_at)}</p>
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
            {postInfo.media_url ? (
                <div className="w-full mb-4">
                    <Image
                        src={postInfo.media_url}
                        width={800}
                        height={450}
                        alt="Post Image"
                        className="w-full h-auto rounded-lg object-cover shadow-sm border
                     border-slate-200 dark:border-slate-700"
                    />
                </div>) : (
                ""
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        className={`flex items-center gap-1 text-sm cursor-pointer px-1 py-1 transition-all
                        ${toggledLike ? 'text-blue-500 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-400'}
                        `}
                        onClick={handleLikePost}
                    >
                        <ThumbsUp className="w-4 h-4" />
                        {likeCount > 0 ? (
                            <span>{likeCount} Likes</span>
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

                        {postInfo.comment_count > 0 ? (
                            <span>{postInfo.comment_count} Comments</span>
                        ) : (
                            <span>Comment</span>
                        )}
                    </button>
                </div>

                {/* Favorite Button */}
                <button
                    type="button"
                    className={`flex items-center gap-1 text-sm cursor-pointer px-3 py-1 rounded-full transition-all
                        ${toggledFavourite ? 'text-red-500 font-semibold' : 'text-slate-500 hover:text-slate-400'}
                    `}
                    onClick={handleFavouritePost}
                >
                    <Heart className="w-4 h-4" />
                    {favouriteCount > 0 ? (
                        <span>{favouriteCount} Favorites</span>
                    ) : (
                        <span>Favorite</span>
                    )}
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-4 space-y-3">
                    {commentLoading ? (
                        <p className="text-sm text-slate-500">Loading comments...</p>
                    ) : (
                        comments.length > 0 ? (
                            comments.map(comment => (
                                <CommentComponent key={comment.id} comment={comment} />
                            ))
                        ) : (
                            <p className="text-sm text-slate-500">No comments yet.</p>
                        )
                    )}

                    {/* Comment input */}
                    <div className="flex items-start space-x-3">
                        <Avatar className="w-12 h-12 border border-gray-200">
                            <AvatarImage src={userProfile?.profile_pic_url || "empty"} alt="User Profile" />
                            <AvatarFallback className="font-semibold dark:bg-slate-700 text-slate-600 dark:text-slate-200">
                                CN
                            </AvatarFallback>
                        </Avatar>
                        <form action="submit" className="w-full " onSubmit={handleAddComment}>
                            <textarea
                                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-400 dark:bg-slate-700 dark:text-white"
                                rows={2}
                                placeholder="Write a comment..."
                                name="comment-input"

                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    type="submit"
                                    className="px-4 py-1 bg-blue-500 hover:bg-blue-400 text-white text-sm 
                                    rounded-2xl font-medium cursor-pointer"
                                >
                                    Comment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}