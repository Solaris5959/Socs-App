'use client';

// components/workspace/WorkspaceColumns.tsx or app/workspace/columns.tsx
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileData } from "@/interface/FileType"
import Link from "next/link"
import { toast } from "sonner"

// URL for the API service
const API_URL = process.env.NEXT_PUBLIC_LOCAL_API;

// Method to download a file
const downloadFile = async (fileId: string): Promise<void> => {
    try {
        const token = localStorage.getItem("access_token");

        // 1. Fetch signed URL from your backend
        const res = await fetch(`${API_URL}/socs/api/v1/index/files/user/${fileId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            console.error("Failed to get signed URL");
            toast.error("Failed to get file link");
            return;
        }

        const { url: signedUrl } = await res.json();

        // 2. Fetch the file from the signed URL
        const fileRes = await fetch(signedUrl);

        if (!fileRes.ok) {
            console.error("Failed to download file from signed URL");
            toast.error("Failed to download file");
            return;
        }

        // 3. Create blob and trigger download
        const blob = await fileRes.blob();
        const downloadUrl = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileId; // Replace with actual filename if needed
        document.body.appendChild(a);
        a.click();
        a.remove();

        toast.success("File downloaded successfully");
    } catch (error) {
        console.error("Error downloading file:", error);
        toast.error("An error occurred while downloading the file");
    }
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Helper function to format date
const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}



// Define each columns for the workspace component
// This component manages the columns for the workspace table
// It includes file name, uploaded by, uploaded date, file size, and actions
export const WorkspaceColumns: ColumnDef<FileData>[] = [
    {
        accessorKey: "filename",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex items-center gap-2 hover:bg-transparent p-0"
                >
                    File Name
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue("filename")}</div>,
    },

    {
        id: "uploadedBy",
        header: ({ }) => {
            return (
                <div className="flex items-center gap-2">
                    Uploaded By
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                </div>
            )
        },
        cell: ({ row }) => {

            // Get
            const { displayName, position, company } = row.original;
            return (
                <div>
                    <div className="font-medium">{displayName}</div>
                    {position && company && (
                        <div className="text-sm text-gray-500">{position} at {company}</div>
                    )}

                </div>
            );
        },
    },
    {
        accessorKey: "uploaded_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex items-center gap-2 hover:bg-transparent p-0"
                >
                    Uploaded Date
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = row.getValue("uploaded_at") as string;
            return <div className="text-sm text-gray-600">{formatDate(date)}</div>;
        },
    },
    {
        accessorKey: "size",  // calculate file size
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex items-center gap-2 hover:bg-transparent p-0"
                >
                    File Size
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                </Button>
            )
        },
        cell: ({ row }) => {

            // Get the file size from the row data
            const size = row.getValue("size") as number;
            return <div className="text-sm text-gray-600 ml-5">{formatFileSize(size)}</div>;
        },
    },
    {
        id: "actions",
        header: "",
        enableHiding: false,
        cell: ({ row }) => {
            const file = row.original;

            return (
                <div className="flex items-center gap-2">
                    <Link href={`${file.path}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        <Button
                            className="bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                            size="sm"

                        >
                            <Eye className="h-4 w-4 " />
                            View
                        </Button>
                    </Link>


                    <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                        size="sm"
                        onClick={() => {
                            downloadFile(file.id);
                        }}                        >
                        <Download className="h-4 w-4 " />
                        Download
                    </Button>

                </div>
            )
        },
    },
]