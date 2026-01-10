"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface TreyItem {
  itemName: string;
  price: number;
  quentity: number;
  isConfrim: boolean;
  imageUrl?: string;
}

interface TreyContextType {
  trey: TreyItem[];
  addToTrey: (item: Omit<TreyItem, "quentity" | "isConfrim">) => void;
  removeFromTrey: (itemName: string) => void;
  updateQuantity: (itemName: string, quentity: number) => void;
  confirmItem: (itemName: string) => void;
  clearTrey: () => void;
  totalPrice: number;
  totalItems: number;
  syncTrey: () => Promise<void>;
  sessionId: string | null;
  pin: string | null;
  tableNumber: string | null;
  setSessionInfo: (sessionId: string, pin: string, tableNumber: string) => void;
  clearSession: () => void;
}

const TreyContext = createContext<TreyContextType | undefined>(undefined);

export function TreyProvider({ children }: { children: React.ReactNode }) {
  const [trey, setTrey] = useState<TreyItem[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [pin, setPin] = useState<string | null>(null);
  const [tableNumber, setTableNumber] = useState<string | null>(null);

  // Load session from sessionStorage on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get("table");
    if (table) {
      const savedSession = sessionStorage.getItem(`table_${table}_session`);
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          setSessionId(parsed.sessionId);
          setPin(parsed.pin);
          setTableNumber(table);
        } catch (error) {
          console.error("Failed to parse saved session:", error);
        }
      }
    }
  }, []);

  // Load trey from API when session is available
  useEffect(() => {
    if (sessionId && pin && tableNumber) {
      loadTrey();
    }
  }, [sessionId, pin, tableNumber]);

  const loadTrey = async () => {
    if (!tableNumber || !pin) return;

    try {
      const response = await fetch(
        `/api/public/tables/session?table=${tableNumber}&pin=${pin}`
      );
      const data = await response.json();

      if (response.ok && data.session) {
        setTrey(data.session.trey || []);
      } else if (response.status === 404 || response.status === 401) {
        // Session not found or invalid PIN - clear and reset
        console.warn("Session not found or invalid, clearing local data");
        clearSession();
      }
    } catch (error) {
      console.error("Failed to load trey:", error);
    }
  };

  const syncTrey = async () => {
    if (!tableNumber || !pin) return;

    try {
      const response = await fetch(`/api/public/tables/session`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNumber, pin, trey }),
      });

      if (!response.ok) {
        throw new Error("Failed to sync trey");
      }
    } catch (error) {
      console.error("Failed to sync trey:", error);
      throw error;
    }
  };

  const addToTrey = (item: Omit<TreyItem, "quentity" | "isConfrim">) => {
    setTrey((prev) => {
      const existing = prev.find((i) => i.itemName === item.itemName);
      if (existing) {
        return prev.map((i) =>
          i.itemName === item.itemName ? { ...i, quentity: i.quentity + 1 } : i
        );
      }
      return [...prev, { ...item, quentity: 1, isConfrim: false }];
    });
  };

  const removeFromTrey = (itemName: string) => {
    setTrey((prev) => prev.filter((i) => i.itemName !== itemName));
  };

  const updateQuantity = (itemName: string, quentity: number) => {
    if (quentity <= 0) {
      removeFromTrey(itemName);
      return;
    }
    setTrey((prev) =>
      prev.map((i) => (i.itemName === itemName ? { ...i, quentity } : i))
    );
  };

  const confirmItem = (itemName: string) => {
    setTrey((prev) =>
      prev.map((i) => (i.itemName === itemName ? { ...i, isConfrim: true } : i))
    );
  };

  const clearTrey = () => {
    setTrey([]);
  };

  const totalPrice = trey.reduce(
    (sum, item) => sum + item.price * item.quentity,
    0
  );
  const totalItems = trey.reduce((sum, item) => sum + item.quentity, 0);

  const setSessionInfo = (
    newSessionId: string,
    newPin: string,
    newTableNumber: string
  ) => {
    setSessionId(newSessionId);
    setPin(newPin);
    setTableNumber(newTableNumber);

    // Save to sessionStorage
    sessionStorage.setItem(
      `table_${newTableNumber}_session`,
      JSON.stringify({ sessionId: newSessionId, pin: newPin })
    );
  };

  const clearSession = () => {
    // Clear all session data
    if (tableNumber) {
      sessionStorage.removeItem(`table_${tableNumber}_session`);
    }
    setSessionId(null);
    setPin(null);
    setTableNumber(null);
    setTrey([]);
  };

  // Auto-sync trey when it changes
  useEffect(() => {
    if (sessionId && pin && tableNumber && trey.length >= 0) {
      const timeoutId = setTimeout(() => {
        syncTrey();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [trey, sessionId, pin, tableNumber]);

  return (
    <TreyContext.Provider
      value={{
        trey,
        addToTrey,
        removeFromTrey,
        updateQuantity,
        confirmItem,
        clearTrey,
        totalPrice,
        totalItems,
        syncTrey,
        sessionId,
        pin,
        tableNumber,
        setSessionInfo,
        clearSession,
      }}
    >
      {children}
    </TreyContext.Provider>
  );
}

export function useTrey() {
  const context = useContext(TreyContext);
  if (context === undefined) {
    throw new Error("useTrey must be used within a TreyProvider");
  }
  return context;
}
