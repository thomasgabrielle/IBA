"use client";

import { Phase, getPhaseColor, getPhaseLabel } from "@/lib/data";

interface PhaseBadgeProps {
  phase: Phase;
  size?: "sm" | "md";
  showDropdown?: boolean;
}

export default function PhaseBadge({ phase, size = "md", showDropdown = false }: PhaseBadgeProps) {
  const colorClass = getPhaseColor(phase);
  const label = getPhaseLabel(phase);
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span className={`inline-flex items-center gap-1 rounded font-medium ${colorClass} ${sizeClass}`}>
      {label}
      {showDropdown && (
        <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}
    </span>
  );
}
