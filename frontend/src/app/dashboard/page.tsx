import FeedComponent from "@/components/FeedComponent";

import { Metadata } from "next";
// Page title and description
export const metadata: Metadata = {
    title: "SOCS | Home",
    description: "Socs social media app",
};

// This is home page of the dashboard where you r
export default function page() {
    return (
        <FeedComponent />
    )
}
