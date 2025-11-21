import React from "react";
import { ContentCard } from "./ContentCard";

async function getPublicBrain(shareId: string) {
    const res = await fetch(`${process.env.BASE_URL}/api/v1/brain/${shareId}`, {
        cache: "no-store"
    });

    if (!res.ok) return null;
    return res.json();
}

export default async function Page({
    params,
}: {
    params: Promise<{ shareId: string }>;
}) {
    const { shareId } = await params;
    const data = await getPublicBrain(shareId);

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center space-y-3">
                    <h1 className="text-3xl font-bold">Link not found</h1>
                    <p className="text-gray-400">This MindDock page is invalid or expired.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-black via-neutral-900 to-black text-white flex flex-col items-center py-16 px-4">
            
            {/* Title */}
            <h1 className="text-3xl font-bold mb-12 text-center animate-[fadeIn_0.5s_ease-out]">
                <span className="bg-gradient-to-r from-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
                    {data.username}'s MindDock
                </span>
            </h1>

            {/* Content Cards */}
            <div className="w-full max-w-3xl space-y-6 animate-[fadeIn_0.8s_ease-out]">
                {data.content.map((item: any) => (
                    <ContentCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}
