"use client";

import { useState, useEffect, useCallback } from "react";
import { contributingFactors, categories, computeIndicativePhase, Phase } from "./data";

export interface FactorState {
  alignment: Phase;
  isKeyIndicator: boolean;
  notes: string;
}

type StoreState = Record<string, FactorState>;
// Stores manual overrides only. null = use auto-computed value.
type CategoryOverrides = Record<string, Phase | undefined>;

const STORAGE_KEY = "ipc-iba-factors";
const CATEGORY_STORAGE_KEY = "ipc-iba-categories";

function getInitialState(): StoreState {
  const state: StoreState = {};
  for (const cf of contributingFactors) {
    state[cf.id] = {
      alignment: cf.alignment,
      isKeyIndicator: cf.isKeyIndicator,
      notes: "",
    };
  }
  return state;
}

function loadState(): StoreState {
  if (typeof window === "undefined") return getInitialState();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as StoreState;
      // Merge with defaults to pick up any new factors
      const defaults = getInitialState();
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
  return getInitialState();
}

export function useFactorStore() {
  const [state, setState] = useState<StoreState>(getInitialState);

  useEffect(() => {
    setState(loadState());
  }, []);

  const save = useCallback((newState: StoreState) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch {
      // ignore
    }
  }, []);

  const setAlignment = useCallback((factorId: string, phase: Phase) => {
    setState((prev) => {
      const next = { ...prev, [factorId]: { ...prev[factorId], alignment: phase } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleKeyIndicator = useCallback((factorId: string) => {
    setState((prev) => {
      const next = {
        ...prev,
        [factorId]: { ...prev[factorId], isKeyIndicator: !prev[factorId].isKeyIndicator },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const setNotes = useCallback((factorId: string, notes: string) => {
    setState((prev) => {
      const next = { ...prev, [factorId]: { ...prev[factorId], notes } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getFactor = useCallback(
    (factorId: string): FactorState => {
      return state[factorId] ?? { alignment: null, isKeyIndicator: false, notes: "" };
    },
    [state]
  );

  const resetAll = useCallback(() => {
    const defaults = getInitialState();
    save(defaults);
  }, [save]);

  return { state, getFactor, setAlignment, toggleKeyIndicator, setNotes, resetAll };
}

function loadCategoryOverrides(): CategoryOverrides {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(CATEGORY_STORAGE_KEY);
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

export function useCategoryStore(factorState: Record<string, FactorState>) {
  const [overrides, setOverrides] = useState<CategoryOverrides>({});

  useEffect(() => {
    setOverrides(loadCategoryOverrides());
  }, []);

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
      localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearOverride = useCallback((categoryId: string) => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[categoryId];
      localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { getCategoryInfo, setCategoryPhase, clearOverride };
}
