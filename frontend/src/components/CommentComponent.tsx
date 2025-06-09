import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReplyComponent from "@/components/ReplyComponent";
import { formatDate, formatTime } from '@/lib/formatDate';
import { Comment } from "@/interface/Post";
import { MessageSquareReply } from 'lucide-react';

interface CommentProps {
    comment: Comment;
}
// Comment Component to display user comments
export default function CommentComponent({ comment }: CommentProps) {

    const [showReply, setShowReply] = useState(false);
    const toggleReply = () => setShowReply(prev => !prev);

    return (
        <div className="bg-gray-50 dark:bg-slate-800 border-none border-slate-200 dark:border-slate-700 rounded-2xl 
        p-5 text-slate-700 dark:text-slate-300">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3 ">
                    <Avatar className="w-12 h-12 border border-gray-200">
                        <AvatarImage src={comment.author.avatarUrl || undefined} alt="User Profile" />
                        <AvatarFallback className="font-semibold dark:bg-slate-700 text-slate-600 dark:text-slate-200">
                            CN
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-sm">
                        <p className="text-slate-800 dark:text-white font-bold">{comment.author.name}</p>
                        <p className="text-slate-500 dark:text-slate-400">{comment.author.position} at {comment.author.company}</p>
                    </div>
                </div>
                <div className="text-right text-xs text-gray-500 dark:text-slate-400">
                    <p>{formatDate(comment.createdAt)}</p>
                    <p>{formatTime(comment.createdAt)}</p>
                </div>
            </div>

            {/* Comment Content */}
            <div className="w-full mb-2 text-left text-sm leading-relaxed text-slate-800 
                dark:text-slate-200 whitespace-pre-wrap">
                {comment.content}
            </div>

            {/* Reply Toggle */}
            <div className="flex justify-end mt-2">
                <button
                    className="flex items-center  gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-400 cursor-pointer"
                    onClick={toggleReply}
                >

                    <MessageSquareReply className="w-4 h-4" />
                    {comment.replies.length > 0 ? (
                        <span>{comment.replies.length} Replies</span>
                    ) : ""}
                </button>
            </div>

            {/* Conditionally render reply section */}
            {showReply && (
                <div className="mt-4 space-y-3">
                    {/* Render existing replies */}

                    {comment.replies.map(reply => (
                        <ReplyComponent key={reply.replyId} reply={reply} />
                    ))}

                    {/* Reply input */}
                    <div className="flex items-start space-x-3 mt-6">
                        <Avatar className="w-12 h-12 border border-gray-200">
                            <AvatarImage src={undefined} alt="User Profile" />
                            <AvatarFallback className="font-semibold
                             dark:bg-slate-700 text-slate-600 dark:text-slate-200">
                                CN
                            </AvatarFallback>
                        </Avatar>
                        <textarea
                            className="w-full bg-white border border-slate-300 dark:border-slate-600 
                            rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 
                            focus:ring-slate-400 dark:bg-slate-700 dark:text-white"
                            rows={2}
                            placeholder="Reply to this comment..."
                        />
                    </div>
                </div>
            )}
        </div>
    );
}