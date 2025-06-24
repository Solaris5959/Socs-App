import { ConnectionProfileType } from "./ConnectionProfile";

// Interface for the ConnectionContext
export interface ConnectionContextType {
    fetchUserConnections: () => Promise<ConnectionProfileType[]>
    fetchSuggestConnections: () => Promise<ConnectionProfileType[]>;
    fetchConnectionRequests: () => Promise<ConnectionProfileType[]>;
    sendFollow: (userId: string) => Promise<void>;
    unfollow: (userId: string) => Promise<void>;
    sendConnectionRequest: (userId: string) => Promise<void>;
    acceptConnectionRequest: (requestId: string) => Promise<void>;
    declineConnectionRequest: (requestId: string) => Promise<void>;
    removeConnection: (connectionId: string) => Promise<void>;
}
