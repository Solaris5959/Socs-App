import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Reply } from "@/interface/Post";
import { formatDate, formatTime } from '@/lib/formatDate';

interface ReplyProps {
    reply: Reply;
}
// ReplyComponent to display individual replies to comments
export default function ReplyComponent({ reply }: ReplyProps) {


    return (
        <div className="bg-green-50  dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl 
        p-5 text-slate-700 dark:text-slate-300">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10 border border-gray-200">
                        <AvatarImage src={reply.author.avatarUrl || undefined} alt="User Profile" />
                        <AvatarFallback className="font-semibold dark:bg-slate-700 text-slate-600 dark:text-slate-200">
                            CN
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-sm">
                        <p className="text-slate-800 dark:text-white font-bold">{reply.author.name}</p>
                        <p className="text-slate-500 dark:text-slate-400">{reply.author.position} at {reply.author.company}</p>
                    </div>
                </div>
                <div className="text-right text-xs text-gray-500 dark:text-slate-400">
                    <p>{formatDate(reply.createdAt)}</p>
                    <p>{formatTime(reply.createdAt)}</p>
                </div>


            </div>

            {/* Reply Content */}
            <div className="w-full mb-2 text-left text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                {reply.content}
            </div>


        </div>
    )
}
