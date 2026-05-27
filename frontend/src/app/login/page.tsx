"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      setError("An unexpected error occurred while connecting to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#E0E1DD] dark:bg-[#060D14] transition-colors duration-200 relative overflow-hidden">
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-scale-in { animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-up { opacity: 0; animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        @keyframes float {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .mesh-blob {
          position: absolute;
          filter: blur(80px);
          border-radius: 50%;
          opacity: 0.4;
          animation: float 10s infinite ease-in-out;
        }
        .dark .mesh-blob {
          opacity: 0.15;
        }
      `}</style>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Mesh Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="mesh-blob bg-[#55f761]" style={{ width: '40vw', height: '40vw', top: '-10%', left: '-10%', animationDelay: '0s', animationDuration: '12s' }}></div>
        <div className="mesh-blob bg-[#1F7A1F]" style={{ width: '50vw', height: '50vw', top: '40%', right: '-20%', animationDelay: '2s', animationDuration: '18s' }}></div>
        <div className="mesh-blob bg-[#3de34a]" style={{ width: '35vw', height: '35vw', bottom: '-10%', left: '20%', animationDelay: '4s', animationDuration: '14s' }}></div>
      </div>      <div className="relative z-10 w-full min-h-[560px] flex flex-col justify-center max-w-lg bg-white/60 dark:bg-black/60 backdrop-blur-xl border border-white/40 dark:border-white/15 rounded-tr-2xl rounded-bl-2xl shadow-2xl p-10 animate-scale-in">
        <div className="text-center mb-10 animate-fade-up delay-100">
          <div className="w-10 h-10 mx-auto bg-[#0D1B2A] dark:bg-white/15 border border-black/10 dark:border-white/20 rounded-lg flex items-center justify-center mb-5">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="text-white font-bold text-lg">X</span>
            )}
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-[#0D1B2A] dark:text-white">
            Sign In
          </h1>
          <p className="text-sm text-[#2F3E46] dark:text-white/60 mt-1.5">
            Enter your credentials to continue
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 animate-fade-up delay-200">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#1B263B] dark:text-white/80" htmlFor="email">
              Email Address
            </label>
            <input
              className="w-full px-3 py-2.5 bg-white dark:bg-white/10 border border-black/15 dark:border-white/15 rounded-lg text-sm text-[#0D1B2A] dark:text-white placeholder:text-[#2F3E46]/40 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#1F7A1F]/30 dark:focus:ring-[#55f761]/40 focus:border-[#1F7A1F]/60 dark:focus:border-[#55f761]/50 transition-colors shadow-sm disabled:opacity-50"
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
            <label className="block text-sm font-medium text-[#1B263B] dark:text-white/80" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className="w-full px-3 py-2.5 pr-10 bg-white dark:bg-white/10 border border-black/15 dark:border-white/15 rounded-lg text-sm text-[#0D1B2A] dark:text-white placeholder:text-[#2F3E46]/40 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#1F7A1F]/30 dark:focus:ring-[#55f761]/40 focus:border-[#1F7A1F]/60 dark:focus:border-[#55f761]/50 transition-colors shadow-sm disabled:opacity-50"
                type={showPassword ? "text" : "password"}
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#2F3E46] dark:text-white/60 hover:text-[#0D1B2A] dark:hover:text-white transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1F7A1F] hover:bg-[#145214] text-white dark:bg-[#55f761] dark:hover:bg-[#3de34a] dark:text-[#060D14] font-semibold rounded-tr-xl rounded-bl-xl py-2.5 text-sm transition-colors shadow-lg shadow-black/10 dark:shadow-[#55f761]/20 disabled:opacity-70 flex justify-center items-center"
            >
              {isLoading ? "Authenticating..." : "Sign In"}
            </button>
            <div className="text-center text-sm text-[#2F3E46] dark:text-white/60 mt-2">
              Don't have an account?{" "}
              <Link href="/register" className="text-[#1F7A1F] dark:text-[#55f761] hover:underline font-semibold">
                Sign Up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
