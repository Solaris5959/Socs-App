import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReplyComponent from "@/components/ReplyComponent";
import { formatDate, formatTime } from '@/lib/formatDate';
import { CommentType, ReplyType } from "@/interface/Post";
import { MessageSquareReply } from 'lucide-react';

import { usePostContext } from "@/contexts/PostContext";
import { toast } from "sonner";

interface CommentProps {
    comment: CommentType;
}

export default function CommentComponent({ comment }: CommentProps) {

    const { getRepliesForComment, addReply } = usePostContext();

    const [replies, setReplies] = useState<ReplyType[]>([]);
    const [replyLoading, setReplyLoading] = useState(false);
    const [showReplies, setShowReplies] = useState(false);

    const toggleReply = async () => {
        setShowReplies((prev) => !prev);

        if (!showReplies) {
            setReplyLoading(true);
            try {
                const fetchedReplies = await getRepliesForComment(comment.id);
                setReplies(fetchedReplies);
            } catch (error) {
                console.error("Error fetching replies:", error);
            } finally {
                setReplyLoading(false);
            }
        }
    };

    const handleAddReply = async (event: React.FormEvent) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const replyInput = form.elements.namedItem('reply-input') as HTMLTextAreaElement;
        const newReply = replyInput.value.trim();

        if (!newReply) {
            toast.error('Reply cannot be empty. Please enter a reply.');
            return;
        }

        try {
            await addReply(comment.id, newReply);

            // Re-fetch all replies to ensure sync with backend
            const fetchedReplies = await getRepliesForComment(comment.id);
            setReplies(fetchedReplies);

            // Clear input
            replyInput.value = '';
        } catch (err) {
            console.error("Failed to add reply:", err);
            toast.error("Failed to add reply. Please try again.");
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-slate-800 border-none border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-slate-700 dark:text-slate-300">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3 ">
                    <Avatar className="w-12 h-12 border border-gray-200">
                        <AvatarImage src={comment.profile_pic_url || undefined} alt="User Profile" />
                        <AvatarFallback className="font-semibold dark:bg-slate-700 text-slate-600 dark:text-slate-200">
                            CN
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-sm">
                        <p className="text-slate-800 dark:text-white font-bold">{comment.display_name}</p>
                        {comment.company && comment.company !== 'N/A' && comment.position && comment.position !== 'N/A' && (
                            <p className="text-slate-500 dark:text-slate-400">{comment.position} at {comment.company}</p>
                        )}
                    </div>
                </div>
                <div className="text-right text-xs text-gray-500 dark:text-slate-400">
                    <p>{formatDate(comment.created_at)}</p>
                    <p>{formatTime(comment.created_at)}</p>
                </div>
            </div>

            {/* Comment Content */}
            <div className="w-full mb-2 text-left text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                {comment.content}
            </div>

            {/* Reply Toggle */}
            <div className="flex justify-end mt-2">
                <button
                    className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-400 cursor-pointer"
                    onClick={toggleReply}
                >
                    <MessageSquareReply className="w-4 h-4" />
                    {(comment.replies_count ?? 0) > 0 ? (
                        <span>{comment.replies_count} Replies</span>
                    ) : (
                        "Reply"
                    )}
                </button>
            </div>

            {/* Replies Section */}
            {showReplies && (
                <>
                    <div className="mt-4 space-y-3">
                        {replyLoading ? (
                            <p className="text-sm text-slate-500">Loading replies...</p>
                        ) : replies.length > 0 ? (
                            replies.map((reply) => (
                                <ReplyComponent key={reply.id} reply={reply} />
                            ))
                        ) : (
                            <p className="text-slate-500 dark:text-slate-400">No replies yet.</p>
                        )}
                    </div>

                    {/* Reply Input */}
                    <div className="flex items-start space-x-3 mt-6">
                        <form className="w-full" onSubmit={handleAddReply}>
                            <textarea
                                name="reply-input"
                                rows={2}
                                placeholder="Reply to this comment..."
                                className="w-full bg-white border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-400 dark:bg-slate-700 dark:text-white"
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    type="submit"
                                    className="px-4 py-1 bg-blue-500 hover:bg-blue-400 text-white text-sm rounded-2xl font-medium cursor-pointer"
                                >
                                    Reply
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}