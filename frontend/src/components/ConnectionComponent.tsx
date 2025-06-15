'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trash2, MessageCircle, MoreHorizontal, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Todo: Importing connection context to manage connections
// import { useConnection } from '@/contexts/ConnectionContext';

// Sample connections data (requested, suggested, and connected)
import SAMPLE_CONNECTIONS from "@/assets/sample-connection";
import SUGGESTED_CONNECTIONS from "@/assets/sample-suggestions";
import REQUESTED_CONNECTIONS from "@/assets/sample-requests";


// Connection component to display user connections
export default function MyConnections() {

    // Todo: Call context to fetch connections and display them

    // Mock data for connections
    const connections = SAMPLE_CONNECTIONS;
    const suggestedConnections = SUGGESTED_CONNECTIONS;
    const requestedConnections = REQUESTED_CONNECTIONS;

    // State to manage suggested connections search and dialog
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
    const [selectedConnection, setSelectedConnection] = useState(false);

    // Filter suggested and requested connections based on search term
    const filteredSuggestConnections = suggestedConnections.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.title.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const filteredRequestConnections = requestedConnections.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Method to show delete icon when user clicks edit button
    const handleSelectConnection = () => {

        // Toggle the selected connection state
        setSelectedConnection(!selectedConnection);


    };

    // Todo: Add dialog to confirm deletion of connection


    // Todo: Method to handle suggested connection


    // Todo: Method to handle sending connection request



    return (

        <div className="max-w-4xl  p-2 bg-white rounded-lg  border border-gray-200 mx-auto ">
            <div className="flex flex-row items-center justify-between mb-6 border-b border-gray-200  p-4">

                {/* Title */}
                <div className="text-gray-700 font-medium">
                    Connections ({connections.length})
                </div>

                {/* Action Buttons */}
                <div className="flex-row gap-3 hidden lg:flex">
                    {/* Add Connections Dialog */}
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full cursor-pointer">
                                Add Connections
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-semibold text-gray-900">Add Connections</DialogTitle>
                            </DialogHeader>

                            {/* Search Bar */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search Connections..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-gray-50 border-gray-200"
                                />
                            </div>

                            {/* Scrollable Connection List */}
                            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                                {filteredSuggestConnections.map((person) => (

                                    <div key={person.id} className="flex items-center justify-between p-3 border-b-1 border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage src={person.avatar} alt={person.name} />
                                                <AvatarFallback className="bg-gray-300 text-gray-700">
                                                    {person.initials}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div>
                                                <h3 className="font-semibold text-gray-900">{person.name}</h3>
                                                <p className="text-sm text-gray-600">{person.title}</p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 text-xs rounded-full cursor-pointer"
                                                onClick={() => handleSendRequest(person.id)}
                                            >
                                                Send a request
                                            </Button>

                                        </div>
                                    </div>
                                ))}

                                {filteredSuggestConnections.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        No connections found matching your search.
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/*  Connections Request Dialog */}
                    <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full cursor-pointer">
                                Connection Requests
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-semibold text-gray-900">Connection Requests</DialogTitle>
                            </DialogHeader>

                            {/* Search Bar */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search Connections..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-gray-50 border-gray-200"
                                />
                            </div>

                            {/* Scrollable Connection List */}
                            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                                {filteredRequestConnections.map((person) => (

                                    <div key={person.id} className="flex items-center justify-between p-3 border-b-1 border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage src={person.avatar} alt={person.name} />
                                                <AvatarFallback className="bg-gray-300 text-gray-700">
                                                    {person.initials}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div>
                                                <h3 className="font-semibold text-gray-900">{person.name}</h3>
                                                <p className="text-sm text-gray-600">{person.title}</p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 text-xs rounded-full cursor-pointer"
                                                onClick={() => handleSendRequest(person.id)}
                                            >
                                                Accept
                                            </Button>

                                            <Button
                                                size="sm"
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 text-xs rounded-full cursor-pointer"
                                                onClick={() => handleSendRequest(person.id)}
                                            >
                                                Decline
                                            </Button>

                                        </div>
                                    </div>
                                ))}

                                {filteredRequestConnections.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        No connections found matching your search.
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Button
                        className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded-full cursor-pointer"
                        onClick={handleSelectConnection}
                    >
                        Edit Connections
                    </Button>
                </div>

                {/* Mobile Menu */}
                <div className="lg:hidden flex items-center gap-2">
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
                                Edit Connections
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Render Connections List */}
            <div className="space-y-4 m-4">
                {connections.map((connection) => (
                    <div key={connection.id} className="flex items-center justify-between p-4  border-b-1 border-gray-100 ">
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="relative">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={connection.avatar} alt={connection.name} />
                                    <AvatarFallback className="bg-gray-300 text-gray-700">
                                        {connection.initials}
                                    </AvatarFallback>
                                </Avatar>
                                {/* Online Status */}
                                {connection.isOnline && (
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                )}
                            </div>

                            {/* User Info */}
                            <div>
                                <h3 className="font-semibold text-gray-900">{connection.name}</h3>
                                <p className="text-sm text-gray-600">{connection.title}</p>
                            </div>
                        </div>

                        {/* Right Side - Status and Actions */}
                        <div className="flex items-center gap-4">

                            {/* Online Badge */}
                            {connection.isOnline && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                                    Online
                                </Badge>
                            )}

                            {/* Action Buttons click edit button to show delete icon */}
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-200 cursor-pointer">
                                    <MessageCircle className="w-10 h-10 text-gray-700 " />
                                </Button>
                                {selectedConnection && (
                                    <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-200 cursor-pointer">
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                )}
                            </div>

                        </div>
                    </div>
                ))}
            </div>





        </div >





    );
};
