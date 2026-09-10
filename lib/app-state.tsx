"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type BasketItem = {
  communityId: string;
  communityName: string;
  logoInitial: string;
  amount: number;
};

export type SupportRecord = {
  id: string;
  communityId: string;
  communityName: string;
  logoInitial: string;
  amount: number;
  /** On-chain records start "pending" until the backend confirms them. */
  status: "pending" | "completed" | "failed";
  date: string;
  txHash: string;
};

type AppState = {
  basket: BasketItem[];
  addToBasket: (item: { communityId: string; communityName: string; logoInitial: string; amount?: number }) => void;
  removeFromBasket: (communityId: string) => void;
  updateBasketAmount: (communityId: string, amount: number) => void;
  clearBasket: () => void;
  basketTotal: number;
  supports: SupportRecord[];
  addSupports: (records: SupportRecord[]) => void;
  updateSupportStatus: (id: string, status: SupportRecord["status"]) => void;
};

const AppStateContext = createContext<AppState | null>(null);
const STORAGE_KEY = "sutu-app-state";

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [supports, setSupports] = useState<SupportRecord[]>([]);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.basket)) setBasket(parsed.basket);
        if (Array.isArray(parsed.supports)) setSupports(parsed.supports);
      }
    } catch {
      // ignore malformed storage
    } finally {
      hydrated.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ basket, supports }));
  }, [basket, supports]);

  const addToBasket: AppState["addToBasket"] = (item) => {
    setBasket((prev) => {
      if (prev.some((b) => b.communityId === item.communityId)) return prev;
      return [...prev, { amount: 5, ...item }];
    });
  };

  const removeFromBasket = (communityId: string) => {
    setBasket((prev) => prev.filter((b) => b.communityId !== communityId));
  };

  const updateBasketAmount = (communityId: string, amount: number) => {
    setBasket((prev) => prev.map((b) => (b.communityId === communityId ? { ...b, amount } : b)));
  };

  const clearBasket = () => setBasket([]);

  const addSupports = (records: SupportRecord[]) => {
    setSupports((prev) => [...records, ...prev]);
  };

  const updateSupportStatus = (id: string, status: SupportRecord["status"]) => {
    setSupports((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const basketTotal = basket.reduce((sum, item) => sum + item.amount, 0);

  return (
    <AppStateContext.Provider
      value={{
        basket,
        addToBasket,
        removeFromBasket,
        updateBasketAmount,
        clearBasket,
        basketTotal,
        supports,
        addSupports,
        updateSupportStatus,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
