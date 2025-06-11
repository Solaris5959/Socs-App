import MyPosts from "@/components/MyPosts"


import { Metadata } from "next";
// Page title and description
export const metadata: Metadata = {
    title: "SOCS | My Posts",
    description: "Socs social media app",
};


export default function page() {
    return (
        <MyPosts />
    )
}
