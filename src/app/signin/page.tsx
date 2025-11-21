"use client"

import { useState } from "react"

export default function SigninPage() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSignin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/v1/signin", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ username, password })
            })
            
            const data = await res.json();

            if(!res.ok) return setError(data.error || "Signin failed");

            localStorage.setItem("token", data.token);
            setSuccess("Signed in! Redirecting...");

            setTimeout(() => {
                window.location.href = "/dashboard"
            },1000)
        } 
        catch (error) {
            
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
            <div className="w-full max-w-md bg-neutral-900 p-8 rounded-xl shadow-xl border border-neutral-800">
                
                <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back</h1>

                <form onSubmit={handleSignin} className="flex flex-col gap-4">
                    
                    <div>
                        <label className="text-sm text-neutral-300">
                            Username
                        </label>
                        <input 
                            type="text"
                            className="w-full mt-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md focus:outline-none focus:border-purple-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>Password</label>
                        <input 
                            type="text"
                            className="w-full mt-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md focus:outline-none focus:border-purple-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    {success && <p className="text-green-400 text-sm">{success}</p>}

                    <button
                        type="submit"
                        className="mt-2 w-full py-2 bg-purple-600 rounded-md font-semibold hover:bg-purple-700 transition"
                    >
                        Sign In
                    </button>

                </form>

                <p className="text-sm text-neutral-400 mt-4 text-center">
                    Don’t have an account?{" "}
                    <a href="/signup" className="text-purple-400 underline">
                    Create one
                    </a>
                </p>
            </div>
        </div>
    )

    
}