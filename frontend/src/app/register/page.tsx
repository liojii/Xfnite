"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    password_conf: "",
    referal_email: "",
    imitation_code: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };



  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

      if (formData.password !== formData.password_conf) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, action: "signup" }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(result.error || "Registration failed. Please check your inputs.");
      }
    } catch (err) {
      setError("An unexpected error occurred while connecting to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#E0E1DD] dark:bg-[#060D14] transition-colors duration-200 relative overflow-y-auto overflow-x-hidden">
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
      </div>

      <div className="relative z-10 w-full flex flex-col justify-center max-w-xl bg-white/60 dark:bg-black/60 backdrop-blur-xl border border-white/40 dark:border-white/15 rounded-tr-2xl rounded-bl-2xl shadow-2xl p-6 sm:p-8 animate-scale-in my-8">
        <div className="text-center mb-6 animate-fade-up delay-100">
          <div className="w-10 h-10 mx-auto bg-[#0D1B2A] dark:bg-white/15 border border-black/10 dark:border-white/20 rounded-lg flex items-center justify-center mb-5">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="text-white font-bold text-lg">X</span>
            )}
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-[#0D1B2A] dark:text-white">
            Create an Account
          </h1>
          <p className="text-sm text-[#2F3E46] dark:text-white/60 mt-1.5">
            Fill in the details to sign up
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-300 text-xs text-center font-medium">
            Registration successful! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-5 animate-fade-up delay-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#1B263B] dark:text-white/80" htmlFor="email">
                User Email <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2.5 bg-white dark:bg-white/10 border border-black/15 dark:border-white/15 rounded-lg text-sm text-[#0D1B2A] dark:text-white placeholder:text-[#2F3E46]/40 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#1F7A1F]/30 dark:focus:ring-[#55f761]/40 focus:border-[#1F7A1F]/60 dark:focus:border-[#55f761]/50 transition-colors shadow-sm disabled:opacity-50"
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#1B263B] dark:text-white/80" htmlFor="username">
                User Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2.5 bg-white dark:bg-white/10 border border-black/15 dark:border-white/15 rounded-lg text-sm text-[#0D1B2A] dark:text-white placeholder:text-[#2F3E46]/40 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#1F7A1F]/30 dark:focus:ring-[#55f761]/40 focus:border-[#1F7A1F]/60 dark:focus:border-[#55f761]/50 transition-colors shadow-sm disabled:opacity-50"
                type="text"
                id="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="username"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#1B263B] dark:text-white/80" htmlFor="password">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  className="w-full px-3 py-2.5 pr-10 bg-white dark:bg-white/10 border border-black/15 dark:border-white/15 rounded-lg text-sm text-[#0D1B2A] dark:text-white placeholder:text-[#2F3E46]/40 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#1F7A1F]/30 dark:focus:ring-[#55f761]/40 focus:border-[#1F7A1F]/60 dark:focus:border-[#55f761]/50 transition-colors shadow-sm disabled:opacity-50"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#1B263B] dark:text-white/80" htmlFor="password_conf">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  className="w-full px-3 py-2.5 pr-10 bg-white dark:bg-white/10 border border-black/15 dark:border-white/15 rounded-lg text-sm text-[#0D1B2A] dark:text-white placeholder:text-[#2F3E46]/40 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#1F7A1F]/30 dark:focus:ring-[#55f761]/40 focus:border-[#1F7A1F]/60 dark:focus:border-[#55f761]/50 transition-colors shadow-sm disabled:opacity-50"
                  type={showConfirmPassword ? "text" : "password"}
                  id="password_conf"
                  required
                  value={formData.password_conf}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#2F3E46] dark:text-white/60 hover:text-[#0D1B2A] dark:hover:text-white transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#1B263B] dark:text-white/80" htmlFor="referal_email">
                Referral Email <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2.5 bg-white dark:bg-white/10 border border-black/15 dark:border-white/15 rounded-lg text-sm text-[#0D1B2A] dark:text-white placeholder:text-[#2F3E46]/40 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#1F7A1F]/30 dark:focus:ring-[#55f761]/40 focus:border-[#1F7A1F]/60 dark:focus:border-[#55f761]/50 transition-colors shadow-sm disabled:opacity-50"
                type="email"
                id="referal_email"
                required
                value={formData.referal_email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#1B263B] dark:text-white/80" htmlFor="imitation_code">
                Invitation Code <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2.5 bg-white dark:bg-white/10 border border-black/15 dark:border-white/15 rounded-lg text-sm text-[#0D1B2A] dark:text-white placeholder:text-[#2F3E46]/40 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#1F7A1F]/30 dark:focus:ring-[#55f761]/40 focus:border-[#1F7A1F]/60 dark:focus:border-[#55f761]/50 transition-colors shadow-sm disabled:opacity-50"
                type="text"
                id="imitation_code"
                required
                value={formData.imitation_code}
                onChange={handleChange}
                placeholder=""
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1F7A1F] hover:bg-[#145214] text-white dark:bg-[#55f761] dark:hover:bg-[#3de34a] dark:text-[#060D14] font-semibold rounded-tr-xl rounded-bl-xl py-2.5 text-sm transition-colors shadow-lg shadow-black/10 dark:shadow-[#55f761]/20 disabled:opacity-70 flex justify-center items-center"
            >
              {isLoading ? "Validating & Creating Account..." : "Create Account"}
            </button>
            <Link
              href="/login"
              className="w-full bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-[#0D1B2A] dark:text-white border border-black/15 dark:border-white/15 font-semibold rounded-tr-xl rounded-bl-xl py-2.5 text-sm transition-colors flex justify-center items-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
