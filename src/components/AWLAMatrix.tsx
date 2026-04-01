"use client";

import { useState } from "react";
import Link from "next/link";
import { contributingFactors, sections, categories, units, getPhaseColor, getPhaseLabel, Phase } from "@/lib/data";
import { useFactorStore, useCategoryStore } from "@/lib/store";

function PhaseCell({ phase }: { phase: Phase | "na" | "inadequate" }) {
  if (phase === "na" || phase === null) {
    return <td className="px-3 py-2 text-center text-xs text-gray-400">Not applicable</td>;
  }
  if (phase === "inadequate") {
    return (
      <td className="px-3 py-2 text-center">
        <span className="inline-block px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
          Inadequate evidence
        </span>
      </td>
    );
  }
  const colorClass = getPhaseColor(phase);
  return (
    <td className="px-3 py-2 text-center">
      <span className={`inline-block px-3 py-0.5 rounded text-xs font-medium ${colorClass}`}>
        {getPhaseLabel(phase)}
      </span>
    </td>
  );
}

export default function AWLAMatrix() {
  const [search, setSearch] = useState("");

  // Load stores for each unit
  const kachin1Store = useFactorStore("kachin-1");
  const kachin1CatStore = useCategoryStore(kachin1Store.state, "kachin-1");
  const chin2Store = useFactorStore("chin-2");
  const chin2CatStore = useCategoryStore(chin2Store.state, "chin-2");

  const unitStores: Record<string, { store: ReturnType<typeof useFactorStore>; catStore: ReturnType<typeof useCategoryStore> }> = {
    "kachin-1": { store: kachin1Store, catStore: kachin1CatStore },
    "chin-2": { store: chin2Store, catStore: chin2CatStore },
  };

  const filteredSections = sections.map((section) => {
    const factors = contributingFactors
      .filter((f) => f.section === section)
      .filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
    return { section, factors };
  }).filter(({ factors }) => factors.length > 0 || search === "");

  const getUnitPhase = (unitId: string, factorId: string): Phase | "na" | "inadequate" => {
    const unitStore = unitStores[unitId];
    if (!unitStore) return "na";
    const fs = unitStore.store.state[factorId];
    if (!fs) return "na";
    return fs.alignment ?? "na";
  };

  const getSectionPhase = (unitId: string, section: string): Phase | null => {
    const unitStore = unitStores[unitId];
    if (!unitStore) return null;
    const cat = categories.find((c) => c.section === section);
    if (!cat) return null;
    const info = unitStore.catStore.getCategoryInfo(cat.id);
    return info.phase;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 pb-4">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Contributing Factors - AWLA</h1>
        <div className="relative">
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
          />
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-2 font-medium text-blue-600 w-[50%]">Key Indicators</th>
              {units.map((unit) => (
                <th key={unit.id} className="text-center px-4 py-2 font-medium text-gray-700">
                  <Link
                    href={`/?unit=${unit.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {unit.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredSections.map(({ section, factors }) => (
              <AWLASection
                key={section}
                section={section}
                factors={factors}
                getUnitPhase={getUnitPhase}
                getSectionPhase={getSectionPhase}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AWLASection({
  section,
  factors,
  getUnitPhase,
  getSectionPhase,
}: {
  section: string;
  factors: typeof contributingFactors;
  getUnitPhase: (unitId: string, factorId: string) => Phase | "na" | "inadequate";
  getSectionPhase: (unitId: string, section: string) => Phase | null;
}) {
  return (
    <>
      <tr className="bg-gray-50 border-b border-gray-200">
        <td className="px-6 py-2 font-semibold text-gray-800 relative">
          <div className="flex items-center gap-2">
            {section}
          </div>
        </td>
        {units.map((unit) => {
          const phase = getSectionPhase(unit.id, section);
          return (
            <td key={unit.id} className="px-3 py-2 text-center">
              {phase && (
                <div className="flex items-center justify-center gap-2">
                  <div
                    className="w-16 h-2 rounded"
                    style={{
                      backgroundColor:
                        phase === 1 ? "#cde6cd" :
                        phase === 2 ? "#f9e064" :
                        phase === 3 ? "#e8a643" :
                        phase === 4 ? "#c7422e" :
                        "#6b1d1d",
                    }}
                  />
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getPhaseColor(phase)}`}>
                    Phase {phase}
                  </span>
                </div>
              )}
            </td>
          );
        })}
      </tr>
      {factors.map((factor) => (
        <tr key={factor.id} className="border-b border-gray-100 hover:bg-gray-50/50">
          <td className="px-6 py-2.5 text-gray-700 pl-10">{factor.name}</td>
          {units.map((unit) => (
            <PhaseCell key={unit.id} phase={getUnitPhase(unit.id, factor.id)} />
          ))}
        </tr>
      ))}
    </>
  );
}
