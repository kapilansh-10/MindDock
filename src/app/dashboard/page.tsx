"use client"

import { useEffect, useState } from "react"
import { ContentCard } from "@/components/ContentCard";
import { AddContentModal } from "@/components/AddContentModal";
import toast from "react-hot-toast";

export default function DashboardPage() {


    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [shareId, setShareId] = useState<string | null>(null)
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [asking, setAsking] = useState(false);


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
                setShareId(data.user?.shareId || null)
                setLoading(false)
            })
            .catch(() => {
                setLoading(false);
            });
    },[])


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white px-4 py-10 relative">
                Loading...
            </div>
        )
    }

    const handleLogout = () => {
        if (confirm("Are you sure you want to logout?")){
            localStorage.removeItem("token")
            toast.success("Logged out successfully");
            setTimeout(() => {
                window.location.href = "/signin"
            }, 800)
        }
    }

    const handleShare = async () => {
        
        const token = localStorage.getItem("token");

        if(!token) return;

        let currentShareId = shareId;

        if(!currentShareId){
            const res = await fetch("/api/v1/brain/share", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if(!res.ok) {
                toast.error("Could not generated share link");
                return;
            }

            const data = await res.json();
            console.log(data)
            currentShareId = data.shareId;
            setShareId(currentShareId);
        }

        const shareURL = `${window.location.origin}/brain/${currentShareId}`;
        
        await navigator.clipboard.writeText(shareURL);

        toast.success("Share link copied!")
    }

    const handleAsk = async () => {
        const trimmed = question.trim();
        if (!trimmed) {
            toast.error("Ask a question first");
            return;
        }

        const token = localStorage.getItem("token");
        if(!token) return;

        setAsking(true);
        setAnswer("");
        try {
            const res = await fetch("/api/v1/brain/ask", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ question: trimmed })
            });

            const data = await res.json();
            if (!res.ok) {
                const reason = data.details || data.error || "Could not get an answer";
                toast.error(reason);
            } else {
                setAnswer(data.answer);
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setAsking(false);
        }
    }

    return (
    <div className="min-h-screen bg-black text-white px-4 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-10 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold">Your MindDock</h1>

            <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium text-white"
            >
                Logout
            </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8 max-w-4xl mx-auto">
            <button
                onClick={() => setOpen(true)}
                className="bg-amber-300 hover:bg-amber-400 text-black font-medium px-5 py-3 rounded-lg shadow"
            >
                + Add Content
            </button>

            <button
                onClick={handleShare}
                className="bg-blue-400 hover:bg-blue-500 text-black font-medium px-5 py-3 rounded-lg shadow"
            >
                Share MindDock
            </button>
        </div>

        {/* Ask AI */}
        <div className="max-w-4xl mx-auto mb-10 bg-neutral-900 border border-neutral-800 rounded-lg p-4 space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
                <input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask MindDock about your saved items"
                    className="flex-1 px-3 py-2 rounded bg-neutral-800 outline-none"
                />
                <button
                    onClick={handleAsk}
                    disabled={asking}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded text-white disabled:opacity-60"
                >
                    {asking ? "Thinking..." : "Ask"}
                </button>
            </div>
            {answer ? (
                <div className="text-sm text-gray-200 bg-neutral-800/80 rounded p-3">
                    {answer}
                </div>
            ) : null}
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto space-y-6">
            {content.length === 0 ? (
                <div className="text-gray-400 text-center mt-10">
                    No content yet. Add something!
                </div>
            ) : (
                content.map((item: any) => (
                    <ContentCard 
                        key={item.id} 
                        item={item}
                        onDelete={async (id: string) => {
                            const token = localStorage.getItem("token");

                            await fetch("/api/v1/content", {
                                method: "DELETE",
                                headers: {
                                    "Content-type": "application/json",
                                    "Authorization": `Bearer ${token}`
                                },
                                body: JSON.stringify({ contentId: id })
                            });

                            const updated = await fetch("/api/v1/content", {
                                headers: { Authorization: `Bearer ${token}` }
                            }).then(r => r.json());

                            setContent(updated.content);
                        }}
                    />
                ))
            )}
        </div>

        <AddContentModal 
            open={open}
            setOpen={setOpen}
            onCreate={async (newContent: any) => {
                const token = localStorage.getItem("token");
                const res = await fetch("/api/v1/content", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(newContent)
                });

                if (res.ok) {
                    setOpen(false);
                    const updated = await fetch("/api/v1/content", {
                        headers: { Authorization: `Bearer ${token}` }
                    }).then(r => r.json());

                    setContent(updated.content);
                }
            }}
        />
    </div>
    );
}