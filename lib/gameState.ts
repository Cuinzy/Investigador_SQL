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

/** Progress tracked independently for each case */
export interface CaseProgress {
  queries: QueryRecord[];
  completedObjectives: string[];
  solved: boolean;
  culpritSelected: number | null;
  justification: string;
  startedAt: string | null;
  solvedAt: string | null;
  validationCode: string | null;
  /** How many wrong accusations have been made on this case */
  wrongAccusations: number;
  /**
   * Minimum number of valid queries required before the next accusation.
   * Starts at 15. After each wrong accusation it is set to (currentValidCount + 5),
   * so the student must investigate 5 more before trying again.
   */
  minQueriesRequired: number;
}

export interface GameState {
  investigator: Investigator | null;
  currentCase: number | null;
  /** Per-case progress, keyed by case id */
  cases: Record<number, CaseProgress>;
}

// Use v2 key to avoid conflicts with old single-case state
const STORAGE_KEY = "expediente_sql_state_v2";

export function defaultCaseProgress(): CaseProgress {
  return {
    queries: [],
    completedObjectives: [],
    solved: false,
    culpritSelected: null,
    justification: "",
    startedAt: null,
    solvedAt: null,
    validationCode: null,
    wrongAccusations: 0,
    minQueriesRequired: 15,
  };
}

export function defaultState(): GameState {
  return {
    investigator: null,
    currentCase: null,
    cases: {},
  };
}

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

export function getCaseProgress(state: GameState, caseId: number): CaseProgress {
  return state.cases[caseId] ?? defaultCaseProgress();
}

export function updateCaseProgress(
  state: GameState,
  caseId: number,
  progress: CaseProgress
): GameState {
  return {
    ...state,
    cases: { ...state.cases, [caseId]: progress },
  };
}

export function resetCase(state: GameState, caseId: number): GameState {
  const cases = { ...state.cases };
  delete cases[caseId];
  return { ...state, cases };
}
