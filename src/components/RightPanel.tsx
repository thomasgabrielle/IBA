"use client";

import { useState } from "react";
import {
  humanitarianAssistance,
  classificationResults,
  analysisSummaryText,
  riskFactors,
  populationEstimates,
} from "@/lib/data";
import PhaseBadge from "./PhaseBadge";

function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center gap-2 text-left font-semibold text-gray-900 text-sm hover:bg-gray-50"
      >
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {title}
      </button>
      {open && <div className="border-t border-gray-100">{children}</div>}
    </div>
  );
}

function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}) {
  return (
    <div className="flex gap-1 mb-3">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-3 py-1 text-xs font-medium rounded ${
            active === tab
              ? "bg-nav-bg text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function HumanitarianFoodAssistance() {
  return (
    <CollapsibleSection title="Humanitarian Food Assistance">
      <div className="overflow-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-2 font-medium text-gray-600">Period</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">% pop</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">% kcal</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Issues</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Significance</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {humanitarianAssistance.map((row) => (
              <tr key={row.period} className="border-b border-gray-100">
                <td className="px-4 py-2 text-gray-700">{row.period}</td>
                <td className="px-3 py-2 text-gray-700">{row.popPercent}</td>
                <td className="px-3 py-2 text-gray-700">{row.kcalPercent}</td>
                <td className="px-3 py-2 text-gray-700">{row.issues}</td>
                <td className="px-3 py-2 text-gray-700">{row.significance}</td>
                <td className="px-2 py-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CollapsibleSection>
  );
}

function ClassificationResults() {
  return (
    <CollapsibleSection title="Classification Results">
      <div className="p-4">
        <p className="text-sm font-semibold text-gray-900 mb-1">Estimated Area Population</p>
        <div className="flex gap-6 text-xs text-gray-600 mb-4">
          <span>Current: <strong>{populationEstimates.current.toLocaleString()}</strong></span>
          <span>Projected 1: <strong>{populationEstimates.projected1.toLocaleString()}</strong></span>
          <span>Projected 2: <strong>{populationEstimates.projected2.toLocaleString()}</strong></span>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-3 py-2 font-medium text-gray-600">Indicator</th>
                <th className="text-center px-2 py-2 font-medium text-gray-600">Trend</th>
                <th className="text-center px-2 py-2 font-medium text-ipc-1-text bg-ipc-1 rounded-tl">P1</th>
                <th className="text-center px-2 py-2 font-medium text-ipc-2-text bg-ipc-2">P2</th>
                <th className="text-center px-2 py-2 font-medium text-ipc-3-text bg-ipc-3">P3</th>
                <th className="text-center px-2 py-2 font-medium text-ipc-4-text bg-ipc-4">P4</th>
                <th className="text-center px-2 py-2 font-medium text-ipc-5-text bg-ipc-5">P5</th>
                <th className="text-center px-2 py-2 font-medium text-gray-600">P3+</th>
              </tr>
            </thead>
            <tbody>
              {classificationResults.map((row) => (
                <tr key={row.id} className="border-b border-gray-100">
                  <td className="px-3 py-2 text-gray-700 flex items-center gap-2">
                    <PhaseBadge phase={row.number as 1 | 2 | 3 | 4 | 5} size="sm" />
                    {row.indicator}
                  </td>
                  <td className="px-2 py-2 text-center">
                    {row.trend === "down" && (
                      <svg className="w-4 h-4 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </td>
                  <td className="px-2 py-2 text-center text-gray-600">{row.p1}</td>
                  <td className="px-2 py-2 text-center text-gray-600">{row.p2}</td>
                  <td className="px-2 py-2 text-center text-gray-600">{row.p3}</td>
                  <td className="px-2 py-2 text-center text-gray-600">{row.p4}</td>
                  <td className="px-2 py-2 text-center text-gray-600">{row.p5}</td>
                  <td className="px-2 py-2 text-center text-gray-600">{row.p3plus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CollapsibleSection>
  );
}

function ClassificationJustification() {
  const [activeTab, setActiveTab] = useState("Current");
  return (
    <CollapsibleSection title="Classification Justification">
      <div className="p-4">
        <TabBar tabs={["Current", "Projected 1", "Projected 2"]} active={activeTab} onChange={setActiveTab} />
        <textarea
          className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 resize-y min-h-[80px] focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
          placeholder="Enter text..."
        />
      </div>
    </CollapsibleSection>
  );
}

function AnalysisSummary() {
  const [activeTab, setActiveTab] = useState("Projected 1");
  const [expanded, setExpanded] = useState(false);
  return (
    <CollapsibleSection title="Analysis Summary">
      <div className="p-4">
        <TabBar tabs={["Current", "Projected 1", "Projected 2"]} active={activeTab} onChange={setActiveTab} />
        <div className="text-sm text-gray-700">
          <p className="font-semibold mb-1">HUMANITARIAN FOOD SECURITY ASSISTANCE</p>
          <p className={expanded ? "" : "line-clamp-4"}>
            {analysisSummaryText.split("\n").slice(1).join(" ")}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 text-sm mt-2 hover:underline"
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        </div>
      </div>
    </CollapsibleSection>
  );
}

function EvidenceLevel() {
  return (
    <CollapsibleSection title="Evidence Level of Analysis">
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {["Current", "Projected 1", "Projected 2"].map((period, i) => (
            <div key={period} className="text-center">
              <p className="text-xs text-gray-500 mb-1">{period}</p>
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${star <= (i === 0 ? 3 : i === 1 ? 2 : 2) ? "text-yellow-400" : "text-gray-200"}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
                <button className="ml-1 text-gray-400 hover:text-gray-600">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 pt-3">
          <p className="text-sm font-semibold text-gray-900 mb-1">Humanitarian Access</p>
          <div className="flex items-start gap-2">
            <div className="mt-0.5 w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 shadow" />
            </div>
            <p className="text-xs text-gray-600">
              Area has limited or no humanitarian access but there is at least minimum evidence for classification.
            </p>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
}

function RiskFactorsSection() {
  return (
    <CollapsibleSection title="Risk Factors">
      <div className="p-4">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-2 py-2 font-medium text-gray-600">Risk Factors to Monitor</th>
              <th className="text-center px-2 py-2 font-medium text-gray-600">Projected 1</th>
              <th className="text-center px-2 py-2 font-medium text-gray-600">Projected 2</th>
            </tr>
          </thead>
          <tbody>
            {riskFactors.map((rf) => (
              <tr key={rf.id} className="border-b border-gray-100">
                <td className="px-2 py-2 text-gray-700 flex items-center gap-2">
                  <span className="text-gray-400">—</span>
                  {rf.name}
                </td>
                <td className="px-2 py-2 text-center">
                  <Toggle enabled={rf.projected1} />
                </td>
                <td className="px-2 py-2 text-center">
                  <Toggle enabled={rf.projected2} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3">
          <input
            type="text"
            placeholder="Add a risk factor..."
            className="w-full border border-gray-200 rounded px-3 py-2 text-xs text-gray-700 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
          />
        </div>
      </div>
    </CollapsibleSection>
  );
}

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <div
      className={`inline-block w-9 h-5 rounded-full relative cursor-pointer ${
        enabled ? "bg-nav-bg" : "bg-gray-200"
      }`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition-all ${
          enabled ? "left-[18px]" : "left-0.5"
        }`}
      />
    </div>
  );
}

export default function RightPanel() {
  return (
    <div className="space-y-4">
      <CollapsibleSection title="Summary Table for Direct Evidence" defaultOpen={false}>
        <div className="p-4 text-xs text-gray-500">Summary table content...</div>
      </CollapsibleSection>
      <HumanitarianFoodAssistance />
      <ClassificationResults />
      <ClassificationJustification />
      <AnalysisSummary />
      <EvidenceLevel />
      <RiskFactorsSection />
    </div>
  );
}
