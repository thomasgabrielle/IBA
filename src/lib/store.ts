"use client";

import { useState, useEffect, useCallback } from "react";
import { contributingFactors, categories, units, computeIndicativePhase, Phase } from "./data";

export interface FactorState {
  alignment: Phase;
  isKeyIndicator: boolean;
  notes: string;
}

type StoreState = Record<string, FactorState>;
// Stores manual overrides only. null = use auto-computed value.
type CategoryOverrides = Record<string, Phase | undefined>;

function storageKey(unitId: string) {
  return `ipc-iba-factors-${unitId}`;
}

function categoryStorageKey(unitId: string) {
  return `ipc-iba-categories-${unitId}`;
}

// Legacy keys for migration
const LEGACY_STORAGE_KEY = "ipc-iba-factors";
const LEGACY_CATEGORY_STORAGE_KEY = "ipc-iba-categories";

function getInitialState(unitId: string): StoreState {
  const state: StoreState = {};
  // Check if there's mock data for this unit
  const unitData = units.find((u) => u.id === unitId);

  for (const cf of contributingFactors) {
    // Use mock unit data for alignment if available, otherwise use default from contributing factor
    const mockAlignment = unitData?.factors[cf.id];
    state[cf.id] = {
      alignment: mockAlignment !== undefined ? mockAlignment : cf.alignment,
      isKeyIndicator: cf.isKeyIndicator,
      notes: "",
    };
  }
  return state;
}

function loadState(unitId: string): StoreState {
  if (typeof window === "undefined") return getInitialState(unitId);
  try {
    // Try unit-specific key first
    let saved = localStorage.getItem(storageKey(unitId));

    // Migrate legacy data for kachin-1
    if (!saved && unitId === "kachin-1") {
      saved = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        // Migrate to new key
        localStorage.setItem(storageKey(unitId), saved);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    }

    if (saved) {
      const parsed = JSON.parse(saved) as StoreState;
      // Merge with defaults to pick up any new factors
      const defaults = getInitialState(unitId);
      for (const key of Object.keys(defaults)) {
        if (!(key in parsed)) {
          parsed[key] = defaults[key];
        }
      }
      return parsed;
    }
  } catch {
    // ignore
  }
  return getInitialState(unitId);
}

export function useFactorStore(unitId: string = "kachin-1") {
  const [state, setState] = useState<StoreState>(() => getInitialState(unitId));

  useEffect(() => {
    setState(loadState(unitId));
  }, [unitId]);

  const save = useCallback((newState: StoreState) => {
    setState(newState);
    try {
      localStorage.setItem(storageKey(unitId), JSON.stringify(newState));
    } catch {
      // ignore
    }
  }, [unitId]);

  const setAlignment = useCallback((factorId: string, phase: Phase) => {
    setState((prev) => {
      const next = { ...prev, [factorId]: { ...prev[factorId], alignment: phase } };
      localStorage.setItem(storageKey(unitId), JSON.stringify(next));
      return next;
    });
  }, [unitId]);

  const toggleKeyIndicator = useCallback((factorId: string) => {
    setState((prev) => {
      const next = {
        ...prev,
        [factorId]: { ...prev[factorId], isKeyIndicator: !prev[factorId].isKeyIndicator },
      };
      localStorage.setItem(storageKey(unitId), JSON.stringify(next));
      return next;
    });
  }, [unitId]);

  const setNotes = useCallback((factorId: string, notes: string) => {
    setState((prev) => {
      const next = { ...prev, [factorId]: { ...prev[factorId], notes } };
      localStorage.setItem(storageKey(unitId), JSON.stringify(next));
      return next;
    });
  }, [unitId]);

  const getFactor = useCallback(
    (factorId: string): FactorState => {
      return state[factorId] ?? { alignment: null, isKeyIndicator: false, notes: "" };
    },
    [state]
  );

  const resetAll = useCallback(() => {
    const defaults = getInitialState(unitId);
    save(defaults);
  }, [unitId, save]);

  return { state, getFactor, setAlignment, toggleKeyIndicator, setNotes, resetAll };
}

function loadCategoryOverrides(unitId: string): CategoryOverrides {
  if (typeof window === "undefined") return {};
  try {
    // Try unit-specific key first
    let saved = localStorage.getItem(categoryStorageKey(unitId));

    // Migrate legacy data for kachin-1
    if (!saved && unitId === "kachin-1") {
      saved = localStorage.getItem(LEGACY_CATEGORY_STORAGE_KEY);
      if (saved) {
        localStorage.setItem(categoryStorageKey(unitId), saved);
        localStorage.removeItem(LEGACY_CATEGORY_STORAGE_KEY);
      }
    }

    if (saved) return JSON.parse(saved) as CategoryOverrides;
  } catch {
    // ignore
  }
  return {};
}

export interface CategoryInfo {
  phase: Phase;
  isOverridden: boolean;
  computedPhase: Phase;
  keyIndicators: { name: string; phase: Phase }[];
}

export function useCategoryStore(factorState: Record<string, FactorState>, unitId: string = "kachin-1") {
  const [overrides, setOverrides] = useState<CategoryOverrides>({});

  useEffect(() => {
    setOverrides(loadCategoryOverrides(unitId));
  }, [unitId]);

  // Compute indicative phases from key indicators
  const getCategoryInfo = useCallback(
    (categoryId: string): CategoryInfo => {
      const cat = categories.find((c) => c.id === categoryId);
      const section = cat?.section;

      // Get key indicators for this section
      const keyIndicators: { name: string; phase: Phase }[] = [];
      if (section) {
        for (const cf of contributingFactors) {
          if (cf.section === section) {
            const fs = factorState[cf.id];
            if (fs && fs.isKeyIndicator) {
              keyIndicators.push({ name: cf.name, phase: fs.alignment });
            }
          }
        }
      }

      const computedPhase = computeIndicativePhase(keyIndicators.map((ki) => ki.phase));
      const override = overrides[categoryId];
      const isOverridden = override !== undefined;
      const phase = isOverridden ? (override as Phase) : computedPhase;

      return { phase, isOverridden, computedPhase, keyIndicators };
    },
    [factorState, overrides]
  );

  const setCategoryPhase = useCallback((categoryId: string, phase: Phase) => {
    setOverrides((prev) => {
      const next = { ...prev, [categoryId]: phase };
      localStorage.setItem(categoryStorageKey(unitId), JSON.stringify(next));
      return next;
    });
  }, [unitId]);

  const clearOverride = useCallback((categoryId: string) => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[categoryId];
      localStorage.setItem(categoryStorageKey(unitId), JSON.stringify(next));
      return next;
    });
  }, [unitId]);

  return { getCategoryInfo, setCategoryPhase, clearOverride };
}
