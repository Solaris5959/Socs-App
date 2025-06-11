import MyFavorites from "@/components/MyFavorites";

import { Metadata } from "next";
// Page title and description
export const metadata: Metadata = {
    title: "SOCS | Favorite Posts",
    description: "Socs social media app",
};


export default function page() {
    return (
        <MyFavorites />
    )
}
