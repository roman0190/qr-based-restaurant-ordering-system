"use client";

import { useState, useMemo, useEffect } from "react";
import { useItems } from "@/hooks/use-items";
import { Search, Sparkles, ShoppingBag } from "lucide-react";
import BentoFilter from "@/components/public/landing/bento-filter";
import ItemCardPublic from "@/components/public/landing/item-card-public";
import { useSearchParams } from "next/navigation";
import SessionModal from "@/components/public/order/session-modal";
import TreyDrawer from "@/components/public/order/trey-drawer";
import { useTrey } from "@/context/trey-context";

export default function PublicMenuPage() {
  const searchParams = useSearchParams();
  const tableNo = searchParams.get("table");
  const { items, loading } = useItems();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionMode, setSessionMode] = useState<"create" | "validate">(
    "create"
  );
  const [showTreyDrawer, setShowTreyDrawer] = useState(false);
  const { totalPrice, totalItems, sessionId, setSessionInfo } = useTrey();

  useEffect(() => {
    if (tableNo) {
      const savedSession = localStorage.getItem(`table_${tableNo}_session`);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        setSessionInfo(parsed.sessionId, parsed.pin, tableNo);
      } else {
        // Check table status
        checkTableStatus(tableNo);
      }
    }
  }, [tableNo]);

  const checkTableStatus = async (tableNumber: string) => {
    try {
      const response = await fetch(`/api/public/tables?table=${tableNumber}`);
      const data = await response.json();

      if (response.ok && data.table) {
        // If table is occupied, require PIN validation
        if (data.table.status === "occupied") {
          setSessionMode("validate");
        } else {
          // If table is available, allow creating new session
          setSessionMode("create");
        }
        setShowSessionModal(true);
      }
    } catch (error) {
      console.error("Failed to check table status:", error);
      // Default to create mode if check fails
      setSessionMode("create");
      setShowSessionModal(true);
    }
  };

  const handleSessionCreated = (newSessionId: string, pin: string) => {
    if (tableNo) {
      setSessionInfo(newSessionId, pin, tableNo);
    }
  };

  const categories = useMemo(() => {
    const available = items.filter((i) => i.available !== false);
    const cats = available.map((item) => item.category).filter(Boolean);
    return ["All", ...Array.from(new Set(cats))];
  }, [items]);

  const groupedItems = useMemo(() => {
    const availableItems = items.filter(
      (item) =>
        item.available !== false &&
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const catsToDisplay =
      activeCategory === "All"
        ? categories.filter((c) => c !== "All")
        : [activeCategory];

    const groups: Record<string, any[]> = {};
    catsToDisplay.forEach((cat) => {
      const itemsInCat = availableItems.filter((item) => item.category === cat);
      if (itemsInCat.length > 0) groups[cat as string] = itemsInCat;
    });
    return groups;
  }, [items, searchQuery, activeCategory, categories]);

  return (
    <div className="pb-32">
      {/* 1. Dynamic Promo Banner */}
      <section className="px-6 pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-40 md:h-64 w-full bg-slate-900 rounded-[40px] overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-r from-indigo-900/50 to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070"
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
              alt="Promotion"
            />
            <div className="relative z-20 h-full flex flex-col justify-center p-8 md:p-12 space-y-2">
              <span className="bg-indigo-500 text-white text-[9px] font-black px-3 py-1 rounded-full w-fit uppercase tracking-widest">
                Limited Offer
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                Cheese <span className="text-indigo-400">Paradise</span>
              </h2>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                Order your first Pizza & get 15% off
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Search Bar (Minimalist) */}
      <section className="px-6 mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="relative max-w-xl group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search your favorite treat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-3xl py-4 pl-14 pr-6 text-sm shadow-sm focus:ring-4 focus:ring-indigo-50 transition-all font-bold placeholder:text-slate-200 outline-none"
            />
          </div>
        </div>
      </section>

      {/* 3. The New Bento Filter */}
      <BentoFilter
        categories={categories as string[]}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* 4. Categorized Items Grid */}
      <main className="max-w-7xl mx-auto px-6 mt-16 space-y-20">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4 text-slate-300 animate-pulse">
            <div className="h-10 w-10 border-4 border-indigo-50 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Syncing Kitchen...
            </span>
          </div>
        ) : (
          Object.entries(groupedItems).map(([catName, items]) => (
            <section key={catName} className="space-y-10">
              {/* Cute Divider Header */}
              <div className="flex items-center gap-4 px-1">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight lowercase first-letter:uppercase">
                  {catName}
                </h2>
                <div className="flex-1 h-px bg-slate-100" />
                <Sparkles className="h-4 w-4 text-amber-300" />
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16 justify-items-center">
                {items.map((item) => (
                  <ItemCardPublic key={item._id} item={item} />
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      {/* 5. Floating Tray Footer */}
      {sessionId && totalItems > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full px-6 max-w-md">
          <button
            onClick={() => setShowTreyDrawer(true)}
            className="w-full bg-slate-900 text-white h-16 rounded-full shadow-2xl flex items-center justify-between px-8 border border-white/10 hover:bg-indigo-600 transition-all duration-300 active:scale-95 group"
          >
            <div className="flex flex-col items-start leading-none">
              <span className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-1">
                Items in Tray for{" "}
                <span className="text-blue-600 font-stretch-105% text-lg">
                  Table {tableNo}
                </span>
              </span>
              <span className="text-sm font-black tracking-tight uppercase">
                View Order ({totalItems})
              </span>
            </div>
            <div className="h-8 w-px bg-white/10 mx-4" />
            <span className="text-xl font-black tracking-tighter">
              ৳{totalPrice}
            </span>
          </button>
        </div>
      )}

      {/* Session Modal */}
      {tableNo && (
        <SessionModal
          open={showSessionModal}
          onOpenChange={setShowSessionModal}
          tableNumber={tableNo}
          onSessionCreated={handleSessionCreated}
          mode={sessionMode}
        />
      )}

      {/* Trey Drawer */}
      <TreyDrawer open={showTreyDrawer} onOpenChange={setShowTreyDrawer} />
    </div>
  );
}
