"use client";

import { useState } from "react";

export default function AccountPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#0D1B2A] dark:text-[#E0E1DD]">Ginger Profile</h1>
        <p className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60 mt-1">
          View your identification and system access details.
        </p>
      </div>

      <div className="bg-white dark:bg-[#0D1B2A] border border-[#1B263B]/10 dark:border-[#E0E1DD]/10 rounded-xl shadow-sm overflow-hidden transition-colors duration-200">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1B263B]/10 dark:divide-[#E0E1DD]/10 border-b border-[#1B263B]/10 dark:border-[#E0E1DD]/10">
          <div className="p-6 space-y-1">
            <p className="text-xs font-medium text-[#2F3E46] dark:text-[#E0E1DD]/60 uppercase tracking-wider">User Identification</p>
            <div className="flex items-center gap-2 pt-1">
              <p className="text-sm font-semibold text-[#0D1B2A] dark:text-[#E0E1DD]">XF_CynthiaS09</p>
              <span className="inline-flex items-center rounded-md bg-[#E0E1DD] dark:bg-[#1B263B] px-2 py-0.5 text-xs font-medium text-[#1B263B] dark:text-[#E0E1DD]/90 border border-[#1B263B]/5 dark:border-[#E0E1DD]/10 transition-colors">
                Part Time
              </span>
            </div>
          </div>
          <div className="p-6 space-y-1">
            <p className="text-xs font-medium text-[#2F3E46] dark:text-[#E0E1DD]/60 uppercase tracking-wider">Email Address</p>
            <p className="text-sm text-[#0D1B2A] dark:text-[#E0E1DD] pt-1">cynthiacysab09@gmail.com</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1B263B]/10 dark:divide-[#E0E1DD]/10 border-b border-[#1B263B]/10 dark:border-[#E0E1DD]/10">
          <div className="p-6 space-y-1">
            <p className="text-xs font-medium text-[#2F3E46] dark:text-[#E0E1DD]/60 uppercase tracking-wider">System Status</p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#1F7A1F]/10 border border-[#1F7A1F]/20 px-2 py-0.5 text-xs font-semibold text-[#1F7A1F]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1F7A1F]"></span>
                Active
              </span>
            </div>
          </div>
          <div className="p-6 space-y-1">
            <p className="text-xs font-medium text-[#2F3E46] dark:text-[#E0E1DD]/60 uppercase tracking-wider">Default Role</p>
            <p className="text-sm text-[#0D1B2A] dark:text-[#E0E1DD] pt-1">Checker</p>
          </div>
        </div>

        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#E0E1DD]/50 dark:bg-[#060D14]/50">
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#2F3E46] dark:text-[#E0E1DD]/60 uppercase tracking-wider">Software Access Codes</p>
            <p className="text-sm text-[#1B263B] dark:text-[#E0E1DD]/80">Terminal credentials for annotation software.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-white dark:bg-[#1B263B] border border-[#1B263B]/20 dark:border-[#E0E1DD]/10 text-sm font-medium text-[#0D1B2A] dark:text-[#E0E1DD] hover:bg-[#E0E1DD]/50 dark:hover:bg-[#1B263B]/80 hover:border-[#1B263B]/30 dark:hover:border-[#E0E1DD]/20 shadow-sm px-4 py-2 transition-colors"
          >
            Reveal Passwords
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1B2A]/60 dark:bg-[#060D14]/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0D1B2A] rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-xl border dark:border-[#E0E1DD]/10">
            <div className="flex items-center justify-between p-6 border-b border-[#1B263B]/10 dark:border-[#E0E1DD]/10">
              <h2 className="text-lg font-semibold tracking-tight text-[#0D1B2A] dark:text-[#E0E1DD]">
                Security Access Log
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-md w-8 h-8 flex items-center justify-center text-[#2F3E46] dark:text-[#E0E1DD]/60 hover:text-[#0D1B2A] dark:hover:text-[#E0E1DD] hover:bg-[#E0E1DD] dark:hover:bg-[#1B263B] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-6">
              <div className="border border-[#1B263B]/10 dark:border-[#E0E1DD]/10 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-[#1B263B]/10 dark:border-[#E0E1DD]/10 bg-[#E0E1DD]/50 dark:bg-[#060D14]">
                      <th className="py-3 px-4 font-medium text-xs uppercase tracking-wider text-[#2F3E46] dark:text-[#E0E1DD]/60">Role</th>
                      <th className="py-3 px-4 font-medium text-xs uppercase tracking-wider text-[#2F3E46] dark:text-[#E0E1DD]/60">Software UID</th>
                      <th className="py-3 px-4 font-medium text-xs uppercase tracking-wider text-[#2F3E46] dark:text-[#E0E1DD]/60 text-right">Password</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1B263B]/10 dark:divide-[#E0E1DD]/10">
                    <tr className="hover:bg-[#E0E1DD]/30 dark:hover:bg-[#E0E1DD]/5 transition-colors">
                      <td className="py-3 px-4 font-medium text-[#0D1B2A] dark:text-[#E0E1DD]">Labeler</td>
                      <td className="py-3 px-4 text-[#1B263B] dark:text-[#E0E1DD]/80">181374</td>
                      <td className="py-3 px-4 text-[#0D1B2A] dark:text-[#E0E1DD] font-mono text-right">AalWnq</td>
                    </tr>
                    <tr className="hover:bg-[#E0E1DD]/30 dark:hover:bg-[#E0E1DD]/5 transition-colors">
                      <td className="py-3 px-4 font-medium text-[#0D1B2A] dark:text-[#E0E1DD]">Labeler</td>
                      <td className="py-3 px-4 text-[#1B263B] dark:text-[#E0E1DD]/80">1121898</td>
                      <td className="py-3 px-4 text-[#0D1B2A] dark:text-[#E0E1DD] font-mono text-right">SnreSV</td>
                    </tr>
                    <tr className="hover:bg-[#E0E1DD]/30 dark:hover:bg-[#E0E1DD]/5 transition-colors">
                      <td className="py-3 px-4 font-medium text-[#0D1B2A] dark:text-[#E0E1DD]">Labeler</td>
                      <td className="py-3 px-4 text-[#1B263B] dark:text-[#E0E1DD]/80">1123563</td>
                      <td className="py-3 px-4 text-[#0D1B2A] dark:text-[#E0E1DD] font-mono text-right">NZWzvl</td>
                    </tr>
                    <tr className="hover:bg-[#E0E1DD]/30 dark:hover:bg-[#E0E1DD]/5 transition-colors">
                      <td className="py-3 px-4 font-medium text-[#0D1B2A] dark:text-[#E0E1DD]">Checker</td>
                      <td className="py-3 px-4 text-[#1B263B] dark:text-[#E0E1DD]/80">1118913</td>
                      <td className="py-3 px-4 text-[#0D1B2A] dark:text-[#E0E1DD] font-mono text-right">BvaXbT</td>
                    </tr>
                    <tr className="hover:bg-[#E0E1DD]/30 dark:hover:bg-[#E0E1DD]/5 transition-colors">
                      <td className="py-3 px-4 font-medium text-[#0D1B2A] dark:text-[#E0E1DD]">Checker</td>
                      <td className="py-3 px-4 text-[#1B263B] dark:text-[#E0E1DD]/80">1118914</td>
                      <td className="py-3 px-4 text-[#0D1B2A] dark:text-[#E0E1DD] font-mono text-right">ZfkfBn</td>
                    </tr>
                    <tr className="hover:bg-[#E0E1DD]/30 dark:hover:bg-[#E0E1DD]/5 transition-colors">
                      <td className="py-3 px-4 font-medium text-[#0D1B2A] dark:text-[#E0E1DD]">Checker</td>
                      <td className="py-3 px-4 text-[#1B263B] dark:text-[#E0E1DD]/80">1118915</td>
                      <td className="py-3 px-4 text-[#0D1B2A] dark:text-[#E0E1DD] font-mono text-right">HivxwV</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
