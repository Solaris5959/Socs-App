
'use client'
import { createContext, useContext, useState } from 'react';
import { ConnectionContextType } from '@/interface/ConnectionContextType';
import { toast } from "sonner"


// Create a context for authentication
const ConnctionContext = createContext<ConnectionContextType | undefined>(undefined);


// URL for the authentication service
const API_URL = process.env.NEXT_PUBLIC_LOCAL_API;


// ConnectionProvider component to provide connection context to the application
export function ConnectionProvider({ children }: { children: React.ReactNode }) {


    // State to manage loading state
    const [loading, setLoading] = useState<boolean>(false);


    // Fetch suggested connections from the API
    const fetchSuggestConnections = async () => {

        setLoading(true);
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
        } finally { // this block will always execute
            setLoading(false);
        }
    };

    // Fetch user connections from the API
    const fetchUserConnections = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_URL}/socs/api/v1/index/connections/user`, {
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
        } finally {
            setLoading(false);
        }
    };



    // Fetch connection requests from the API
    const fetchConnectionRequests = async () => {
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
        } finally {
            setLoading(false);
        }
    };


    // Todo: Method to send a connection request
    // const sendConnectionRequest = async (userId: string) => {


    // }

    // Todo: Method to accept a connection request
    // const acceptConnectionRequest = async (requestId: string) => {


    // }

    // Todo: Method to decline a connection request
    // const declineConnectionRequest = async (requestId: string) => {

    // }

    // Todo: Method to remove a connection
    // const removeConnection = async (connectionId: string) => {


    // }


    // State variables to manage connection features
    const value = {
        loading,
        fetchSuggestConnections,
        fetchUserConnections,
        fetchConnectionRequests,
        // sendConnectionRequest,
        // acceptConnectionRequest,
        // declineConnectionRequest,
        // removeConnection,
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