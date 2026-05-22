"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem('scrapedGingerData', JSON.stringify(result.data));
        router.push("/project");
      } else {
        setError(result.error || "Authentication failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An unexpected error occurred while connecting to the scraper.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#E0E1DD] dark:bg-[#060D14] transition-colors duration-200">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm bg-white dark:bg-[#0D1B2A] border border-[#1B263B]/10 dark:border-[#E0E1DD]/10 rounded-xl shadow-sm p-8 transition-colors duration-200">
        <div className="text-center mb-8">
          <div className="w-10 h-10 mx-auto bg-[#0D1B2A] dark:bg-[#E0E1DD] rounded-lg flex items-center justify-center mb-5">
            {isLoading ? (
               <div className="w-5 h-5 border-2 border-white dark:border-[#0D1B2A] border-t-transparent dark:border-t-transparent rounded-full animate-spin"></div>
            ) : (
               <span className="text-white dark:text-[#0D1B2A] font-bold text-lg">G</span>
            )}
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-[#0D1B2A] dark:text-[#E0E1DD]">
            Sign in to Ginger
          </h1>
          <p className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60 mt-1.5">
            Enter your credentials to continue
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#1B263B] dark:text-[#E0E1DD]" htmlFor="email">
              Email Address
            </label>
            <input 
              className="w-full px-3 py-2.5 bg-white dark:bg-[#060D14] border border-[#1B263B]/20 dark:border-[#E0E1DD]/20 rounded-lg text-sm text-[#0D1B2A] dark:text-[#E0E1DD] placeholder:text-[#2F3E46]/50 dark:placeholder:text-[#E0E1DD]/30 focus:outline-none focus:ring-2 focus:ring-[#1F7A1F]/20 dark:focus:ring-[#1F7A1F]/50 focus:border-[#1F7A1F] transition-colors shadow-sm disabled:bg-zinc-50 dark:disabled:bg-[#1B263B]/50 disabled:text-zinc-400 dark:disabled:text-[#E0E1DD]/50" 
              type="email" 
              id="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com" 
              disabled={isLoading}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#1B263B] dark:text-[#E0E1DD]" htmlFor="password">
              Password
            </label>
            <input 
              className="w-full px-3 py-2.5 bg-white dark:bg-[#060D14] border border-[#1B263B]/20 dark:border-[#E0E1DD]/20 rounded-lg text-sm text-[#0D1B2A] dark:text-[#E0E1DD] placeholder:text-[#2F3E46]/50 dark:placeholder:text-[#E0E1DD]/30 focus:outline-none focus:ring-2 focus:ring-[#1F7A1F]/20 dark:focus:ring-[#1F7A1F]/50 focus:border-[#1F7A1F] transition-colors shadow-sm disabled:bg-zinc-50 dark:disabled:bg-[#1B263B]/50 disabled:text-zinc-400 dark:disabled:text-[#E0E1DD]/50" 
              type="password" 
              id="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              disabled={isLoading}
            />
          </div>
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#1F7A1F] hover:bg-[#0D1B2A] dark:hover:bg-[#E0E1DD] text-white dark:hover:text-[#0D1B2A] font-medium rounded-lg py-2.5 text-sm transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center"
            >
              {isLoading ? "Authenticating & Scraping..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
