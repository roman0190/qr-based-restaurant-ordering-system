"use client";

import { Button } from "@/components/ui/button";
import ItemModal from "@/components/private/admin/item/item-modal";
import ItemCard from "@/components/private/admin/item/item-card";
import { useItems } from "@/hooks/use-items";
import { Item } from "@/types/item";
import { useState, useMemo } from "react";
import { 
  Plus, 
  Sparkles, 
  Search, 
  LayoutGrid, 
  ChefHat, 
  Cookie, 
  CircleDot 
} from "lucide-react";

export default function AdminItemsPage() {
  const { items, loading, error, refetch } = useItems();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = items.map((item) => item.category).filter(Boolean);
    return ["All", ...Array.from(new Set(cats))];
  }, [items]);

  const groupedItems = useMemo(() => {
    const searchFiltered = items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const categoriesToDisplay = activeCategory === "All" 
      ? categories.filter(c => c !== "All") 
      : [activeCategory];

    const groups: Record<string, Item[]> = {};
    categoriesToDisplay.forEach(cat => {
      const itemsInCat = searchFiltered.filter(item => item.category === cat);
      if (itemsInCat.length > 0) groups[cat] = itemsInCat;
    });
    return groups;
  }, [items, searchQuery, activeCategory, categories]);

  return (
    <div className="min-h-screen bg-[#FAFBFF] w-full p-6 md:p-10 transition-all duration-300 relative">
      
      {/* 1. Page Header */}
      <div className="mb-10 text-center sm:text-left flex items-center justify-between">
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
            <div className="bg-indigo-600 p-2 rounded-2xl shadow-lg shadow-indigo-100">
               <ChefHat className="text-white h-5 w-5" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Menu Items
            </h1>
          </div>
          <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.3em] ml-1">
            Manage your kitchen storefront
          </p>
        </div>
      </div>

      {/* 2. Action Bar: Search & Filters */}
      <div className="space-y-6 mb-12">
        <div className="relative group max-w-xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-200 group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            placeholder="Search for an item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-4 border-indigo-50/50 rounded-[24px] py-4 pl-14 pr-6 text-sm shadow-sm focus:border-indigo-100 transition-all outline-none font-bold text-gray-600"
          />
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as string)}
              className={`px-3 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-b-4 active:border-b-0 active:translate-y-1 ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white border-indigo-700 shadow-lg shadow-indigo-100"
                  : "bg-white text-gray-400 border-gray-100 hover:border-indigo-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Floating Add Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => { setEditing(null); setOpen(true); }}
          className="flex items-center justify-center w-16 h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-[0_15px_30px_-5px_rgba(79,70,229,0.5)] hover:scale-110 active:scale-90 transition-all duration-300 group"
        >
          <Plus className="h-8 w-8 text-white stroke-[4px] group-hover:rotate-90 transition-transform duration-500" />
          <span className="absolute inset-0 rounded-full bg-indigo-400 animate-ping opacity-20 pointer-events-none" />
        </button>
      </div>

      {/* 4. Categorized Content */}
      {loading ? (
        <div className="py-40 flex flex-col items-center">
          <div className="h-10 w-10 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin mb-4" />
          <p className="text-gray-300 font-black tracking-widest text-[10px] uppercase">Syncing Kitchen...</p>
        </div>
      ) : Object.keys(groupedItems).length === 0 ? (
        <div className="text-center py-24 bg-indigo-50/20 rounded-[40px] border-4 border-dashed border-indigo-50/50">
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No Items Found</p>
        </div>
      ) : (
        <div className="space-y-20 pb-32">
          {Object.entries(groupedItems).map(([categoryName, items]) => (
            <section key={categoryName}>
              <div className="flex items-center gap-4 mb-10 px-2">
                <div className="bg-white p-2 rounded-xl shadow-sm border border-indigo-50">
                  <Cookie className="h-5 w-5 text-indigo-500" />
                </div>
                <h2 className="text-2xl font-black text-gray-800 tracking-tight lowercase first-letter:uppercase">
                  {categoryName}
                </h2>
                <div className="flex-1 h-1 bg-indigo-50/50 rounded-full" />
                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 bg-white border border-indigo-50 px-4 py-2 rounded-full shadow-sm">
                  <CircleDot className="h-3 w-3" />
                  <span>{items.length} ITEMS</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-x-6 gap-y-20 justify-items-center">
                {items.map((item) => (
                  <ItemCard
                    key={item._id}
                    item={item}
                    onEdit={(i) => { setEditing(i); setOpen(true); }}
                    onDelete={refetch}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <ItemModal open={open} initial={editing} onClose={() => setOpen(false)} onSaved={refetch} />
    </div>
  );
}