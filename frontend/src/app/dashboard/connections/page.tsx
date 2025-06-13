import React from 'react'
import ConnectionComponent from '@/components/ConnectionComponent'

import { Metadata } from "next";
// Page title and description
export const metadata: Metadata = {
    title: "SOCS | Connections",
    description: "Socs social media app",
};


export default function page() {
    return (
        <ConnectionComponent />
    )
}
