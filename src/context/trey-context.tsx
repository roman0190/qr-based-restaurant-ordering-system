"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

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
  const socketRef = useRef<Socket | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingFromSocketRef = useRef(false); // Track if update is from socket

  // Initialize Socket.IO connection
  useEffect(() => {
    if (tableNumber) {
      // Connect to Socket.IO server
      socketRef.current = io({
        path: "/api/socket",
      });

      socketRef.current.on("connect", () => {
        console.log("🔌 Socket connected:", socketRef.current?.id);
        // Join table room
        socketRef.current?.emit("join-table", tableNumber);
      });

      socketRef.current.on("disconnect", () => {
        console.log("🔌 Socket disconnected");
      });

      // Listen for trey changes from other clients
      socketRef.current.on("trey-changed", (newTrey: TreyItem[]) => {
        console.log("📦 Trey updated from another client");
        isUpdatingFromSocketRef.current = true;
        setTrey(newTrey);
        // Reset flag after state update
        setTimeout(() => {
          isUpdatingFromSocketRef.current = false;
        }, 100);
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [tableNumber]);

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

      // Emit socket event for real-time update to other clients
      if (socketRef.current?.connected) {
        socketRef.current.emit("trey-update", { tableNumber, trey });
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
    // Skip sync if update came from socket
    if (isUpdatingFromSocketRef.current) {
      return;
    }

    if (sessionId && pin && tableNumber && trey.length >= 0) {
      // Clear previous timeout
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      
      // Debounce sync to avoid too many requests
      syncTimeoutRef.current = setTimeout(() => {
        syncTrey();
      }, 1000);
      
      return () => {
        if (syncTimeoutRef.current) {
          clearTimeout(syncTimeoutRef.current);
        }
      };
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
