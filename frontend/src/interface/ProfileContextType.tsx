
export interface UserProfile {
    id: string
    username: string
    email: string
    firstName: string
    lastName: string
    display_name: string
    phone_number?: string
    position?: string
    company?: string
    avatarUrl?: string
    createdAt: string
    updatedAt: string
    profile_pic_url?: string
}



// Define the context type
export interface ProfileContextType {
    userProfile: UserProfile | null
    updateUserProfile: (data: Partial<UserProfile>) => Promise<boolean>
    deleteUserAccount: () => Promise<boolean>
    uploadProfilePicture: (file: File) => Promise<boolean>
}