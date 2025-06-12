
'use client'


import { createContext, useContext } from 'react';
import { AuthContextType } from '@/interface/AuthContextType';
import { useRouter } from 'next/navigation'
import { toast } from "sonner"


// Create a context for authentication
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// URL for the authentication service
const API_URL = process.env.NEXT_PUBLIC_LOCAL_API;

// AuthProvider component to wrap around your application
export function AuthProvider({ children }: { children: React.ReactNode }) {

    // State to manage user and session
    const router = useRouter();


    // Method to sign up the user
    const signUp = async (userEmail: string,
        userPassword: string,
        userDisplayName: string) => {

        // Fetch request to the API for user registration
        try {


            const response = await fetch(`${API_URL}/socs/api/v1/user/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: userEmail,
                    password: userPassword,
                    displayname: userDisplayName,
                }),
            });


            // If the response is not OK, return false
            if (!response.ok) {
                toast.error("Registration failed. Please try again.");
                return false
            }

            // Parse the response data
            const data = await response.json();

            // Show success message and redirect to login page
            toast.success("Registration successful!", {
                description: "You can now log in with your credentials.",
            });

            // Delay to allow toast to render
            setTimeout(() => {
                router.push("/");
            }, 1500);

            return data;

        } catch (error) {
            toast.error("Registration failed. Please try again.");
            console.error("Error registering user", error);
            return false;
        }

    }

    // Method to sign in the user
    const signIn = async (userEmail: string, userPassword: string) => {

        // Fetch request to the API for user login
        try {


            // Make a POST request to the API for user login
            const response = await fetch(`${API_URL}/socs/api/v1/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: userEmail,
                    password: userPassword,
                }),
            });



            // If the response is not OK, return false
            if (!response.ok) {
                toast.error("Login failed. Please try again.");
                return false
            }

            // Parse the response data
            const data = await response.json();



            // Set cookies and local storage with the access token
            localStorage.setItem("access_token", data.session.access_token);



            // Show success message and redirect to dashboard page
            toast.success("Login successful!");

            // Redirect to the dashboard page
            router.push("/dashboard");

            return data;

        } catch (error) {
            toast.error("Login failed. Please try again.");
            console.error("Error logging in user", error);
            return false;
        }
    }




    // Method to sign out the user
    const signOut = async () => {
        localStorage.removeItem("access_token");
        toast.success("Signed out successfully.");
        router.push("/");
    };



    // Method to reset password
    const forgetPassword = async (userEmail: string) => {

        // Fetch request to the API for password reset
        try {

            // Make a POST request to the API for password reset
            const response = await fetch(`${API_URL}/socs/api/v1/user/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: userEmail,
                }),
            });

            // If the response is not OK, return false
            if (!response.ok) {
                toast.error("Password reset failed. Please try again.");
                return false;
            }

            // Parse the response data
            const data = await response.json();

            // Show success message and redirect to login page
            toast.success("Password reset link sent to your email!");


            // Delay to allow toast to render
            setTimeout(() => {
                router.push("/");
            }, 1500);

            return data;

        } catch (error) {
            toast.error("Password reset failed. Please try again.");
            console.error("Error resetting password", error);
            return false;
        }

    }


    // Method to reset password
    const resetPassword = async (newPassword: string) => {

        try {

            console.log("New Password", newPassword);

            // Get the access from the the link
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const token = hashParams.get("access_token");


            if (!token) {
                toast.error("You must be logged in to reset your password.");
                return false;
            }

            //Make a POST request to the API for password reset
            const response = await fetch(`${API_URL}/socs/api/v1/user/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newPassword: newPassword,
                    token: token, // Assuming you have the token from the reset link
                }),
            });

            // If the response is not OK, return false
            if (!response.ok) {
                toast.error("Password reset failed. Please try again.");
                return false;
            }

            // Parse the response data
            const data = await response.json();

            // Show success message and redirect to login page
            toast.success("Password reset successful! Please log in with your new password.");

            // Delay to allow toast to render
            setTimeout(() => {
                router.push("/");
            }, 1500);

            return data;
        } catch (error) {
            toast.error("Password reset failed. Please try again.");
            console.error("Error resetting password", error);
            return false;
        }
    }





    // Todo: Method to update password
    const updatePassword = async (newPassword: string) => {




    }





    // State variables to manage user and session
    const value = {
        signUp,
        signIn,
        signOut,
        forgetPassword,
        resetPassword,
        updatePassword,

    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}

// Custom hook to use the AuthContext
// This hook allows you to access the authentication context in your components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};