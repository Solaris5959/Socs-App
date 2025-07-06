// Interface for the AuthContextex
export interface ChatContextType {
    chatHistory: string[];
    fetchChatByUserId: (user_id: string) => Promise<string[]>;
    sendMessage: (receiver_id: string, message: string) => Promise<void>;
}
