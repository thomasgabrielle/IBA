"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { contributingFactors, sections, categories, phaseDescriptions, ContributingFactor, DataSource, Phase } from "@/lib/data";
import { useFactorStore, useCategoryStore, FactorState, CategoryInfo } from "@/lib/store";
import PhaseBadge from "./PhaseBadge";
import DataSourceModal from "./DataSourceModal";

const phaseColorMap: Record<number, { border: string; bar: string }> = {
  1: { border: "border-[#cde6cd]", bar: "bg-[#cde6cd]" },
  2: { border: "border-[#f9e064]", bar: "bg-[#f9e064]" },
  3: { border: "border-[#e8a643]", bar: "bg-[#e8a643]" },
  4: { border: "border-[#c7422e]", bar: "bg-[#c7422e]" },
  5: { border: "border-[#6b1d1d]", bar: "bg-[#6b1d1d]" },
};

function CategoryBox({
  label,
  info,
  isSelected,
  onSelect,
}: {
  label: string;
  info: CategoryInfo;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const colors = info.phase ? phaseColorMap[info.phase] : null;
  const borderColor = colors?.border ?? "border-gray-300";
  const barColor = colors?.bar ?? "";

  return (
    <button
      onClick={onSelect}
      className={`flex-1 border rounded px-3 py-2 text-xs font-medium text-gray-700 cursor-pointer text-left relative overflow-hidden transition-all ${borderColor} ${
        isSelected ? "ring-2 ring-blue-400 bg-blue-50" : "hover:bg-gray-50"
      }`}
    >
      {info.phase && <div className={`absolute left-0 top-0 bottom-0 w-1 ${barColor}`} />}
      <div className={info.phase ? "pl-1" : ""}>
        <span>{label}</span>
        {info.isOverridden && (
          <span className="ml-1 text-[9px] text-blue-500" title="Manually overridden">●</span>
        )}
      </div>
    </button>
  );
}

const phaseBgColors: Record<number, string> = {
  1: "bg-[#cde6cd]",
  2: "bg-[#f9e064]",
  3: "bg-[#e8a643]",
  4: "bg-[#c7422e]",
  5: "bg-[#6b1d1d]",
};

const phaseTextColors: Record<number, string> = {
  1: "text-gray-900",
  2: "text-gray-900",
  3: "text-gray-900",
  4: "text-white",
  5: "text-white",
};

function CategoryPhaseSelector({
  categoryId,
  info,
  onSelectPhase,
  onClearOverride,
  onClose,
}: {
  categoryId: string;
  info: CategoryInfo;
  onSelectPhase: (phase: Phase) => void;
  onClearOverride: () => void;
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

  const catLabel = categories.find((c) => c.id === categoryId)?.label ?? categoryId;

  return (
    <div ref={ref} className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">{catLabel}</h3>
          {info.phase && <PhaseBadge phase={info.phase} size="sm" />}
          {info.isOverridden && (
            <button
              onClick={onClearOverride}
              className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap"
              title="Reset to auto-computed value"
            >
              Reset
            </button>
          )}
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Auto-computed info */}
      {info.computedPhase && (
        <div className="text-xs text-gray-500 mb-3">
          Auto-computed: <PhaseBadge phase={info.computedPhase} size="sm" />
          {info.isOverridden && <span className="ml-1">(overridden)</span>}
        </div>
      )}

      {/* Phase reference table */}
      <div className="grid grid-cols-4 gap-0 border border-gray-300 rounded-lg overflow-hidden mb-3">
        {[2, 3, 4, 5].map((p) => {
          const desc = phaseDescriptions[p];
          const isSelected = info.phase === p;
          return (
            <button
              key={p}
              onClick={() => onSelectPhase(p as Phase)}
              className={`${phaseBgColors[p]} ${phaseTextColors[p]} p-3 text-left cursor-pointer transition-all border-r border-gray-300 last:border-r-0 ${
                isSelected ? "ring-2 ring-inset ring-blue-600" : "hover:opacity-90"
              }`}
            >
              <p className="text-xs font-bold mb-1.5">{desc?.name}</p>
              <div className="text-[10px] leading-tight space-y-1">
                {desc?.description.map((line, i) => (
                  <p key={i}>{i > 0 ? `• ${line}` : line}</p>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Phase 1 option */}
      <button
        onClick={() => onSelectPhase(1 as Phase)}
        className={`w-full ${phaseBgColors[1]} ${phaseTextColors[1]} p-2 rounded-lg text-left cursor-pointer transition-all mb-3 ${
          info.phase === 1 ? "ring-2 ring-blue-600" : "hover:opacity-90"
        }`}
      >
        <p className="text-xs font-bold">{phaseDescriptions[1]?.name}</p>
        <p className="text-[10px] leading-tight mt-0.5">{phaseDescriptions[1]?.description[0]}</p>
      </button>

      {/* Clear selection */}
      {info.phase !== null && (
        <button
          onClick={() => onSelectPhase(null)}
          className="text-xs text-gray-500 hover:text-gray-700 mb-3"
        >
          Clear selection
        </button>
      )}

      {/* Key indicators */}
      {info.keyIndicators.length > 0 && (
        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs font-semibold text-gray-700 mb-2">
            Key Indicators ({info.keyIndicators.length})
          </p>
          <div className="space-y-1.5">
            {info.keyIndicators.map((ki, i) => (
              <div key={i} className="flex items-center justify-between gap-2 text-xs">
                <span className="text-gray-600 truncate">{ki.name}</span>
                <PhaseBadge phase={ki.phase} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}
      {info.keyIndicators.length === 0 && (
        <div className="text-xs text-gray-400 italic">
          No key indicators selected for this section. Check the key indicator boxes below to auto-compute.
        </div>
      )}
    </div>
  );
}

export default function ContributingFactorsPanel() {
  const store = useFactorStore();
  const catStore = useCategoryStore(store.state);
  const [modalSources, setModalSources] = useState<DataSource[] | null>(null);
  const [modalIndex, setModalIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const groupedFactors = sections.map((section) => ({
    section,
    factors: contributingFactors.filter((f) => f.section === section),
  }));

  const openSourceModal = useCallback((sources: DataSource[], index: number) => {
    setModalSources(sources);
    setModalIndex(index);
  }, []);

  const toggleCategory = (catId: string) => {
    setSelectedCategory((prev) => (prev === catId ? null : catId));
  };

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
              <CategoryBox
                key={cat.id}
                label={cat.label}
                info={catStore.getCategoryInfo(cat.id)}
                isSelected={selectedCategory === cat.id}
                onSelect={() => toggleCategory(cat.id)}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {categories.filter((c) => c.row === 1).map((cat) => (
              <CategoryBox
                key={cat.id}
                label={cat.label}
                info={catStore.getCategoryInfo(cat.id)}
                isSelected={selectedCategory === cat.id}
                onSelect={() => toggleCategory(cat.id)}
              />
            ))}
          </div>
        </div>

        {/* Phase selector for selected category */}
        {selectedCategory && (
          <CategoryPhaseSelector
            categoryId={selectedCategory}
            info={catStore.getCategoryInfo(selectedCategory)}
            onSelectPhase={(phase) => catStore.setCategoryPhase(selectedCategory, phase)}
            onClearOverride={() => catStore.clearOverride(selectedCategory)}
            onClose={() => setSelectedCategory(null)}
          />
        )}
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

  const options = factor.phaseOptions && factor.phaseOptions.length > 0
    ? factor.phaseOptions
    : [
        { phase: 2 as Phase, label: "Phase 2" },
        { phase: 3 as Phase, label: "Phase 3" },
        { phase: 4 as Phase, label: "Phase 4" },
        { phase: 5 as Phase, label: "Phase 5" },
      ];

  const phaseColors: Record<number, string> = {
    2: "#f9e064", 3: "#e8a643", 4: "#c7422e", 5: "#6b1d1d",
  };

  return (
    <div
      ref={ref}
      className="absolute z-50 top-full left-0 mt-1 w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-4"
    >
      {factor.guidanceQuestion && (
        <div className="flex gap-2 mb-4 text-sm text-gray-700">
          <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{factor.guidanceQuestion}</p>
        </div>
      )}
      <div className="space-y-1.5">
        {options.map((opt) => (
          <button
            key={String(opt.phase)}
            onClick={() => {
              onSelect(opt.phase);
              onClose();
            }}
            className={`flex items-center gap-3 w-full text-left cursor-pointer rounded px-2 py-2 transition ${
              currentPhase === opt.phase ? "bg-blue-50 ring-1 ring-blue-300" : "hover:bg-gray-50"
            }`}
          >
            <div
              className="w-3.5 h-5 rounded-sm shrink-0"
              style={{ backgroundColor: opt.phase ? phaseColors[opt.phase] || "#d1d5db" : "#d1d5db" }}
            />
            <span className="text-sm text-gray-700">{opt.label}</span>
          </button>
        ))}
        <button
          onClick={() => {
            onSelect(null);
            onClose();
          }}
          className={`flex items-center gap-3 w-full text-left cursor-pointer rounded px-2 py-2 transition ${
            currentPhase === null ? "bg-blue-50 ring-1 ring-blue-300" : "hover:bg-gray-50"
          }`}
        >
          <div className="w-3.5 h-5 rounded-sm shrink-0 bg-gray-200" />
          <span className="text-sm text-gray-500">Not determined</span>
        </button>
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
  const hasSourceNames = factor.dataSourceNames && factor.dataSourceNames.length > 0;
  const hasAnalysis = !!factor.analysisText;
  const isExpandable = hasSourceNames || hasAnalysis;

  return (
    <>
      <tr className={`border-b border-gray-100 hover:bg-gray-50/50 ${expanded ? "bg-blue-50/50" : ""}`}>
        <td
          className="px-4 py-2.5 text-gray-700 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-1">
            {isExpandable && (
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
      {expanded && isExpandable && (
        <tr className="bg-blue-50/30">
          <td colSpan={4} className="px-4 pb-3 pt-1">
            <div className="pl-4">
              {hasSourceNames && (
                <>
                  <p className="text-xs font-semibold text-gray-800 mb-2">Data Sources</p>
                  {factor.dataSourceNames!.map((name, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 py-1.5 text-xs text-blue-600"
                    >
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span>{name}</span>
                    </div>
                  ))}
                </>
              )}
              {hasAnalysis && (
                <div className="mt-2">
                  <p className="text-xs font-semibold text-gray-800 mb-1">Analysis</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{factor.analysisText}</p>
                </div>
              )}
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
