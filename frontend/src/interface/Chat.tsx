//Chat.tsx
export interface ChatType {
    id: string,
    text: string,
    sender: string,
    timestamp: string,
    avatar: string,
    name: string,
}

export interface ChatHistoryType {
    id: string;
    user_id: string;  // This is the user id for the chat participant
    display_name: string;
    profile_pic_url: string;
    position: string;
    company: string;
    last_content: string;
    sent_at: string;
    is_online: boolean; // Indicates if the user is currently online
}

export interface ParticipantType {
    user_id: string;
    display_name: string;
    profile_pic_url: string | null; // Profile picture URL can be null if not set
    position: string;
    company: string;
    is_online: boolean; // Indicates if the user is currently online
}

