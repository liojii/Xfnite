
import { ThemeToggle } from '@/components/ThemeToggle';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
    userName: string;
    isLoggingOut: boolean;
    onLogout: () => void | Promise<void>;
}

export default function Header({ userName, isLoggingOut, onLogout }: HeaderProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="h-14 bg-white dark:bg-[#0D1B2A] border-b border-[#1B263B]/10 dark:border-[#E0E1DD]/10 flex items-center justify-between px-6 sticky top-0 z-20 transition-colors duration-200">
            <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded bg-[#0D1B2A] dark:bg-[#E0E1DD] flex items-center justify-center">
                    <span className="text-white dark:text-[#0D1B2A] font-bold text-[11px]">G</span>
                </div>
                <span className="font-semibold tracking-tight text-sm text-[#0D1B2A] dark:text-[#E0E1DD]">XFINITE</span>
            </div>
            <div className="flex items-center gap-4">
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
                        <svg
                            className={`w-3.5 h-3.5 text-[#2F3E46] dark:text-[#E0E1DD]/80 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#1B263B] border border-[#1B263B]/10 dark:border-[#E0E1DD]/10 rounded-md shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-4 py-2 border-b border-[#1B263B]/10 dark:border-[#E0E1DD]/10 flex items-center justify-between">
                                <span className="text-sm font-medium text-[#2F3E46] dark:text-[#E0E1DD]/80">Theme</span>
                                <ThemeToggle />
                            </div>
                            <button
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    onLogout();
                                }}
                                disabled={isLoggingOut}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
                            >
                                {isLoggingOut ? 'Logging out...' : 'Log out'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
