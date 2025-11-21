"use client"

import { useState } from "react"


export default function SignupPage() {

    const [username, setUsername] = useState("");
    const [password, setPasswrod] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/v1/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password })
            })

            const data = await res.json();

            if(!res.ok) return setError(data.error || "Signup Failed");

            setSuccess("Account created! Redirecting...");
            setTimeout(() => {
                window.location.href = "/signin";
            }, 1300)
        } 
        catch (error) {
            setError("Something went wrong")
        }
    }

    return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
        <div className="w-full max-w-md bg-neutral-900 p-8 rounded-xl shadow-xl border border-neutral-800">
            <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>

            <form onSubmit={handleSignup} className="flex flex-col gap-4">

                <div>
                    <label className="text-sm text-neutral-300">Username</label>
                    <input 
                        type="text"
                        className="w-full mt-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md focus:outline-none"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="text-sm text-neutral-300">Password</label>
                    <input 
                        type="text"
                        className="w-full mt-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md focus:outline-none"
                        value={password}
                        onChange={(e) => setPasswrod(e.target.value)}
                        required
                    />
                </div>

                {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                )}

                {success && (
                    <p className="text-green-400 text-sm">{success}</p>
                )}

                <button 
                    type="submit"
                    className="mt-2 w-full py-2 bg-purple-600 rounded-md font-semibold hover:bg-purple-700 transition"
                >
                    Sign Up
                </button>
            </form>

            <p className="text-sm text-neutral-400 mt-4 text-center">Already have an account?{" "}
                <a href="/signin" className="text-purple-400 underline">
                    Sign in
                </a>
            </p>
        </div>
    </div>
    )   
}

