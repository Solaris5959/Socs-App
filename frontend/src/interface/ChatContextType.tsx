import { ChatHistoryType, ParticipantType } from "./Chat";



// Interface for the AuthContextex
export interface ChatContextType {
    loading: boolean;
    chatHistory: ChatHistoryType[];
    fetchChatByUserId: (user_id: string) => Promise<ChatHistoryType[]>;
    sendMessage: (receiver_id: string, message: string) => Promise<void>;
    chatParticipant: ParticipantType | null;
    setChatParticipant: (participant: ParticipantType) => void;
}
