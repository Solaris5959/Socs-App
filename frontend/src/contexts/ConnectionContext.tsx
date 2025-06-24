
'use client'
import { createContext, useContext, useState } from 'react';
import { ConnectionContextType } from '@/interface/ConnectionContextType';
import { toast } from "sonner"
import { ConnectionProfileType } from '@/interface/ConnectionProfile';


// Create a context for authentication
const ConnctionContext = createContext<ConnectionContextType | undefined>(undefined);


// URL for the authentication service
const API_URL = process.env.NEXT_PUBLIC_LOCAL_API;


// ConnectionProvider component to provide connection context to the application
export function ConnectionProvider({ children }: { children: React.ReactNode }) {


    // State to manage loading state
    const [loading, setLoading] = useState<boolean>(false);


    // Fetch current connections from the API
    const fetchUserConnections = async (): Promise<ConnectionProfileType[]> => {

        setLoading(true);

        // Returns all active connections for the current user
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_URL}/socs/api/v1/index/connections`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch suggested connections');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching suggested connections:', error);
            toast.error('Failed to fetch suggested connections');
            return [];
        } finally { // this block will always execute
            setLoading(false);
        }
    };

    // Fetch potential connections from the API
    const fetchSuggestConnections = async (): Promise<ConnectionProfileType[]> => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_URL}/socs/api/v1/index/suggest-connections`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user connections');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching user connections:', error);
            toast.error('Failed to fetch user connections');
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Fetch connection requests from the API
    const fetchConnectionRequests = async (): Promise<ConnectionProfileType[]> => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_URL}/socs/api/v1/index/connections/requests`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch connection requests');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching connection requests:', error);
            toast.error('Failed to fetch connection requests');
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Send follow request
    const sendFollow = async (userId: string) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_URL}/socs/api/v1/index/follow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) throw new Error('Failed to follow user');
            toast.success("Followed user successfully");
        } catch (error) {
            console.error('Error sending follow request:', error);
            toast.error('Failed to follow user');

        } finally {
            setLoading(false);
        }
    };

    // Unfollow a user
    const unfollow = async (userId: string) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_URL}/socs/api/v1/index/unfollow/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Failed to unfollow user');
            toast.success("Unfollowed user successfully");
        } catch (error) {
            console.error('Error unfollowing user:', error);
            toast.error('Failed to unfollow user');
        } finally {
            setLoading(false);
        }
    };

    // Send a connection request
    const sendConnectionRequest = async (userId: string) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_URL}/socs/api/v1/index/connections/requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ user_id: userId }),
            });

            if (!response.ok) throw new Error('Failed to send connection request');


            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            toast.success("Connection request sent");

            return data; // Return the response data if needed


        } catch (error) {
            console.error('Error sending connection request:', error);
            toast.error('Failed to send connection request');
        } finally {
            setLoading(false);
        }
    };

    // Accept a connection request
    const acceptConnectionRequest = async (requestId: string) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_URL}/socs/api/v1/index/connections/requests/${requestId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Failed to accept request');

            toast.success("Connection request accepted");

            return response.json(); // Return the response data if needed

        } catch (error) {
            console.error('Error accepting connection request:', error);
            toast.error('Failed to accept request');
        } finally {
            setLoading(false);
        }
    };

    // Decline a connection request
    const declineConnectionRequest = async (requestId: string) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_URL}/socs/api/v1/index/connections/requests/${requestId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Failed to decline request');
            toast.success("Connection request declined");
        } catch (error) {
            console.error('Error declining connection request:', error);
            toast.error('Failed to decline request');
        } finally {
            setLoading(false);
        }
    };

    // Remove an existing connection
    const removeConnection = async (connectionId: string) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_URL}/socs/api/v1/index/connections/${connectionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Failed to remove connection');
            toast.success("Connection removed");
        } catch (error) {
            console.error('Error removing connection:', error);
            toast.error('Failed to remove connection');
        } finally {
            setLoading(false);
        }
    };

    // State variables to manage connection features
    const value = {
        loading,
        fetchSuggestConnections,
        fetchUserConnections,
        fetchConnectionRequests,
        sendFollow,
        unfollow,
        sendConnectionRequest,
        acceptConnectionRequest,
        declineConnectionRequest,
        removeConnection,
    }

    return (
        <ConnctionContext.Provider value={value}>
            {children}
        </ConnctionContext.Provider>
    );
}



// Custom hook to use the ConnectionContext to access connection methods and state
export function useConnection() {
    const context = useContext(ConnctionContext);
    if (!context) {
        throw new Error('useConnctionContext must be used within a ConnectionProvider');
    }
    return context;
}