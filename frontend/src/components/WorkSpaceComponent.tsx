"use client"
import { useState, useEffect, useCallback } from "react"
import { Search, Upload, X, File, FileText, Image, FileSpreadsheet } from 'lucide-react';
import * as React from "react"
import {
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"

import { WorkspaceColumns } from "./WorkspaceColumns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { FileData } from "@/interface/FileType"
// import { SAMPLE_DATA_TABLE } from "@/assets/sample-workspace"
import { useWorkspace } from "@/contexts/WorkSpaceContext"
import { Skeleton } from "@/components/ui/skeleton"


// Helper function to get file icon based on type
// Todo: adjust the rule for Image
const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension || '')) return <Image className="h-8 w-8 text-blue-500" />;
    if (['pdf', 'doc', 'docx', 'txt'].includes(extension || '')) return <FileText className="h-8 w-8 text-red-500" />;
    if (['xls', 'xlsx', 'csv'].includes(extension || '')) return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};



// This is the component for the workspace
export default function WorkSpaceComponent() {

    // Get methods from workspace context
    const { files, uploadFiles, refreshFiles, isLoading } = useWorkspace();

    // File state
    const [data, setData] = useState<FileData[]>([])
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)



    console.log("Files in WorkSpaceComponent:", files);

    // Set the data state with files from context
    useEffect(() => {
        // Set timeout to simulate loading
        setData(files);
    },);

    // State for table
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    // Initialize the table with react-table
    const table = useReactTable({
        data,
        columns: WorkspaceColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        initialState: {
            pagination: {
                pageSize: 6,
            },
        },
    })

    // Handle file selection
    const handleFileSelect = (files: FileList | null) => {
        if (files && files.length > 0) {
            // Replace existing file with new one
            setSelectedFile(files[0]);
        }
    };

    // Method to handle drag enter
    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    // Method to handle drag leave
    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        handleFileSelect(files);
    }, []);

    // Remove file from selection
    const removeFile = () => {
        setSelectedFile(null);
    };

    // Method to handle file upload
    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);

        // Send the file to the uploadFiles method from workspace context
        const success = await uploadFiles([selectedFile]);

        // Reset states after upload
        setIsUploading(false);
        setIsUploadDialogOpen(false);
        setSelectedFile(null);

        // If upload was successful, refresh the files list
        if (success) {
            setSelectedFile(null);
            // Refresh the files list
            await refreshFiles();


        } else {
            console.error("File upload failed");
        }
    };


    return (
        <div className="w-full p-6">
            <h1 className="text-2xl font-semibold mb-6">Workspace</h1>

            {/* Search and Upload File Section */}
            <div className="flex items-center justify-between mb-6 space-x-1">
                <div className="relative max-w-md flex-1 text-gray-500">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                    <Input
                        placeholder="Search File"
                        value={(table.getColumn("filename")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("filename")?.setFilterValue(event.target.value)
                        }
                        className="pl-8"
                    />
                </div>

                <Button
                    onClick={() => setIsUploadDialogOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                >
                    Upload File
                    <Upload className="h-4 w-4 ml-2" />
                </Button>
            </div>


            {/* Table */}
            <div className="rounded-lg border bg-white">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-gray-50">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="font-medium text-gray-700">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Render skeleton rows
                            [...Array(6)].map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell className="py-4"><Skeleton className="h-6 w-6 rounded-md" /></TableCell>
                                    <TableCell className="py-4"><Skeleton className="h-4 w-[120px]" /></TableCell>
                                    <TableCell className="py-4"><Skeleton className="h-4 w-[80px]" /></TableCell>
                                    <TableCell className="py-4"><Skeleton className="h-4 w-[100px]" /></TableCell>
                                    <TableCell className="py-4"><Skeleton className="h-8 w-[60px] rounded-md" /></TableCell>
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-gray-50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={WorkspaceColumns.length} className="h-24 text-center">
                                    No files found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between py-4">
                <div className="text-sm text-gray-500">
                    {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} page
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="text-gray-500 cursor-pointer"
                    >
                        Previous
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="text-gray-500 cursor-pointer"
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/**  Upload Dialog when user click upload file btn*/}
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Upload File</DialogTitle>
                        <DialogDescription>
                            Drag and drop your file here or click to browse
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Drag and Drop Area */}
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                                }`}
                            onDragEnter={handleDragEnter}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-sm text-gray-600 mb-2">
                                Drag and drop your file here, or{' '}
                                <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
                                    browse
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => handleFileSelect(e.target.files)}
                                    />
                                </label>
                            </p>
                            <p className="text-xs text-gray-500">
                                Supported formats: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, etc.
                            </p>
                        </div>

                        {/* Selected Files List */}
                        {selectedFile && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium">Selected file</h4>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        {getFileIcon(selectedFile.name)}
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatFileSize(selectedFile.size)}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={removeFile}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSelectedFile(null);
                                    setIsUploadDialogOpen(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpload}
                                disabled={!selectedFile || isUploading}
                                className="bg-blue-500 hover:bg-blue-600"
                            >
                                {isUploading ? (
                                    <>
                                        <Upload className="h-4 w-4" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-4 w-4" />
                                        Upload
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>


    )
}