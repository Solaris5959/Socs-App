// Interface for the AuthContextex
export interface AuthContextType {
    signUp: (email: string, password: string, displayname: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    forgetPassword: (email: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updatePassword: (newPassword: string) => Promise<void>;
}
