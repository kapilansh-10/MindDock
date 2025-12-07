"use client"

import { useState } from "react";

export function AddContentModal ({ open, setOpen, onCreate }: any) {


    const [type, setType] = useState("youtube");
    const [link, setLink] = useState("");
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState("");

    if(!open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-neutral-900 p-6 rounded-lg w-full max-w-md shadow-xl">
                
                <h2 className="text-2xl font-semibold mb-4">Add new Content</h2>

                <label className="text-sm text-gray-300">Type</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full mt-1 mb-3 p-2 rounded bg-neutral-800 outline-none"
                >
                    <option value="youtube">Youtube</option>
                    <option value="link">Link</option>
                    <option value="tweet">Tweet</option>
                    <option value="text">Text</option>
                </select>

                {/* Title */}
                <label>Title</label>
                <input 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full mt-1 mb-3 p-2 bg-neutral-800 outline-none rounded"
                    placeholder="e.g Next.js tutorial"
                />

                {/* Link */}
                <label>Link</label>
                <input 
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full mt-1 mb-3 p-2 rounded bg-neutral-800 outline-none"
                    placeholder="https://..."
                />

                {/* Tags */}
                <label>Tags</label>
                <input 
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full mt-1 mb-4 p-2 rounded bg-neutral-800 outline-none"
                    placeholder="webdev, learning" 
                />

                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={() => setOpen(false)}
                        className="px-4 py-2 bg-neutral-700 rounded-md"
                    >
                        Cancel
                    </button>

                    <button
                        className="px-4 py-2 bg-red-400 rounded-md"
                        onClick={async () => {
                            await Promise.resolve(onCreate({
                                type,
                                title,
                                link,
                                tags: tags
                                    .split(",")
                                    .map((t) => t.trim())
                                    .filter(Boolean)
                            }));
                            setType("youtube");
                            setTitle("");
                            setLink("");
                            setTags("");
                        }}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    )
}