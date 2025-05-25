import { User } from "@/interface/User";


// URL for the authentication service
const API_URL = process.env.NEXT_PUBLIC_LOCAL_API;


// Function to register the user using the register API
export async function registerUser(user: User): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/user/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: user.email,
                password: user.password,
                displayname: user.displayname,
            }),
        });

        // If the response is not OK, return false
        if (!response.ok) {
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error registering user", error);
        return false;
    }
}


