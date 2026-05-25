"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<string>("");
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const togglePasswordVisibility = (key: string) => {
    setVisiblePasswords(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        // First try to get UID from localStorage if needed, or we can just send empty body
        // and hope the API knows who we are based on the access token
        const response = await fetch('/api/account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Ginger API might return it wrapped or at root
          const koalaDetails = result.data?.koala_user_details || result.koala_user_details;
          setUserData(koalaDetails);
        } else {
          setError(result.error || "Failed to load account details");
        }
      } catch (err) {
        setError("An unexpected error occurred while fetching account details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountData();
  }, []);

  // Helper to format authority level tags
  const formatAuthLevel = (level: string) => {
    return level.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Group roles for "Software Users" section
  const groupedRoles = userData?.koala_user_role?.reduce((acc: any, roleObj: any) => {
    if (!acc[roleObj.role]) {
      acc[roleObj.role] = [];
    }
    acc[roleObj.role].push(roleObj);
    return acc;
  }, {});

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#0D1B2A] dark:text-[#E0E1DD]">Account Info</h1>
        <p className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60 mt-1">
          Manage and view your user profile and software access details.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 border-b border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-[#0D1B2A] border border-[#1B263B]/10 dark:border-[#E0E1DD]/10 rounded-tr-2xl rounded-bl-2xl shadow-sm overflow-hidden transition-colors duration-200">
        
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center text-[#2F3E46] dark:text-[#E0E1DD]/60">
            <div className="w-8 h-8 border-2 border-[#1F7A1F] border-t-transparent rounded-full animate-spin mb-3"></div>
            Loading profile details...
          </div>
        ) : !userData ? (
          <div className="p-12 text-center text-[#2F3E46] dark:text-[#E0E1DD]/60">
            No profile data found.
          </div>
        ) : (
          <div className="divide-y divide-[#1B263B]/10 dark:divide-[#E0E1DD]/10">
            
            {/* User Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1B263B]/10 dark:divide-[#E0E1DD]/10">
              <div className="grid grid-cols-[140px_1fr] p-5">
                <div className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60">User Name</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#0D1B2A] dark:text-[#E0E1DD]">{userData.user_name}</span>
                  {userData.full_time === 0 && (
                    <span className="inline-flex items-center rounded bg-[#E0E1DD] dark:bg-[#1B263B] px-1.5 py-0.5 text-[11px] font-medium text-[#1B263B] dark:text-[#E0E1DD]/90 border border-[#1B263B]/5 dark:border-[#E0E1DD]/10">
                      Part Time
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-[140px_1fr] p-5">
                <div className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60">User Email</div>
                <div className="text-sm font-medium text-[#0D1B2A] dark:text-[#E0E1DD] break-all">{userData.user_email}</div>
              </div>
            </div>

            {/* Status & Default Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1B263B]/10 dark:divide-[#E0E1DD]/10">
              <div className="grid grid-cols-[140px_1fr] p-5">
                <div className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60">Status</div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold ${!userData.disable ? 'bg-[#1F7A1F]/10 border border-[#1F7A1F]/20 text-[#1F7A1F]' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${!userData.disable ? 'bg-[#1F7A1F]' : 'bg-red-500'}`}></span>
                    {!userData.disable ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-[140px_1fr] p-5">
                <div className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60">Default Role</div>
                <div className="text-sm font-medium text-[#0D1B2A] dark:text-[#E0E1DD] capitalize">{userData.role || '-'}</div>
              </div>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1B263B]/10 dark:divide-[#E0E1DD]/10">
              <div className="grid grid-cols-[140px_1fr] p-5">
                <div className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60">A-Score</div>
                <div className="text-sm font-medium text-[#0D1B2A] dark:text-[#E0E1DD]">{userData.overall_performance?.avg_ascore?.toFixed(1) || '0.0'}</div>
              </div>
              <div className="grid grid-cols-[140px_1fr] p-5">
                <div className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60">P-Score</div>
                <div className="text-sm font-medium text-[#0D1B2A] dark:text-[#E0E1DD]">{userData.overall_performance?.avg_pscore?.toFixed(1) || '0.0'}</div>
              </div>
            </div>

            {/* Group & Team */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1B263B]/10 dark:divide-[#E0E1DD]/10">
              <div className="grid grid-cols-[140px_1fr] p-5">
                <div className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60">Group</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-[#0D1B2A] dark:text-[#E0E1DD]">{userData.group_name} [{userData.group_id}]</span>
                  {userData.is_group_manager && (
                    <span className="inline-flex items-center rounded border border-[#0D1B2A]/20 dark:border-[#E0E1DD]/20 bg-transparent px-1.5 py-0.5 text-[10px] font-semibold text-[#0D1B2A] dark:text-[#E0E1DD] uppercase">
                      Leader
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-[140px_1fr] p-5">
                <div className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60">Team</div>
                <div className="text-sm font-medium text-[#0D1B2A] dark:text-[#E0E1DD]">{userData.team_name} [{userData.team_id}]</div>
              </div>
            </div>

            {/* Authority Level */}
            <div className="grid grid-cols-[140px_1fr] p-5">
              <div className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60">Authority Level</div>
              <div className="flex flex-wrap gap-2">
                {userData.authority_level_list?.map((level: string, i: number) => (
                  <span key={i} className="inline-flex items-center rounded bg-[#1F7A1F] px-2.5 py-1 text-[11px] font-semibold text-white">
                    {formatAuthLevel(level)}
                  </span>
                )) || <span className="text-sm text-[#2F3E46]/50">-</span>}
              </div>
            </div>

            {/* Software Users Tabs */}
            <div className="grid grid-cols-1 p-5">
              <div className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60 mb-4">Software Accounts</div>
              {groupedRoles && Object.keys(groupedRoles).length > 0 ? (
                <div>
                  <div className="flex gap-2 border-b border-[#1B263B]/10 dark:border-[#E0E1DD]/10 mb-4 pb-2 overflow-x-auto">
                    {Object.keys(groupedRoles).map((roleName) => (
                      <button
                        key={roleName}
                        onClick={() => setActiveTab(roleName)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${
                          (activeTab || Object.keys(groupedRoles)[0]) === roleName
                            ? 'bg-[#1B263B] dark:bg-[#E0E1DD] text-white dark:text-[#0D1B2A]'
                            : 'text-[#2F3E46] dark:text-[#E0E1DD]/70 hover:bg-[#E0E1DD]/50 dark:hover:bg-[#1B263B]/50'
                        }`}
                      >
                        {roleName}
                      </button>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedRoles[activeTab || Object.keys(groupedRoles)[0]]?.map((role: any, idx: number) => {
                      const currentTab = activeTab || Object.keys(groupedRoles)[0];
                      return (
                      <div key={idx} className="flex flex-col p-4 bg-gray-50 dark:bg-[#060D14]/50 rounded-lg border border-[#1B263B]/10 dark:border-[#E0E1DD]/10 shadow-sm">
                        <div className="text-xs text-[#2F3E46] dark:text-[#E0E1DD]/60 mb-1">UID</div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#1F7A1F]"></span>
                          <span className="text-sm font-mono font-medium text-[#0D1B2A] dark:text-[#E0E1DD]">{role.role_user_id}</span>
                        </div>
                        <div className="text-xs text-[#2F3E46] dark:text-[#E0E1DD]/60 mb-1">Password</div>
                        <div className="flex items-center justify-between text-sm font-mono font-medium text-[#2F3E46] dark:text-[#E0E1DD] bg-white dark:bg-[#0D1B2A] py-1.5 px-3 rounded border border-[#1B263B]/10 dark:border-[#E0E1DD]/10 group">
                          <span>
                            {visiblePasswords[`${currentTab}-${idx}`] ? role.role_password : "••••••••"}
                          </span>
                          <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => togglePasswordVisibility(`${currentTab}-${idx}`)}
                              className="hover:text-[#1F7A1F] dark:hover:text-[#55f761] transition-colors p-1"
                              title={visiblePasswords[`${currentTab}-${idx}`] ? "Hide Password" : "Show Password"}
                            >
                              {visiblePasswords[`${currentTab}-${idx}`] ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                              )}
                            </button>
                            <button
                              onClick={() => copyToClipboard(role.role_password, `${currentTab}-${idx}`)}
                              className="hover:text-[#1F7A1F] dark:hover:text-[#55f761] transition-colors p-1"
                              title="Copy Password"
                            >
                              {copiedKey === `${currentTab}-${idx}` ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )})}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-[#2F3E46]/50 dark:text-[#E0E1DD]/50">No accounts found.</div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
