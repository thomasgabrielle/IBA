"use client";

import { useState, useEffect, useCallback } from "react";
import { contributingFactors, Phase } from "./data";

export interface FactorState {
  alignment: Phase;
  isKeyIndicator: boolean;
  notes: string;
}

type StoreState = Record<string, FactorState>;

const STORAGE_KEY = "ipc-iba-factors";

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
