"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { AuthCard } from "../auth/AuthCard";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";


export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);


  const handleSignin = async () => {
    const res = await fetch("/api/v1/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Invalid credentials");
      return;
    }

    localStorage.setItem("token", data.token);
    toast.success("Welcome back!");
    window.location.href = "/dashboard";
  };

  return (
    <AuthCard title="Welcome Back">
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-300">Username</label>
          <input
            className="w-full mt-1 p-3 rounded bg-neutral-800 text-white outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="relative">
          <label className="text-sm text-gray-300">Password</label>
          <input
            type={showPass ? "text" : "password"}
            className="w-full mt-1 p-3 rounded bg-neutral-800 text-white outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 mt-3"
          >
            { showPass ? (
                <EyeSlashIcon className="h-5 w-5" />
            ) : (
                <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <button
          onClick={handleSignin}
          className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-medium text-white transition"
        >
          Sign In
        </button>

        <p className="text-center text-gray-400 text-sm">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-purple-400 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
