import React, { useState, useRef, useEffect } from "react";
import { Package, Pencil, Trash2 } from "lucide-react";
import { Item } from "@/types/item";
import { Button } from "@/components/ui/button";

export default function ItemCard({
  item,
  onEdit,
  onDelete,
}: {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  // Check if text is actually overflowing to show "Read More"
  useEffect(() => {
    const element = descriptionRef.current;
    if (element) {
      // Check if scrollHeight is greater than clientHeight
      const hasOverflow = element.scrollHeight > element.clientHeight;
      setIsOverflowing(hasOverflow);
    }
  }, [item.description]);

  return (
    <div className="group bg-white rounded-[32px] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col h-full max-w-[320px]">
      
      {/* 1. Image Container */}
      <div className="relative w-full aspect-square bg-[#F8F9FB] rounded-[24px] overflow-hidden flex items-center justify-center p-6 group-hover:bg-[#F1F4F9] transition-colors duration-500">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Package className="h-12 w-12 text-gray-200" />
            <span className="text-[10px] text-gray-300 font-medium">No Image</span>
          </div>
        )}

        {/* 2. Badge */}
        {item.available !== undefined && (
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${
              item.available 
                ? "bg-white/90 text-green-600 border-white" 
                : "bg-gray-100 text-gray-400 border-gray-200"
            }`}>
              {item.available ? "● Available" : "● Out of Stock"}
            </span>
          </div>
        )}
      </div>

      {/* 3. Content Section */}
      <div className="mt-5 flex-1 space-y-2 px-1">
        <div>
          {item.category && (
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">
              {item.category}
            </p>
          )}
          <h2 className="text-xl font-bold text-gray-800 line-clamp-1 tracking-tight">
            {item.name}
          </h2>
        </div>

        {/* Description */}
        <div className="text-gray-500 text-xs leading-relaxed">
          <p 
            ref={descriptionRef}
            className={`transition-all duration-300 ${expanded ? "" : "line-clamp-2"}`}
          >
            {item.description || "No description provided for this item."}
          </p>
          
          {/* Only show button if text overflows or is already expanded */}
          {(isOverflowing || expanded) && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-indigo-600 font-bold text-[10px] mt-1 hover:underline underline-offset-2 transition-all uppercase tracking-tighter"
            >
              {expanded ? "Show Less" : "Read More"}
            </button>
          )}
        </div>
      </div>

      {/* 4. Footer Section (Price & Actions) */}
      <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between px-1">
        <div className="flex flex-col">
          <span className="text-2xl font-black text-gray-900 leading-none tracking-tighter">
            <span className="text-base font-bold text-gray-400 mr-1">৳</span>
            {Number(item.price).toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl bg-gray-50 text-gray-400 h-10 w-10 hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm"
            onClick={() => onEdit(item)}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl bg-gray-50 text-gray-400 h-10 w-10 hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-sm"
            onClick={() => item._id && onDelete(item._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}