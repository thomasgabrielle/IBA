"use client";

import { contributingFactors, sections, categories } from "@/lib/data";
import PhaseBadge from "./PhaseBadge";

export default function ContributingFactorsPanel() {
  const groupedFactors = sections.map((section) => ({
    section,
    factors: contributingFactors.filter((f) => f.section === section),
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <h2 className="text-base font-semibold text-gray-900">Current Analysis: May 2025</h2>
          </div>
          <a href="/awla" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            View AWLA matrix
          </a>
        </div>

        {/* Category boxes */}
        <div className="space-y-2">
          <div className="flex gap-2">
            {categories.filter((c) => c.row === 0).map((cat) => (
              <div
                key={cat.id}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
              >
                {cat.label}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {categories.filter((c) => c.row === 1).map((cat) => (
              <div
                key={cat.id}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
              >
                {cat.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-2 font-medium text-gray-600 w-[55%]">Contributing Factor</th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">Alignment</th>
              <th className="text-center px-4 py-2 font-medium text-gray-600">Key Indicators</th>
              <th className="text-center px-2 py-2 font-medium text-gray-600 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {groupedFactors.map(({ section, factors }) => (
              <SectionGroup key={section} section={section} factors={factors} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Projected section */}
      <div className="border-t border-gray-200 px-4 py-3 flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-semibold">Projected 1 Analysis: Mar 2022</span>
      </div>
    </div>
  );
}

function SectionGroup({
  section,
  factors,
}: {
  section: string;
  factors: typeof contributingFactors;
}) {
  return (
    <>
      <tr className="bg-gray-50">
        <td colSpan={4} className="px-4 py-2 font-semibold text-gray-800 text-sm">
          {section}
        </td>
      </tr>
      {factors.map((factor) => (
        <tr key={factor.id} className="border-b border-gray-100 hover:bg-gray-50/50">
          <td className="px-4 py-2.5 text-gray-700">{factor.name}</td>
          <td className="px-4 py-2.5">
            <PhaseBadge phase={factor.alignment} showDropdown />
          </td>
          <td className="px-4 py-2.5 text-center">
            {factor.isKeyIndicator ? (
              <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-500 rounded text-white">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </span>
            ) : (
              <span className="inline-block w-5 h-5 border border-gray-300 rounded" />
            )}
          </td>
          <td className="px-2 py-2.5 text-center">
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}
