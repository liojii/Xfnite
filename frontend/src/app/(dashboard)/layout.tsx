"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState, useEffect, useRef } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    // Check authentication on mount
    const authData = localStorage.getItem('scrapedGingerData');
    if (!authData) {
      router.replace('/login');
    } else {
      try {
        const parsed = JSON.parse(authData);
        if (parsed?.name) setUserName(parsed.name);
      } catch (e) {
        // Ignore parse error
      }
      setIsAuthChecking(false);
    }
  }, [router]);

  useEffect(() => {
    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) {
      return;
    }
    
    setIsLoggingOut(true);
    setIsDropdownOpen(false);
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
      {/* HEADER */}
      <header className="h-14 bg-white dark:bg-[#0D1B2A] border-b border-[#1B263B]/10 dark:border-[#E0E1DD]/10 flex items-center justify-between px-6 sticky top-0 z-20 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-[#0D1B2A] dark:bg-[#E0E1DD] flex items-center justify-center">
            <span className="text-white dark:text-[#0D1B2A] font-bold text-[11px]">G</span>
          </div>
          <span className="font-semibold tracking-tight text-sm text-[#0D1B2A] dark:text-[#E0E1DD]">Ginger Annotation</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="flex items-center gap-4 border-l border-[#1B263B]/10 dark:border-[#E0E1DD]/10 pl-4 relative" ref={dropdownRef}>
            
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 group focus:outline-none"
            >
              <div className="w-7 h-7 rounded-full bg-[#E0E1DD] dark:bg-[#1B263B] border border-[#1B263B]/10 dark:border-[#E0E1DD]/10 text-[#2F3E46] dark:text-[#E0E1DD]/80 flex items-center justify-center font-medium text-[11px] group-hover:bg-[#1B263B] dark:group-hover:bg-[#E0E1DD] group-hover:text-white dark:group-hover:text-[#0D1B2A] transition-colors">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-[13px] font-medium text-[#2F3E46] dark:text-[#E0E1DD]/80 group-hover:text-[#0D1B2A] dark:group-hover:text-[#E0E1DD] transition-colors">
                {userName}
              </span>
              <svg className={`w-3.5 h-3.5 text-[#2F3E46] dark:text-[#E0E1DD]/80 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#1B263B] border border-[#1B263B]/10 dark:border-[#E0E1DD]/10 rounded-md shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <button 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
                >
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </button>
              </div>
            )}

          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex flex-1 overflow-hidden w-full max-w-[1400px] mx-auto py-6 px-4 sm:px-6 lg:px-8 gap-8">
        {/* SIDEBAR */}
        <aside className="w-[240px] flex-shrink-0 flex flex-col overflow-y-auto hidden md:flex">
          <nav className="space-y-6">
            
            <div>
              <h3 className="px-3 text-[11px] font-semibold text-[#2F3E46] dark:text-[#E0E1DD]/60 mb-2 tracking-wider uppercase">
                Data Operations
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/project"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      pathname === "/project"
                        ? "bg-white dark:bg-[#0D1B2A] border border-[#1B263B]/10 dark:border-[#E0E1DD]/10 shadow-sm text-[#0D1B2A] dark:text-[#E0E1DD]"
                        : "text-[#2F3E46] dark:text-[#E0E1DD]/70 hover:bg-white/50 dark:hover:bg-[#0D1B2A]/50 hover:text-[#0D1B2A] dark:hover:text-[#E0E1DD] border border-transparent"
                    }`}
                  >
                    Projects
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="px-3 text-[11px] font-semibold text-[#2F3E46] dark:text-[#E0E1DD]/60 mb-2 tracking-wider uppercase">
                User Directory
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/account"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      pathname === "/account"
                        ? "bg-white dark:bg-[#0D1B2A] border border-[#1B263B]/10 dark:border-[#E0E1DD]/10 shadow-sm text-[#0D1B2A] dark:text-[#E0E1DD]"
                        : "text-[#2F3E46] dark:text-[#E0E1DD]/70 hover:bg-white/50 dark:hover:bg-[#0D1B2A]/50 hover:text-[#0D1B2A] dark:hover:text-[#E0E1DD] border border-transparent"
                    }`}
                  >
                    Ginger Info
                  </Link>
                </li>
              </ul>
            </div>
            
          </nav>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
