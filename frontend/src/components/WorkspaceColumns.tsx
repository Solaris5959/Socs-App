// components/workspace/WorkspaceColumns.tsx or app/workspace/columns.tsx
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileData } from "@/interface/FileType"

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
        accessorKey: "file_name",
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
        cell: ({ row }) => <div className="font-medium">{row.getValue("file_name")}</div>,
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
            const { display_name, position, company } = row.original;
            return (
                <div>
                    <div className="font-medium">{display_name}</div>
                    <div className="text-sm text-gray-500">{position}, {company}</div>
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
        accessorKey: "file_size",  // calculate file size
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
            const size = row.getValue("file_size") as number;
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
                    <Button
                        className="bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                        size="sm"
                        onClick={() => {
                            // Add view logic here
                            console.log('Viewing file:', file.file_name);
                        }}
                    >
                        <Eye className="h-4 w-4 " />
                        View
                    </Button>

                    <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                        size="sm"
                        onClick={() => {
                            // Todo: Add download logic here
                            console.log('Downloading file:', file.file_name);
                            // Example: window.open(file.file_path, '_blank');
                        }}
                    >
                        <Download className="h-4 w-4 " />
                        Download
                    </Button>
                </div>
            )
        },
    },
]