/**
 * Footer / Bottom Navigation Component
 * Refactored for Modern Material Design & Floating Dock Style
 */

"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

interface NavItem {
  label: string;
  path: string;
  icon: (isActive: boolean) => React.ReactElement;
}

const navItems: NavItem[] = [
  {
    label: "Home",
    path: "/home",
    icon: (isActive) => (
      <svg className={`w-6 h-6 ${isActive ? "stroke-2" : "stroke-[1.5]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Setor",
    path: "/setor-online",
    icon: (isActive) => (
      <svg className={`w-6 h-6 ${isActive ? "stroke-2" : "stroke-[1.5]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  },
  {
    label: "Jadwal",
    path: "/jadwal",
    icon: (isActive) => (
      <svg className={`w-6 h-6 ${isActive ? "stroke-2" : "stroke-[1.5]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Transaksi",
    path: "/transaksi",
    icon: (isActive) => (
      <svg className={`w-6 h-6 ${isActive ? "stroke-2" : "stroke-[1.5]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    label: "Profil",
    path: "/profil",
    icon: (isActive) => (
      <svg className={`w-6 h-6 ${isActive ? "stroke-2" : "stroke-[1.5]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export const Footer: React.FC = (): JSX.Element => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string): boolean => {
    if (path === "/home") return pathname === path || pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    // Outer container =>  Handles positioning (Fixed bottom on mobile, Floating on desktop)
    <div className="fixed bottom-0 left-0 right-0 z-50 p-0 sm:p-6 flex justify-center pointer-events-none">
      
      {/* Inner Nav: 
        - Mobile: Full width, white background, border-t
        - Desktop: Rounded pills, floating shadow, glassmorphism 
        - pointer-events-auto ensures clicks work while outer container lets clicks pass through to sides
      */}
      <nav className="pointer-events-auto w-full sm:max-w-lg bg-white/90 sm:bg-white/80 backdrop-blur-xl border-t sm:border border-gray-200/50 sm:rounded-full shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] sm:shadow-2xl transition-all duration-300">
        <ul className="flex justify-evenly items-center h-16 sm:h-20 px-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <li key={item.path} className="flex-1 mar-w-20">
                <button
                  onClick={() => router.push(item.path)}
                  className="w-full flex flex-col items-center justify-center gap-1 group relative py-1"
                >
                  {/* Active Indicator (Pill) */}
                  <div
                    className={`absolute top-0 w-12 h-8 rounded-full transition-all duration-300 ease-out -z-10 ${
                      active 
                        ? "bg-green-100 scale-100 opacity-100" 
                        : "bg-gray-100 scale-0 opacity-0 group-hover:scale-75 group-hover:opacity-50"
                    }`}
                  />

                  {/* Icon */}
                  <span
                    className={`transition-colors duration-200 ${
                      active ? "text-green-700" : "text-gray-500 group-hover:text-gray-700"
                    }`}
                  >
                    {item.icon(active)}
                  </span>

                  {/* Label */}
                  <span
                    className={`text-[10px] font-medium transition-all duration-200 ${
                      active ? "text-green-700 font-bold" : "text-gray-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};