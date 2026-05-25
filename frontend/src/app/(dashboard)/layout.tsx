"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState, useEffect, useRef } from "react";
import { Toaster } from "sonner";
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import LogoutModal from "@/app/components/LogoutModal";

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
      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
        onConfirm={executeLogout} 
      />
    </div>
  );
}
