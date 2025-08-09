import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReplyType } from "@/interface/Post";
import { formatDate, formatTime } from '@/lib/formatDate';

interface ReplyProps {
    reply: ReplyType;
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
                        <AvatarImage src={reply.profile_pic_url || undefined} alt="User Profile" />
                        <AvatarFallback className="font-semibold dark:bg-slate-700 text-slate-600 dark:text-slate-200">
                            {reply.display_name?.charAt(0) ?? 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-sm">
                        <p className="text-slate-800 dark:text-white font-bold">{reply.display_name}</p>
                        {reply.company && reply.company !== 'N/A' && reply.position && reply.position !== 'N/A' && (
                            <p className="text-slate-500 dark:text-slate-400">{reply.position} at {reply.company}</p>
                        )}
                    </div>
                </div>
                <div className="text-right text-xs text-gray-500 dark:text-slate-400">
                    <p>{formatDate(reply.created_at)}</p>
                    <p>{formatTime(reply.created_at)}</p>
                </div>


            </div>

            {/* Reply Content */}
            <div className="w-full mb-2 text-left text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                {reply.content}
            </div>


        </div>
    )
}
