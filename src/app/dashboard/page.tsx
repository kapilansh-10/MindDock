"use client"

import { useEffect, useState } from "react"
import { ContentCard } from "../brain/[shareId]/ContentCard";

export default function DashboardPage() {


    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const token = localStorage.getItem("token");

        if(!token) {
            window.location.href = "/signin";
            return;
        }

        fetch("/api/v1/content", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(async (res) => {
                const data = await res.json();
                setContent(data.content || []);
                setLoading(false)
            })
            .catch(() => {
                setLoading(false);
            });
    },[])


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Loading...
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white px-4 py-10">
            <h1 className="text-4xl font-bold mb-6 flex items-center justify-center">Your MindDock</h1>

            <div className="max-w-3xl mx-auto space-y-6">
                { content.length === 0 ? (
                    <p className="text-gray-400">No content yet. Add something!</p>
                ) : (
                    content.map((item: any) => (
                        <ContentCard key={item.id} item={item} />
                    ))
                )}
            </div>
        </div>
    )
}