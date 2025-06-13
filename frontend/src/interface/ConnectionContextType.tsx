// Interface for the AuthContextex
export interface ConnectionContextType {
    fetchSuggestConnections: () => Promise<void>; // API: GET /socs/api/v1/index/connections
    fetchUserConnections: () => Promise<void>; // API: GET /socs/api/v1/index/connections/user
    fetchConnectionRequests: () => Promise<void>; // API: GET /socs/api/v1/index/connections/requests
    sendConnectionRequest: (userId: string) => Promise<void>; // API: POST /socs/api/v1/index/connections/requests
    acceptConnectionRequest: (requestId: string) => Promise<void>; // API: POST /socs/api/v1/index/connections/requests/accept
    declineConnectionRequest: (requestId: string) => Promise<void>; // API: POST /socs/api/v1/index/connections/requests/decline
    removeConnection: (connectionId: string) => Promise<void>; // API: DELETE /socs/api/v1/index/connections/remove
}
