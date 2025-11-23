"use client"

import { useEffect, useState } from "react"
import { ContentCard } from "../brain/[shareId]/ContentCard";
import { AddContentModal } from "@/components/AddContentModal";

export default function DashboardPage() {


    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);


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

            <button onClick={() => setOpen(true)}
                className="bg-amber-200 hover:bg-amber-300 px-3 py-3 rounded-lg font-medium text-black mb-4"
            >
                + Add Content
            </button>

            <div className="max-w-3xl mx-auto space-y-6">
                { content.length === 0 ? (
                    <p className="text-gray-400">No content yet. Add something!</p>
                ) : (
                    content.map((item: any) => (
                        <ContentCard key={item.id} item={item} />
                    ))
                )}
            </div>

            <AddContentModal 
                open={open}
                setOpen={setOpen}
                onCreate = { async (newContent) => {

                    const token = localStorage.getItem("token")

                    const res = await fetch("api/v1/content", {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(newContent)
                    })

                    if(res.ok){
                        setOpen(false)

                        const updated = await fetch("/api/v1/content", {
                            headers: { Authorization: `Bearer ${token}`},
                        }).then((r) => r.json());

                        setContent(updated.content)
                    }


                    console.log("created")
                }}
            />
        </div>
    )
}