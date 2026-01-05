"use client";

import { Plus, Sparkles } from "lucide-react";
import { Item } from "@/types/item";


export default function ItemCardPublic({ item }: { item: Item }) {


  return (
    <div className="group bg-white rounded-[40px] p-4 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-slate-50 hover:border-indigo-100 hover:shadow-[0_20px_50px_rgba(99,102,241,0.06)] transition-all duration-500 flex flex-col h-full w-full max-w-[320px]">
      
      {/* --- IMAGE SECTION --- */}
      <div className="relative aspect-square bg-slate-50/50 rounded-[32px] overflow-hidden flex items-center justify-center p-6 group-hover:bg-white transition-all duration-500">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
          />
        ) : (
          <Sparkles className="h-12 w-12 text-indigo-50" />
        )}

        {/* Floating Price Tag */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white flex items-center gap-1">
            <span className="text-xs font-black text-indigo-400 leading-none">৳</span>
            <span className="text-lg font-black text-slate-900 leading-none tracking-tighter">
              {item.price}
            </span>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="mt-5 flex-1 px-1">
        <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight lowercase first-letter:uppercase group-hover:text-indigo-600 transition-colors">
          {item.name}
        </h3>
        <p className="mt-2 text-[11px] text-slate-400 font-medium line-clamp-2 leading-relaxed italic">
          {item.description || "Crafted with handpicked ingredients and lots of love."}
        </p>
      </div>

      {/* --- ACTION BUTTON --- */}
      <div className="mt-6">
        <button
          onClick={() => ""}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-indigo-50 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-100 active:scale-95"
        >
          <Plus className="h-4 w-4 stroke-[3px]" />
          <span>Add to Tray</span>
        </button>
      </div>
    </div>
  );
}