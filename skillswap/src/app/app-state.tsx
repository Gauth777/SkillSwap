"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type LedgerItem = {
  id: string;
  title: string;
  delta: number;
  date: string;
  note: string;
};

type AppState = {
  karmaBalance: number;
  setKarmaBalance: (n: number | ((prev: number) => number)) => void;
  ledger: LedgerItem[];
  setLedger: (l: LedgerItem[] | ((prev: LedgerItem[]) => LedgerItem[])) => void;
};

const AppStateContext = createContext<AppState | null>(null);

const STORAGE_KEY = "skillswap_state_v1";

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [karmaBalance, setKarmaBalance] = useState(8);
  const [ledger, setLedger] = useState<LedgerItem[]>([]);

  // Load once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { karmaBalance?: number; ledger?: LedgerItem[] };
      if (typeof parsed.karmaBalance === "number") setKarmaBalance(parsed.karmaBalance);
      if (Array.isArray(parsed.ledger)) setLedger(parsed.ledger);
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ karmaBalance, ledger }));
    } catch {}
  }, [karmaBalance, ledger]);

  const value = useMemo(
    () => ({ karmaBalance, setKarmaBalance, ledger, setLedger }),
    [karmaBalance, ledger]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used inside <AppStateProvider />");
  return ctx;
}
