export interface ChatHistory {
    userId: string;
    messages: ChatMessage[];
}

export interface ChatMessage {
    sender: string;
    content: string;
    timestamp: Date;
}