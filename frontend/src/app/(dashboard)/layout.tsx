"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState, useEffect, useRef } from "react";
import { Toaster } from "sonner";
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [userName, setUserName] = useState<string>("User");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("scrapedGingerData");
    if (!data) {
      router.replace("/login");
    } else {
      try {
        const parsed = JSON.parse(data);
        const name = parsed?.user?.user_name || parsed?.name || parsed?.userName;
        if (name) setUserName(name);
      } catch {
        router.replace("/login");
      }
      setIsAuthChecking(false);
    }
  }, [router]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const executeLogout = async () => {
    setShowLogoutModal(false);
    setIsLoggingOut(true);
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        localStorage.removeItem('scrapedGingerData');
        router.push('/login');
      } else {
        console.error("Failed to log out from Ginger API");
        localStorage.removeItem('scrapedGingerData');
        router.push('/login');
      }
    } catch (error) {
      console.error("Logout error", error);
      localStorage.removeItem('scrapedGingerData');
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Do not render the dashboard until we confirm the user is authenticated
  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E0E1DD] dark:bg-[#060D14]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D1B2A] dark:border-[#E0E1DD]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#E0E1DD] dark:bg-[#060D14] font-sans transition-colors duration-200">
      <Header 
        userName={userName} 
        isLoggingOut={isLoggingOut} 
        onLogout={handleLogout} 
      />

      {/* MAIN CONTAINER */}
      <div className="flex flex-1 overflow-hidden w-full">
        <Sidebar />

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      <Toaster position="top-right" richColors closeButton />

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1B2A]/60 dark:bg-[#060D14]/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0D1B2A] rounded-xl w-full max-w-sm shadow-xl border dark:border-[#E0E1DD]/10 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold tracking-tight text-[#0D1B2A] dark:text-[#E0E1DD] mb-2">
                Confirm Logout
              </h2>
              <p className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/70">
                Are you sure you want to log out of your account?
              </p>
            </div>
            <div className="border-t border-[#1B263B]/10 dark:border-[#E0E1DD]/10 p-4 flex justify-end gap-3 bg-gray-50 dark:bg-[#060D14]">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="rounded-md border border-[#1B263B]/20 dark:border-[#E0E1DD]/20 bg-white dark:bg-[#1B263B] px-4 py-2 text-sm font-medium text-[#0D1B2A] dark:text-[#E0E1DD] hover:bg-gray-50 dark:hover:bg-[#1B263B]/80 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={executeLogout}
                className="inline-flex items-center justify-center rounded-md bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors shadow-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
