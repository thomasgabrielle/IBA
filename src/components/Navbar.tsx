"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header>
      {/* Top nav */}
      <nav className="bg-nav-bg text-white px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-white rounded text-nav-bg font-bold text-xs">
            IPC
          </div>
          <span className="text-sm font-medium">
            IPC Acute Food Insecurity Analysis Platform : Myanmar
          </span>
        </div>

        <div className="bg-yellow-500 text-nav-bg text-sm font-medium px-4 py-1 rounded">
          Acute Food Insecurity Analysis – MM May 2025
        </div>

        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className={`hover:text-yellow-300 ${!isAdmin ? "text-yellow-300" : ""}`}
          >
            Analyses
          </Link>
          <Link
            href="/admin"
            className={`hover:text-yellow-300 ${isAdmin ? "text-yellow-300" : ""}`}
          >
            Administration
          </Link>
          <div className="w-8 h-8 rounded-full bg-yellow-500 text-nav-bg flex items-center justify-center font-bold text-xs">
            BC
          </div>
        </div>
      </nav>

      {/* Sub nav */}
      <div className="bg-white border-b border-gray-200 px-4 h-10 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-gray-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <span className="font-medium text-gray-700">Unit:</span>
          <select className="bg-nav-bg text-white text-sm rounded px-3 py-1 pr-8">
            <option>Kachin 1</option>
            <option>Chin 2</option>
          </select>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded border border-yellow-300">
            SPECIAL PROTOCOL
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs text-gray-500">
          <span><strong>Current:</strong> Mar 2020 – Mar 2021</span>
          <span><strong>Projected 1:</strong> Mar 2021 - Mar 2022</span>
          <span><strong>Projected 2:</strong> Mar 2022 - Mar 2023</span>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
