
export interface UserProfile {
    user_id: string
    email: string
    first_name: string
    last_name: string
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