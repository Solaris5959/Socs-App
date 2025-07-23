//Chat.tsx
export interface ChatType{
    id: string,
    text: string,
    sender: string,
    timestamp: string,
    avatar: string,
    name: string,
}

export interface ChatHistoryType{
    id: string;
    name: string;
    user_id: string;
    poistion: string;
    company: string;
    lastMessage: string;
    avatar_URL: string;
    time: string;
    is_online: boolean;
    avatar: string;
}