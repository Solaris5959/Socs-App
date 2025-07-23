import { FileData } from '@/interface/FileType';


// Define the context type
export interface WorkspaceContextType {
    files: FileData[];
    isLoading: boolean;
    downloadFile: (fileId: string) => Promise<void>;
    uploadFiles: (files: File[]) => Promise<boolean>;
    deleteFile: (fileId: string) => Promise<boolean>;
    refreshFiles: () => Promise<void>;
}
