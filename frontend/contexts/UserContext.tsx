
'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { ProfileContextType, UserProfile } from '@/interface/ProfileContextType';
import { toast } from "sonner"
import { useRouter } from 'next/navigation'

// Create a context for user profile management
export const UserContext = createContext<ProfileContextType | undefined>(undefined)


// URL for the authentication service
const API_URL = process.env.NEXT_PUBLIC_LOCAL_API;


export function UserProvider({ children }: { children: React.ReactNode }) {


    // State to manage user and session
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);


    // Use effect to fetch user profile on mount
    // Todo: Add refresh token logic to handle session expiration
    useEffect(() => {
        // Fetch user profile data from the API
        const fetchUserProfile = async () => {
            try {


                // get user token from local storage
                const token = localStorage.getItem("access_token");


                // Fetch user profile data from the API
                const response = await fetch(`${API_URL}/socs/api/v1/index/profile`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Use Bearer token for authentication 
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }
                const data = await response.json();

                // Log to see the fetched data
                console.log('User profile fetched:', data);
                setUserProfile(data);



            } catch (error) {
                console.error('Error fetching user profile:', error);

            }
        }
        fetchUserProfile();
    }, []);



    // Method to upload profile picture
    const uploadProfilePicture = async (file: File): Promise<boolean> => {
        try {
            const token = localStorage.getItem("access_token");
            const formData = new FormData();

            // Append the file to the form data
            formData.append("avatar", file);

            // Log the file being uploaded for debugging
            console.log("File selected for upload:", file)

            // Make the API call to upload the avatar
            const res = await fetch(`${API_URL}/socs/api/v1/index/profile/upload-avatar`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) {
                console.error("Failed to upload avatar");
                return false;
            }

            // Get the updated user profile data from the response
            const updated = await res.json();

            console.log("Avatar uploaded successfully:", updated.profile_pic_url);


            // Update the profile picture URL
            setUserProfile((prevProfile) => prevProfile ? {
                ...prevProfile,
                profile_pic_url: updated.profile_pic_url
            } : prevProfile);



            // Toast notification for successful upload
            toast.success("Profile picture updated successfully")


            return true;
        } catch (error) {
            console.error("Error uploading avatar:", error);
            return false;
        }
    };




    // Methods to update user profile, delete account, and upload profile picture
    const updateUserProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
        try {

            // Toast notification for starting profile update
            toast("Updating profile...");
            console.log("Updating user profile with data:", data);

            const token = localStorage.getItem("access_token");
            const res = await fetch(`${API_URL}/socs/api/v1/index/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                // Error handling for failed update
                toast.error("Failed to update profile");
                console.error("Failed to update user profile");
                return false;
            }

            // Toast notification for successful update
            toast.success("Profile updated successfully");

            // Get the updated user profile data from the response
            const updatedProfile = await res.json();

            setUserProfile((prevProfile) => ({
                ...prevProfile,
                ...updatedProfile, // Merge updated fields with existing profile
            }));


            return true;
        } catch (error) {
            console.error("Error updating profile:", error);
            return false;
        }
    };

    // Method to delete user account
    const deleteUserAccount = async (): Promise<boolean> => {
        try {
            const token = localStorage.getItem("access_token");
            const res = await fetch(`${API_URL}/socs/api/v1/index/profile`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                console.error("Failed to delete user account");
                return false;
            }

            // Toast notification for successful delete
            toast.success("Account deleted successfully");

            // Optional: clear local state or redirect
            setUserProfile(null);

            localStorage.removeItem("access_token");


            // Redirect to home page after deletion
            router.push("/");


            return true;
        } catch (error) {
            console.error("Error deleting account:", error);
            return false;
        }
    };



    // State variables
    const value = {
        userProfile,
        updateUserProfile,
        deleteUserAccount,
        uploadProfilePicture
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}


// Custom hook to use the UserContext
export const useProfile = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}