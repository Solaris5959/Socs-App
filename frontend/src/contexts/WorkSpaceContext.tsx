'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from "sonner"
import { FileData } from '@/interface/FileType';
import { WorkspaceContextType } from '@/interface/WorkspaceContextType';
// import { SAMPLE_DATA_TABLE } from '@/assets/sample-workspace';

// Create the context
export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// URL for the API service
const API_URL = process.env.NEXT_PUBLIC_LOCAL_API;

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {

    // State to manage files and loading state
    const [files, setFiles] = useState<FileData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch files data when the component mounts
    useEffect(() => {
        // Fetch files data from the API
        const fetchFiles = async () => {
            try {
                setIsLoading(true);

                // Get user token from local storage
                const token = localStorage.getItem("access_token");

                // Fetch files data from the API
                const response = await fetch(`${API_URL}/socs/api/v1/index/files/user`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch files');
                }

                const data = await response.json();

                // Reurn the files data
                setFiles(data);

            } catch (error) {
                console.error('Error fetching files:', error);

                toast.error("Failed to fetch files. Using sample data.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchFiles();
    }, []);

    // Method to upload files
    const uploadFiles = async (filesToUpload: File[]): Promise<boolean> => {
        try {
            const token = localStorage.getItem("access_token");

            // Validate input
            if (!filesToUpload || filesToUpload.length === 0) {
                toast.error("No file selected");
                return false;
            }

            const fileToUpload = filesToUpload[0]; // Handle first file for now

            toast("Uploading file...");
            console.log("File selected for upload:", fileToUpload);

            const formData = new FormData();
            formData.append("file", fileToUpload);

            const res = await fetch(`${API_URL}/socs/api/v1/index/files/user`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,

                },
                body: formData,
            });

            if (!res.ok) {
                console.error("Failed to upload file");
                toast.error("Failed to upload file");
                return false;
            }

            const uploadedData = await res.json();
            console.log("File uploaded successfully:", uploadedData);

            if (uploadedData.files && Array.isArray(uploadedData.files)) {
                setFiles((prevFiles) => [...uploadedData.files, ...prevFiles]);
            }

            toast.success("Successfully uploaded file");
            return true;
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("An error occurred while uploading the file");
            return false;
        }
    };

    // Method to delete a file
    const deleteFile = async (fileId: string): Promise<boolean> => {
        try {
            // Toast notification for starting deletion
            toast("Deleting file...");

            const token = localStorage.getItem("access_token");
            const res = await fetch(`${API_URL}/socs/api/v1/workspace/files/${fileId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                console.error("Failed to delete file");
                toast.error("Failed to delete file");
                return false;
            }

            // Remove the file from local state
            setFiles((prevFiles) => prevFiles.filter(file => file.id !== fileId));

            // Toast notification for successful deletion
            toast.success("File deleted successfully");

            return true;
        } catch (error) {
            console.error("Error deleting file:", error);
            toast.error("An error occurred while deleting the file");
            return false;
        }
    };

    // Method to refresh files list
    const refreshFiles = async (): Promise<void> => {
        try {
            setIsLoading(true);

            // Get user token from local storage
            const token = localStorage.getItem("access_token");

            // Fetch files data from the API
            const response = await fetch(`${API_URL}/socs/api/v1/index/files/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch files');
            }

            const data = await response.json();

            // Reurn the files data
            setFiles(data);

            console.log("Files refreshed successfully:", data);

        } catch (error) {
            console.error('Error fetching files:', error);

            toast.error("Failed to fetch files. Using sample data.");
        } finally {
            setIsLoading(false);
        }
    };


    // Method to download a file
    const downloadFile = async (fileId: string): Promise<void> => {
        try {
            const token = localStorage.getItem("access_token");
            const res = await fetch(`${API_URL}/socs/api/v1/index/files/user${fileId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                console.error("Failed to download file");
                toast.error("Failed to download file");
                return;
            }

            // Create a blob from the response
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileId; // You can set a specific filename here
            document.body.appendChild(a);
            a.click();
            a.remove();

            // Toast notification for successful download
            toast.success("File downloaded successfully");
        } catch (error) {
            console.error("Error downloading file:", error);
            toast.error("An error occurred while downloading the file");
        }
    };


    // Context value
    const value = {
        files,
        isLoading,
        downloadFile,
        uploadFiles,
        deleteFile,
        refreshFiles
    };

    return (
        <WorkspaceContext.Provider value={value}>
            {children}
        </WorkspaceContext.Provider>
    );
}

// Custom hook to use the WorkspaceContext
export const useWorkspace = () => {
    const context = useContext(WorkspaceContext);
    if (context === undefined) {
        throw new Error('useWorkspace must be used within a WorkspaceProvider');
    }
    return context;
};