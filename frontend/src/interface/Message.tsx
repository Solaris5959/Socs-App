// Mock interface for a message
export interface Message {
    id: string;
    text: string;
    sender: string;
    timestamp: string;
    avatar?: string;
    name?: string;
}

export interface FetchMessage {
    id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    sent_at: string;
}

