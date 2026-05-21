"use client";

export interface QueryRecord {
  id: string;
  sql: string;
  rowCount: number;
  timestamp: string;
  valid: boolean;
  error?: string;
}

export interface Investigator {
  name: string;
  code: string;
  group: string;
}

export interface GameState {
  investigator: Investigator | null;
  currentCase: number | null;
  queries: QueryRecord[];
  completedObjectives: string[];
  solved: boolean;
  culpritSelected: number | null;
  justification: string;
  startedAt: string | null;
  solvedAt: string | null;
  validationCode: string | null;
}

const STORAGE_KEY = "expediente_sql_state";

export function loadState(): GameState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as GameState;
  } catch {}
  return defaultState();
}

export function saveState(state: GameState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function defaultState(): GameState {
  return {
    investigator: null,
    currentCase: null,
    queries: [],
    completedObjectives: [],
    solved: false,
    culpritSelected: null,
    justification: "",
    startedAt: null,
    solvedAt: null,
    validationCode: null,
  };
}

export function resetCase(state: GameState): GameState {
  return {
    ...state,
    currentCase: null,
    queries: [],
    completedObjectives: [],
    solved: false,
    culpritSelected: null,
    justification: "",
    startedAt: null,
    solvedAt: null,
    validationCode: null,
  };
}
