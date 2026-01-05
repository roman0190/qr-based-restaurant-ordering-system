// @/components/public/layout/bento-filter.tsx
"use client";

import { LayoutGrid, Pizza, Coffee, Sandwich, IceCream, Beef } from "lucide-react";

// Category wise icons mapping (Optional but looks Pro)
const iconMap: Record<string, any> = {
  All: LayoutGrid,
  Pizza: Pizza,
  Beverages: Coffee,
  Burger: Sandwich,
  Desserts: IceCream,
  "Main Course": Beef,
};

export default function BentoFilter({ 
  categories, 
  activeCategory, 
  setActiveCategory 
}: { 
  categories: string[], 
  activeCategory: string, 
  setActiveCategory: (cat: string) => void 
}) {
  return (
    <section className="px-6 mt-8">
      <div className="max-w-7xl mx-auto">
        {/* Label */}
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="h-1 w-4 bg-indigo-500 rounded-full" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Category</span>
        </div>

        {/* The Bento Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map((cat) => {
            const Icon = iconMap[cat] || LayoutGrid;
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`group relative flex flex-col items-center justify-center gap-2 p-4 rounded-[24px] transition-all duration-500 overflow-hidden ${
                  isActive 
                    ? "bg-indigo-600 shadow-[0_15px_30px_-5px_rgba(79,70,229,0.3)] -translate-y-1" 
                    : "bg-white border border-slate-100 shadow-sm hover:border-indigo-100 hover:bg-indigo-50/30"
                }`}
              >
                {/* Active Shine Effect */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                )}

                <div className={`p-2 rounded-xl transition-colors ${
                  isActive ? "bg-white/20" : "bg-slate-50 group-hover:bg-white"
                }`}>
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-500"}`} />
                </div>

                <span className={`text-[10px] font-black uppercase tracking-tight text-center leading-none ${
                  isActive ? "text-white" : "text-slate-400"
                }`}>
                  {cat}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}