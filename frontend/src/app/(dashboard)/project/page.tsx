"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ProjectPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedRegisterProject, setSelectedRegisterProject] = useState<any>(null);
  const [registerHoursInput, setRegisterHoursInput] = useState<number>(1);
  const [isRegistering, setIsRegistering] = useState(false);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // The API returns ongoing_annotate_list
        setProjects(result.data.ongoing_annotate_list || result.data.annotate_list || []);
      } else {
        setError(result.error || (result.details ? JSON.stringify(result.details) : "Failed to load projects"));
      }
    } catch (err) {
      setError("An unexpected error occurred while fetching projects.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openRegisterModal = (project: any) => {
    setSelectedRegisterProject(project);
    setRegisterHoursInput(project.annotate_schedule_details?.register_hours || 1);
  };

  const closeRegisterModal = () => {
    setSelectedRegisterProject(null);
  };

  const handleRegisterSubmit = async () => {
    if (!selectedRegisterProject) return;

    setIsRegistering(true);
    try {
      const response = await fetch('/api/projects/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          annotate_id: selectedRegisterProject.annotate_id,
          register_hours: registerHoursInput,
          start_of_cycle: selectedRegisterProject.annotate_schedule_details?.start_of_cycle,
          end_of_cycle: selectedRegisterProject.annotate_schedule_details?.end_of_cycle
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(`Registered ${registerHoursInput} hours successfully!`, {
          description: selectedRegisterProject.annotate_name,
        });
        closeRegisterModal();
        // Optionally refresh projects to get the updated status/registered hours
        fetchProjects();
      } else {
        toast.error(`Registration failed`, {
          description: result.error || 'Unknown error',
        });
      }
    } catch (err) {
      toast.error("An unexpected error occurred during registration.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#0D1B2A] dark:text-[#E0E1DD]">Projects</h1>
        <p className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/60 mt-1">
          Manage and view your active annotation deployments.
        </p>
      </div>

      <div className="bg-white dark:bg-[#0D1B2A] border border-[#1B263B]/10 dark:border-[#E0E1DD]/10 rounded-tr-2xl rounded-bl-2xl shadow-sm overflow-hidden transition-colors duration-200">

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-500/10 border-b border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-[#1B263B]/10 dark:border-[#E0E1DD]/10 bg-[#E0E1DD]/30 dark:bg-[#060D14]/50">
                <th className="py-3 px-4 font-medium text-xs uppercase tracking-wider text-[#2F3E46] dark:text-[#E0E1DD]/70">Project ID</th>
                <th className="py-3 px-4 font-medium text-xs uppercase tracking-wider text-[#2F3E46] dark:text-[#E0E1DD]/70">Name</th>
                <th className="py-3 px-4 font-medium text-xs uppercase tracking-wider text-[#2F3E46] dark:text-[#E0E1DD]/70">Status</th>
                <th className="py-3 px-4 font-medium text-xs uppercase tracking-wider text-[#2F3E46] dark:text-[#E0E1DD]/70">Started Date</th>
                <th className="py-3 px-4 font-medium text-xs uppercase tracking-wider text-[#2F3E46] dark:text-[#E0E1DD]/70">Task Num</th>
                <th className="py-3 px-4 font-medium text-xs uppercase tracking-wider text-[#2F3E46] dark:text-[#E0E1DD]/70 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B263B]/10 dark:divide-[#E0E1DD]/10">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#2F3E46] dark:text-[#E0E1DD]/60">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-6 h-6 border-2 border-[#1F7A1F] border-t-transparent rounded-full animate-spin mb-2"></div>
                      Loading projects...
                    </div>
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#2F3E46] dark:text-[#E0E1DD]/60">
                    No active projects found.
                  </td>
                </tr>
              ) : (
                projects.map((project: any, index: number) => (
                  <tr key={index} className="hover:bg-[#E0E1DD]/50 dark:hover:bg-[#E0E1DD]/5 transition-colors group">
                    <td className="py-3 px-4 font-medium text-[#0D1B2A] dark:text-[#E0E1DD]">
                      {project.annotate_project_id || project.annotate_id}
                    </td>
                    <td className="py-3 px-4 text-[#1B263B] dark:text-[#E0E1DD]/90">
                      {project.annotate_name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E0E1DD] dark:bg-[#1B263B] px-2.5 py-0.5 text-xs font-semibold text-[#0D1B2A] dark:text-[#E0E1DD] border border-[#1B263B]/5 dark:border-[#E0E1DD]/10 transition-colors capitalize">
                        <span className={`h-1.5 w-1.5 rounded-full ${project.annotate_status === 'running' ? 'bg-[#1F7A1F]' : 'bg-yellow-500'}`}></span>
                        {project.annotate_status === 'running' ? 'Ongoing' : project.annotate_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#2F3E46] dark:text-[#E0E1DD]/60">
                      {project.ts_started ? new Date(project.ts_started).toLocaleString() : '-'}
                    </td>
                    <td className="py-3 px-4 text-[#2F3E46] dark:text-[#E0E1DD]/60">
                      {project.statistics?.task_release_statistics?.total_task_count?.toLocaleString() || '-'}
                    </td>
                    <td className="py-3 px-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => openRegisterModal(project)}
                        className="inline-flex items-center justify-center gap-1.5 rounded bg-[#1F7A1F] hover:bg-[#166016] px-2.5 py-1 text-xs font-medium text-white transition-colors shadow-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>
                        Register
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between py-3 px-4 border-t border-[#1B263B]/10 dark:border-[#E0E1DD]/10 bg-[#E0E1DD]/30 dark:bg-[#060D14]/50">
          <div className="text-xs text-[#2F3E46] dark:text-[#E0E1DD]/60">
            Showing <span className="font-medium text-[#0D1B2A] dark:text-[#E0E1DD]">{projects.length}</span> results
          </div>
        </div>
      </div>

      {/* Register Modal */}
      {selectedRegisterProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1B2A]/60 dark:bg-[#060D14]/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0D1B2A] rounded-lg w-full max-w-4xl shadow-2xl border dark:border-[#E0E1DD]/10 overflow-hidden flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1B263B]/10 dark:border-[#E0E1DD]/10 bg-gray-50 dark:bg-[#060D14]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <h2 className="text-sm font-semibold text-[#0D1B2A] dark:text-[#E0E1DD]">Register Project</h2>
              <div className="w-12 flex justify-end">
                <button onClick={closeRegisterModal} className="text-[#2F3E46]/50 hover:text-[#0D1B2A] dark:text-[#E0E1DD]/50 dark:hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-0 flex flex-col md:flex-row">
              {/* Left Column */}
              <div className="w-full md:w-1/3 p-6 border-r border-[#1B263B]/10 dark:border-[#E0E1DD]/10 space-y-6">

                <div>
                  <div className="text-xs font-semibold text-[#2F3E46] dark:text-[#E0E1DD]/60 mb-1">Name:</div>
                  <div className="text-sm text-[#0D1B2A] dark:text-[#E0E1DD] font-medium">{selectedRegisterProject.annotate_name}</div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-[#2F3E46] dark:text-[#E0E1DD]/60 mb-1">Begin:</div>
                  <div className="text-sm text-[#0D1B2A] dark:text-[#E0E1DD] font-mono text-xs">
                    {selectedRegisterProject.annotate_schedule_details?.start_of_cycle || '-'}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-[#2F3E46] dark:text-[#E0E1DD]/60 mb-1">End:</div>
                  <div className="text-sm text-[#0D1B2A] dark:text-[#E0E1DD] font-mono text-xs">
                    {selectedRegisterProject.annotate_schedule_details?.end_of_cycle || '-'}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-[#2F3E46] dark:text-[#E0E1DD]/60 mb-1">Registered Hours:</div>
                  <div className="text-sm text-[#0D1B2A] dark:text-[#E0E1DD]">
                    {selectedRegisterProject.annotate_schedule_details?.register_hours || 1}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-[#2F3E46] dark:text-[#E0E1DD]/60 mb-1">Status:</div>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${selectedRegisterProject.annotate_status === 'running' ? 'bg-[#3B82F6]' : 'bg-yellow-500'}`}></span>
                    <span className="text-sm text-[#0D1B2A] dark:text-[#E0E1DD] capitalize">{selectedRegisterProject.annotate_status === 'running' ? 'Ongoing' : selectedRegisterProject.annotate_status}</span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="w-full md:w-2/3 p-6 space-y-6">
                <div>
                  <div className="text-sm font-semibold text-[#0D1B2A] dark:text-[#E0E1DD] mb-2">Notice:</div>
                  <ScrollArea className="h-48 rounded-md border border-gray-100 dark:border-[#E0E1DD]/5 bg-gray-50 dark:bg-[#1B263B]/20">
                    <div className="text-sm text-[#2F3E46] dark:text-[#E0E1DD]/80 p-4 leading-relaxed">
                      Tips:<br />
                      1. For road and road connected landcover features, turn on the 3rd product type, and edit from there. (minimize the editing on road unless it's very wrong)<br />
                      2. use group category and right click to change category quicky<br />
                      3. understand the definition and requirement of how to close a region<br />
                      4. no need to edit nature features<br />
                      5. need to understand each topo error meaning and use the proper tool to fix them quickly<br />
                      6. when report, everyone needs to understand who is wrong. Always try to fix the error in your own tasks first, then we put all necessary comments before reporting. (avoid endless report loop)<br />
                      7. if the neighbor connecting error is from tree canopy, no need to report, fix and connect in your task.
                    </div>
                  </ScrollArea>
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="text-xs font-semibold text-[#2F3E46] dark:text-[#E0E1DD]/60 mb-1">Min Hour:</div>
                    <div className="text-sm text-[#0D1B2A] dark:text-[#E0E1DD]">
                      {selectedRegisterProject.annotate_schedule_details?.min_hour_limit || 1}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-[#2F3E46] dark:text-[#E0E1DD]/60 mb-1">Max Hour:</div>
                    <div className="text-sm text-[#0D1B2A] dark:text-[#E0E1DD]">
                      {selectedRegisterProject.annotate_schedule_details?.max_hour_limit || 50}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-[#2F3E46] dark:text-[#E0E1DD]/60 mb-2">Authority Level:</div>
                    <div className="flex gap-2 flex-wrap">
                      {selectedRegisterProject.annotate_control_details?.authority_level_list?.map((level: string, i: number) => (
                        <span key={i} className="inline-flex items-center rounded border border-[#3B82F6]/30 bg-[#3B82F6]/5 px-2 py-1 text-xs font-medium text-[#3B82F6] capitalize">
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2F3E46] dark:text-[#E0E1DD]/60 mb-1">Registered Hours</label>
                    <input
                      type="number"
                      value={registerHoursInput}
                      onChange={(e) => setRegisterHoursInput(parseInt(e.target.value) || 0)}
                      className="w-full max-w-xs rounded-md border border-[#1B263B]/20 dark:border-[#E0E1DD]/20 bg-white dark:bg-[#060D14] px-3 py-2 text-sm text-[#0D1B2A] dark:text-[#E0E1DD] focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] transition-shadow shadow-sm"
                      min={selectedRegisterProject.annotate_schedule_details?.min_hour_limit || 1}
                      max={selectedRegisterProject.annotate_schedule_details?.max_hour_limit || 50}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#1B263B]/10 dark:border-[#E0E1DD]/10 p-4 flex justify-end gap-3 bg-gray-50 dark:bg-[#060D14]">
              <button
                onClick={closeRegisterModal}
                disabled={isRegistering}
                className="rounded-md border border-[#1B263B]/20 dark:border-[#E0E1DD]/20 bg-white dark:bg-[#1B263B] px-5 py-2 text-sm font-medium text-[#0D1B2A] dark:text-[#E0E1DD] hover:bg-gray-50 dark:hover:bg-[#1B263B]/80 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleRegisterSubmit}
                disabled={isRegistering}
                className="inline-flex items-center gap-2 rounded-md bg-[#1F7A1F] hover:bg-[#166016] px-5 py-2 text-sm font-medium text-white transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRegistering ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

