'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trash2, MessageCircle, MoreHorizontal, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { useConnection } from '@/contexts/ConnectionContext';
import { ConnectionProfileType } from '@/interface/ConnectionProfile';
import { Skeleton } from "@/components/ui/skeleton"

// Todo: Add notification when user have request
// Todo: Add loading animation when fetching connections
// Todo: Add error handling when fetching connections
// Todo: Add pagination for connections
// Todo: Add ability to follow/unfollow connections


// Connection component to display user connections
export default function MyConnections() {


    // Add a loading state
    const [isLoading, setIsLoading] = useState(true);


    // Use connection context to manage connections
    const { fetchUserConnections,
        fetchSuggestConnections,
        fetchConnectionRequests,
        sendConnectionRequest,
        acceptConnectionRequest,
        declineConnectionRequest, removeConnection } = useConnection();

    // State to manage connections
    const [connections, setConnections] = useState<ConnectionProfileType[]>([]);
    const [suggestedConnections, setSuggestedConnections] = useState<ConnectionProfileType[]>([]);
    const [requestedConnections, setRequestedConnections] = useState<ConnectionProfileType[]>([]);
    const [sentRequests, setSentRequests] = useState<string[]>([]);

    // Function to reload connections
    const refreshConnections = async () => {
        const connectionsData = await fetchUserConnections();
        setConnections(connectionsData);
    };


    // Use effect to fetch connections when the component mounts
    useEffect(() => {
        // Fetch connections when the component mounts
        const getConnections = async () => {
            setIsLoading(true); // Set loading to true when fetching starts
            try {
                // ! Simulate a delay 0.5s
                await new Promise(resolve => setTimeout(resolve, 500));
                const connectionsData = await fetchUserConnections();
                setConnections(connectionsData);
            } finally {
                setIsLoading(false); // Set loading to false when fetching ends
            }
        };

        // Fetch suggested connections
        const getSuggestedConnections = async () => {
            const suggestedConnectionsData = await fetchSuggestConnections();
            setSuggestedConnections(suggestedConnectionsData);
        }

        // Fetch connection requests
        const getConnectionRequests = async () => {
            const connectionRequestsData = await fetchConnectionRequests();
            setRequestedConnections(connectionRequestsData);
        }

        // Call the function to fetch connections
        getConnections();
        getSuggestedConnections();
        getConnectionRequests();

    }, []);


    // console.log("Connections:", connections);
    // console.log("Suggested Connections:", suggestedConnections); 
    // console.log("Requested Connections:", requestedConnections);


    // State to manage suggested connections search and dialog
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
    const [selectedConnection, setSelectedConnection] = useState(false);

    // Filter suggested and requested connections based on search term
    const filteredSuggestConnections = suggestedConnections.filter(person =>
        person.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.position?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    // Filter requested connections based on search term
    const filteredRequestConnections = requestedConnections.filter(person =>
        person.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.position?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Method to show delete icon when user clicks edit button
    const handleSelectConnection = () => {

        // Toggle the selected connection state
        setSelectedConnection(!selectedConnection);

    };


    // Method to handle sending connection request
    const handleSendRequest = async (userId: string) => {
        try {

            // Sent request to the server to send a connection request
            await sendConnectionRequest(userId); // Assuming this method sends a connection request

            // Add the user ID to the sentRequests list
            setSentRequests((prev) => [...prev, userId]);

            // Simulate a successful request
            console.log(`Sending connection request to user_id : ${userId}`);

        } catch (error) {
            console.error('Error sending connection request:', error);
        }
    };



    // Method to accept a connection request
    const handleAcceptRequest = async (userId: string) => {
        try {
            // Call the method to accept the connection request
            await acceptConnectionRequest(userId);
            console.log(`Accepted connection request with ID: ${userId}`);

            // Update requests and connections
            setRequestedConnections(prev =>
                prev.filter(person => person.user_id !== userId)
            );

            await refreshConnections(); // Refresh updated list

        } catch (error) {
            console.error('Error accepting connection request:', error);
        }
    };

    // Method to decline a connection request 
    const handleDeclineRequest = async (userId: string) => {
        try {
            await declineConnectionRequest(userId);
            console.log(`Declined connection request with ID: ${userId}`);

            // Remove the declined user from requestedConnections state
            setRequestedConnections(prev =>
                prev.filter(person => person.user_id !== userId)
            );

        } catch (error) {
            console.error('Error declining connection request:', error);
        }
    };


    // Method to delete a connection with a  dialog to confirm deletion of connection
    const handleDeleteAccount = async (userId: string) => {
        try {
            // Assuming you have a method to delete the connection
            await removeConnection(userId);

            console.log(`Deleted connection with ID: ${userId}`);
            setSelectedConnection(false);

            await refreshConnections(); // Refresh updated list

        } catch (error) {
            console.error('Error deleting connection:', error);
        }
    };




    // Todo: Method to handle following a suggested connection - Low priority
    // const handleSendFollowRequest = async (userId: string) => {
    //     try {
    //         console.log(`Following user_id : ${userId}`);

    //     } catch (error) {
    //         console.error('Error sending connection request:', error);
    //     }
    // };

    // Todo: Method to unfollow - low priority - Low priority



    return (

        <div className="max-w-4xl p-2 mx-auto bg-white border border-gray-200 rounded-lg ">
            <div className="flex flex-row items-center justify-between p-4 mb-6 border-b border-gray-200">

                {/* Title */}
                <div className="font-medium text-gray-700">
                    Connections ({connections.length})
                </div>

                {/* Container */}
                <div className="flex-row hidden gap-3 lg:flex">
                    {/* ---------------- Add Connections Dialog ---------------- */}
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="px-6 py-2 text-white bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600">
                                Add Connections
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-semibold text-gray-900">Add Connections</DialogTitle>
                            </DialogHeader>

                            {/* Search Bar */}
                            <div className="relative mb-4">
                                <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                <Input
                                    placeholder="Search Connections..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 border-gray-200 bg-gray-50"
                                />
                            </div>

                            {/* Scrollable Connection List */}
                            <div className="flex-1 pr-2 space-y-3 overflow-y-auto">
                                {filteredSuggestConnections.map((person) => (

                                    <div key={person.user_id} className="flex items-center justify-between p-3 border-gray-100 border-b-1">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage src={person.profile_pic_url || 'empty'} alt={person.display_name} />
                                                <AvatarFallback className="text-gray-700 bg-gray-300">
                                                    SO
                                                </AvatarFallback>
                                            </Avatar>

                                            <div>
                                                <h3 className="font-semibold text-gray-900">{person.display_name}</h3>

                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <Button
                                            size="sm"
                                            className={`px-4 py-1 text-xs rounded-full cursor-pointer 
                                                 ${sentRequests.includes(person.user_id) || person.is_requested ? "bg-gray-300 text-gray-600" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                                            disabled={sentRequests.includes(person.user_id) || person.is_requested}
                                            onClick={() => handleSendRequest(person.user_id)}
                                        >
                                            {sentRequests.includes(person.user_id) || person.is_requested ? "Sent" : "Send a request"}
                                        </Button>
                                    </div>
                                ))}

                                {filteredSuggestConnections.length === 0 && (
                                    <div className="py-8 text-center text-gray-500">
                                        No connections found matching your search.
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* ----------------  Connections Request Dialog ---------------- */}
                    <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="px-6 py-2 text-white bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600">
                                Connection Requests
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-semibold text-gray-900">Connection Requests</DialogTitle>
                            </DialogHeader>

                            {/* Search Bar */}
                            <div className="relative mb-4">
                                <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                <Input
                                    placeholder="Search Connections..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 border-gray-200 bg-gray-50"
                                />
                            </div>

                            {/* Scrollable Connection List */}
                            <div className="flex-1 pr-2 space-y-3 overflow-y-auto">
                                {filteredRequestConnections.map((person) => (

                                    <div key={person.user_id} className="flex items-center justify-between p-3 border-gray-100 border-b-1">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage src={person.profile_pic_url || 'empty'} alt={person.display_name} />
                                                <AvatarFallback className="text-gray-700 bg-gray-300">
                                                    SO
                                                </AvatarFallback>
                                            </Avatar>

                                            <div>
                                                <h3 className="font-semibold text-gray-900">{person.display_name}</h3>
                                                <p className="text-sm text-gray-600">{person.position}</p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                className="px-4 py-1 text-xs text-white bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600"
                                                onClick={() => handleAcceptRequest(person.user_id)}
                                            >
                                                Accept
                                            </Button>

                                            <Button
                                                size="sm"
                                                className="px-4 py-1 text-xs text-white bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600"
                                                onClick={() => handleDeclineRequest(person.user_id)}
                                            >
                                                Decline
                                            </Button>

                                        </div>
                                    </div>
                                ))}

                                {filteredRequestConnections.length === 0 && (
                                    <div className="py-8 text-center text-gray-500">
                                        No connections found matching your search.
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Connections Button - Delete User */}
                    <Button
                        className="px-6 py-2 text-white bg-blue-500 rounded-full cursor-pointer hover:bg-blue-400"
                        onClick={handleSelectConnection}
                    >
                        Remove Connections
                    </Button>


                </div>

                {/* Mobile Menu */}
                <div className="flex items-center gap-2 lg:hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger ><MoreHorizontal /></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel >Manage Connections</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setIsAddDialogOpen(true)}>
                                Add Connections
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsRequestDialogOpen(true)}>
                                Connection Requests
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleSelectConnection}>
                                Delete Connections
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* -----------  Connections container -------------------- */}
            <div className="m-4 space-y-4">
                {isLoading ? (
                    // Loading skeleton
                    <div className="space-y-4">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="p-4 bg-white dark:bg-slate-800 rounded-lg ">
                                <div className="flex items-center space-x-3 mb-4">
                                    <Skeleton className="w-10 h-10 rounded-full" />
                                    <Skeleton className="w-24 h-4" />
                                </div>

                            </div>
                        ))}
                    </div>
                ) : connections.length > 0 ? (
                    // Connections list
                    connections.map((connection) => (
                        <div
                            key={connection.user_id}
                            className="flex items-center justify-between p-4 border-b border-gray-100"
                        >
                            <div className="flex items-center gap-4">
                                {/* Avatar */}
                                <div className="relative">
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage
                                            src={connection.profile_pic_url || 'empty'}
                                            alt={connection.display_name}
                                        />
                                        <AvatarFallback className="text-gray-700 bg-gray-300">
                                            SO
                                        </AvatarFallback>
                                    </Avatar>
                                    {/* Online Status */}
                                    {connection.is_online && (
                                        <div className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1"></div>
                                    )}
                                </div>

                                {/* User Info */}
                                <div>
                                    <h3 className="font-semibold text-gray-900">{connection.display_name}</h3>
                                    {/* Display company and position if available */}
                                    {connection.position && connection.position !== 'N/A' &&
                                        connection.company && connection.company !== 'N/A' && (
                                            <p className="text-slate-500 dark:text-slate-400">
                                                {connection.position} at {connection.company}
                                            </p>
                                        )}
                                </div>
                            </div>

                            {/* Right Side - Status and Actions */}
                            <div className="flex items-center gap-4">
                                {/* Online Badge */}
                                {connection.is_online && (
                                    <Badge variant="secondary" className="text-green-700 bg-green-100 border-green-200">
                                        Online
                                    </Badge>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    {/* Navigate to chatroom by userID */}
                                    <Link href={`/dashboard/chats/${connection.user_id}`}>
                                        <Button variant="ghost" size="sm" className="p-2 cursor-pointer hover:bg-gray-200">
                                            <MessageCircle className="w-10 h-10 text-gray-700" />
                                        </Button>
                                    </Link>
                                    {selectedConnection && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="sm" className="p-2 cursor-pointer hover:bg-gray-200">
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Are you sure you want to remove {connection.display_name}?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action will permanently remove {connection.display_name} from your connections.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogAction
                                                        onClick={() => handleDeleteAccount(connection.user_id)}
                                                        className="bg-red-600 cursor-pointer hover:bg-red-700"
                                                    >
                                                        Remove
                                                    </AlertDialogAction>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    // No connections message
                    <div className="py-8 text-center text-gray-500">
                        No connections found.
                    </div>
                )}
            </div>



        </div >
    );
};
