// Get token from local storage
// Function to get token from the local storage
export const getToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("access_token");
    }
    return null;
};


// Function to check if the user is authenticated
export function isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("access_token");
}