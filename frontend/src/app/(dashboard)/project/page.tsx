export default function ProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#0D1B2A] dark:text-[#E0E1DD]">Projects</h1>
        <p className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60 mt-1">
          Manage and view your active annotation deployments.
        </p>
      </div>

      <div className="bg-white dark:bg-[#0D1B2A] border border-[#1B263B]/10 dark:border-[#E0E1DD]/10 rounded-xl shadow-sm overflow-hidden transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-[#1B263B]/10 dark:border-[#E0E1DD]/10 bg-[#E0E1DD]/30 dark:bg-[#060D14]/50">
                <th className="py-3 px-4 font-medium text-xs uppercase tracking-wider text-[#2F3E46] dark:text-[#E0E1DD]/70">C Project ID</th>
                <th className="py-3 px-4 font-medium text-xs uppercase tracking-wider text-[#2F3E46] dark:text-[#E0E1DD]/70">Name Designation</th>
                <th className="py-3 px-4 font-medium text-xs uppercase tracking-wider text-[#2F3E46] dark:text-[#E0E1DD]/70">Status</th>
                <th className="py-3 px-4 font-medium text-xs uppercase tracking-wider text-[#2F3E46] dark:text-[#E0E1DD]/70">End Date</th>
                <th className="py-3 px-4 font-medium text-xs uppercase tracking-wider text-[#2F3E46] dark:text-[#E0E1DD]/70">Task Num</th>
                <th className="py-3 px-4 font-medium text-xs uppercase tracking-wider text-[#2F3E46] dark:text-[#E0E1DD]/70">Registered Hours</th>
                <th className="py-3 px-4 font-medium text-xs uppercase tracking-wider text-[#2F3E46] dark:text-[#E0E1DD]/70 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B263B]/10 dark:divide-[#E0E1DD]/10">
              <tr className="hover:bg-[#E0E1DD]/50 dark:hover:bg-[#E0E1DD]/5 transition-colors group">
                <td className="py-3 px-4 font-medium text-[#0D1B2A] dark:text-[#E0E1DD]">5231</td>
                <td className="py-3 px-4 text-[#1B263B] dark:text-[#E0E1DD]/90">transportation-landcover-repair--260519</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E0E1DD] dark:bg-[#1B263B] px-2.5 py-0.5 text-xs font-semibold text-[#0D1B2A] dark:text-[#E0E1DD] border border-[#1B263B]/5 dark:border-[#E0E1DD]/10 transition-colors">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1F7A1F]"></span>
                    Ongoing
                  </span>
                </td>
                <td className="py-3 px-4 text-[#2F3E46] dark:text-[#E0E1DD]/60">2026-05-19 23:59:59</td>
                <td className="py-3 px-4 text-[#2F3E46] dark:text-[#E0E1DD]/60">35,206</td>
                <td className="py-3 px-4 text-[#2F3E46] dark:text-[#E0E1DD]/60">1</td>
                <td className="py-3 px-4 text-right">
                  <button className="p-1.5 rounded-md text-[#2F3E46]/50 dark:text-[#E0E1DD]/40 hover:text-[#1F7A1F] dark:hover:text-[#1F7A1F] hover:bg-[#1F7A1F]/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between py-3 px-4 border-t border-[#1B263B]/10 dark:border-[#E0E1DD]/10 bg-[#E0E1DD]/30 dark:bg-[#060D14]/50">
          <div className="text-xs text-[#2F3E46] dark:text-[#E0E1DD]/60">
            Showing <span className="font-medium text-[#0D1B2A] dark:text-[#E0E1DD]">1</span> of <span className="font-medium text-[#0D1B2A] dark:text-[#E0E1DD]">1</span> results
          </div>
          <div className="flex items-center gap-2">
            <button className="px-2.5 py-1 rounded bg-white dark:bg-[#0D1B2A] border border-[#1B263B]/10 dark:border-[#E0E1DD]/10 text-xs font-medium text-[#2F3E46]/50 dark:text-[#E0E1DD]/30 shadow-sm cursor-not-allowed" disabled>Previous</button>
            <button className="px-2.5 py-1 rounded bg-white dark:bg-[#0D1B2A] border border-[#1B263B]/10 dark:border-[#E0E1DD]/10 text-xs font-medium text-[#2F3E46]/50 dark:text-[#E0E1DD]/30 shadow-sm cursor-not-allowed" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
