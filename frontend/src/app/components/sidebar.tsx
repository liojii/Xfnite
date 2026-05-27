"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] flex-shrink-0 flex flex-col overflow-y-auto hidden md:flex border-r border-[#1B263B]/10 dark:border-[#E0E1DD]/10 py-6">
      <nav className="space-y-2 flex flex-col px-4">
        <Link
          href="/project"
          className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors rounded-tr-xl rounded-bl-xl ${
            pathname === "/project"
              ? "bg-white dark:bg-[#1B263B] text-[#0D1B2A] dark:text-[#E0E1DD] shadow-sm"
              : "text-[#2F3E46] dark:text-[#E0E1DD]/70 hover:bg-white/50 dark:hover:bg-[#1B263B]/50 hover:text-[#0D1B2A] dark:hover:text-[#E0E1DD]"
          }`}
        >
          Projects
        </Link>
        <Link
          href="/account"
          className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors rounded-tr-xl rounded-bl-xl ${
            pathname === "/account"
              ? "bg-white dark:bg-[#1B263B] text-[#0D1B2A] dark:text-[#E0E1DD] shadow-sm"
              : "text-[#2F3E46] dark:text-[#E0E1DD]/70 hover:bg-white/50 dark:hover:bg-[#1B263B]/50 hover:text-[#0D1B2A] dark:hover:text-[#E0E1DD]"
          }`}
        >
          Account Info
        </Link>
        <Link
          href="/earnings"
          className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors rounded-tr-xl rounded-bl-xl ${
            pathname === "/earnings"
              ? "bg-white dark:bg-[#1B263B] text-[#0D1B2A] dark:text-[#E0E1DD] shadow-sm"
              : "text-[#2F3E46] dark:text-[#E0E1DD]/70 hover:bg-white/50 dark:hover:bg-[#1B263B]/50 hover:text-[#0D1B2A] dark:hover:text-[#E0E1DD]"
          }`}
        >
          Earnings & Payments
        </Link>
      </nav>
    </aside>
  );
}
