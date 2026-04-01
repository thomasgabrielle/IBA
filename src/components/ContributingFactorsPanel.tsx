"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { contributingFactors, sections, categories, alignmentOptions, ContributingFactor, DataSource, Phase } from "@/lib/data";
import { useFactorStore, FactorState } from "@/lib/store";
import PhaseBadge from "./PhaseBadge";
import DataSourceModal from "./DataSourceModal";

export default function ContributingFactorsPanel() {
  const store = useFactorStore();
  const [modalSources, setModalSources] = useState<DataSource[] | null>(null);
  const [modalIndex, setModalIndex] = useState(0);

  const groupedFactors = sections.map((section) => ({
    section,
    factors: contributingFactors.filter((f) => f.section === section),
  }));

  const openSourceModal = useCallback((sources: DataSource[], index: number) => {
    setModalSources(sources);
    setModalIndex(index);
  }, []);

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
              <div key={cat.id} className="flex-1 border border-gray-300 rounded px-3 py-2 text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
                {cat.label}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {categories.filter((c) => c.row === 1).map((cat) => (
              <div key={cat.id} className="flex-1 border border-gray-300 rounded px-3 py-2 text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
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
              <SectionGroup key={section} section={section} factors={factors} store={store} onOpenSource={openSourceModal} />
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

      {/* Data Source Modal */}
      {modalSources && (
        <DataSourceModal
          sources={modalSources}
          currentIndex={modalIndex}
          onChangeIndex={setModalIndex}
          onClose={() => setModalSources(null)}
        />
      )}
    </div>
  );
}

function AlignmentPopover({
  factor,
  currentPhase,
  onSelect,
  onClose,
}: {
  factor: ContributingFactor;
  currentPhase: Phase;
  onSelect: (phase: Phase) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const phaseOptions: { phase: Phase; label: string }[] = [
    { phase: 1, label: "Phase 1 — Minimal" },
    { phase: 2, label: "Phase 2 — Stressed" },
    { phase: 3, label: "Phase 3 — Crisis" },
    { phase: 4, label: "Phase 4 — Emergency" },
    { phase: 5, label: "Phase 5 — Famine" },
    { phase: null, label: "Not determined" },
  ];

  return (
    <div
      ref={ref}
      className="absolute z-50 top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4"
    >
      {factor.guidanceQuestion && (
        <div className="flex gap-2 mb-4 text-sm text-gray-700">
          <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{factor.guidanceQuestion}</p>
        </div>
      )}
      <div className="space-y-1">
        {alignmentOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => {
              onSelect(opt.phase);
              onClose();
            }}
            className="flex items-center gap-3 w-full text-left cursor-pointer hover:bg-gray-50 rounded px-2 py-1.5"
          >
            <div className="w-3.5 h-5 rounded-sm shrink-0" style={{ backgroundColor: opt.color }} />
            <span className="text-sm text-gray-700">{opt.label}</span>
          </button>
        ))}
      </div>
      <div className="border-t border-gray-100 mt-3 pt-3">
        <p className="text-xs text-gray-400 mb-2">Or select a phase directly:</p>
        <div className="flex gap-1.5">
          {phaseOptions.map((opt) => (
            <button
              key={String(opt.phase)}
              onClick={() => {
                onSelect(opt.phase);
                onClose();
              }}
              className={`flex-1 text-center py-1.5 text-xs font-medium rounded transition ${
                currentPhase === opt.phase
                  ? "ring-2 ring-blue-500 ring-offset-1"
                  : ""
              }`}
              style={{
                backgroundColor: opt.phase === null ? "#f3f4f6" : undefined,
              }}
            >
              {opt.phase === null ? (
                <span className="text-gray-500">—</span>
              ) : (
                <PhaseBadge phase={opt.phase} size="sm" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function EditPopover({
  notes,
  onSave,
  onClose,
}: {
  notes: string;
  onSave: (notes: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(notes);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute z-50 top-full right-0 mt-1 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-4"
    >
      <p className="text-xs font-semibold text-gray-800 mb-2">Notes / Justification</p>
      <textarea
        className="w-full border border-gray-200 rounded-lg p-2 text-sm text-gray-700 resize-y min-h-[80px] focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add notes or justification..."
        autoFocus
      />
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={onClose}
          className="px-3 py-1 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onSave(value);
            onClose();
          }}
          className="px-3 py-1 text-xs text-white bg-nav-bg rounded hover:opacity-90"
        >
          Save
        </button>
      </div>
    </div>
  );
}

function FactorRow({
  factor,
  factorState,
  onOpenSource,
  onSetAlignment,
  onToggleKey,
  onSetNotes,
}: {
  factor: ContributingFactor;
  factorState: FactorState;
  onOpenSource: (sources: DataSource[], index: number) => void;
  onSetAlignment: (phase: Phase) => void;
  onToggleKey: () => void;
  onSetNotes: (notes: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const hasSources = factor.dataSources && factor.dataSources.length > 0;

  return (
    <>
      <tr className={`border-b border-gray-100 hover:bg-gray-50/50 ${expanded ? "bg-blue-50/50" : ""}`}>
        <td
          className="px-4 py-2.5 text-gray-700 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-1">
            {hasSources && (
              <svg
                className={`w-3 h-3 text-gray-400 shrink-0 transition-transform ${expanded ? "rotate-90" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            <span>{factor.name}</span>
            {factorState.notes && (
              <svg className="w-3 h-3 text-blue-400 shrink-0 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
            )}
          </div>
        </td>
        <td className="px-4 py-2.5 relative">
          <button onClick={() => setShowPopover(!showPopover)}>
            <PhaseBadge phase={factorState.alignment} showDropdown />
          </button>
          {showPopover && (
            <AlignmentPopover
              factor={factor}
              currentPhase={factorState.alignment}
              onSelect={onSetAlignment}
              onClose={() => setShowPopover(false)}
            />
          )}
        </td>
        <td className="px-4 py-2.5 text-center">
          <button onClick={onToggleKey}>
            {factorState.isKeyIndicator ? (
              <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-500 rounded text-white">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </span>
            ) : (
              <span className="inline-block w-5 h-5 border border-gray-300 rounded hover:border-blue-400" />
            )}
          </button>
        </td>
        <td className="px-2 py-2.5 text-center relative">
          <button
            onClick={() => setShowEdit(!showEdit)}
            className={`${factorState.notes ? "text-blue-500" : "text-gray-400"} hover:text-gray-600`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          {showEdit && (
            <EditPopover
              notes={factorState.notes}
              onSave={onSetNotes}
              onClose={() => setShowEdit(false)}
            />
          )}
        </td>
      </tr>
      {expanded && hasSources && (
        <tr className="bg-blue-50/30">
          <td colSpan={4} className="px-4 pb-3 pt-1">
            <div className="pl-4">
              <p className="text-xs font-semibold text-gray-800 mb-2">Data Sources</p>
              {factor.dataSources!.map((ds, i) => (
                <button
                  key={ds.id}
                  onClick={() => onOpenSource(factor.dataSources!, i)}
                  className="flex items-center gap-2 py-1.5 text-xs text-blue-600 hover:text-blue-800 hover:underline w-full text-left"
                >
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span>{ds.name}</span>
                  <span className="text-gray-400">{ds.unit}</span>
                </button>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function SectionGroup({
  section,
  factors,
  store,
  onOpenSource,
}: {
  section: string;
  factors: ContributingFactor[];
  store: ReturnType<typeof useFactorStore>;
  onOpenSource: (sources: DataSource[], index: number) => void;
}) {
  return (
    <>
      <tr className="bg-gray-50">
        <td colSpan={4} className="px-4 py-2 font-semibold text-gray-800 text-sm">
          {section}
        </td>
      </tr>
      {factors.map((factor) => (
        <FactorRow
          key={factor.id}
          factor={factor}
          factorState={store.getFactor(factor.id)}
          onOpenSource={onOpenSource}
          onSetAlignment={(phase) => store.setAlignment(factor.id, phase)}
          onToggleKey={() => store.toggleKeyIndicator(factor.id)}
          onSetNotes={(notes) => store.setNotes(factor.id, notes)}
        />
      ))}
    </>
  );
}
