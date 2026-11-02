import { useCallback, useMemo, useReducer } from "react";
import { INITIAL_CASES } from "../data/cases";
import { CaseContext, caseReducer, nextCaseId } from "./caseStore";

export default function CaseProvider({ children }) {
  const [cases, dispatch] = useReducer(caseReducer, INITIAL_CASES);

  const addCase = useCallback((payload) => dispatch({ type: "add", payload }), []);
  const updateCase = useCallback((id, patch) => dispatch({ type: "update", id, patch }), []);
  const updateSection = useCallback(
    (id, section, patch) => dispatch({ type: "section", id, section, patch }),
    []
  );

  const value = useMemo(
    () => ({ cases, addCase, updateCase, updateSection, nextId: nextCaseId(cases) }),
    [cases, addCase, updateCase, updateSection]
  );

  return <CaseContext.Provider value={value}>{children}</CaseContext.Provider>;
}
