import { createContext, useContext } from "react";

/* Store kasus lokal (mock) — satu sumber data untuk Dashboard, Daftar Kasus & Detail. */

export const CaseContext = createContext(null);

export function caseReducer(state, action) {
  switch (action.type) {
    case "add":
      return [action.payload, ...state];
    case "update":
      return state.map((c) => (c.id === action.id ? { ...c, ...action.patch } : c));
    case "section":
      return state.map((c) =>
        c.id === action.id ? { ...c, [action.section]: { ...c[action.section], ...action.patch } } : c
      );
    default:
      return state;
  }
}

/** Nomor kasus berikutnya: SL-0414, SL-0415, ... */
export function nextCaseId(cases) {
  const max = cases.reduce((m, c) => Math.max(m, parseInt(c.id.replace(/\D/g, ""), 10) || 0), 0);
  return `SL-${String(max + 1).padStart(4, "0")}`;
}

export function useCaseStore() {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error("useCaseStore harus dipakai di dalam <CaseProvider>");
  return ctx;
}

/** Ambil satu kasus + helper update per-bagian (diagnosis/action/verification/loss). */
export function useCase(id) {
  const { cases, updateCase, updateSection } = useCaseStore();
  const data = cases.find((c) => c.id === id);
  return {
    data,
    update: (patch) => updateCase(id, patch),
    section: (name) => (patch) => updateSection(id, name, patch),
  };
}
