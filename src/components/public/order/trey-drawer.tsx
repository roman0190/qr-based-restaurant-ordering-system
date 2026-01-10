"use client";

import { useTrey } from "@/context/trey-context";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";

interface TreyDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TreyDrawer({ open, onOpenChange }: TreyDrawerProps) {
  const {
    trey,
    updateQuantity,
    removeFromTrey,
    confirmItem,
    totalPrice,
    totalItems,
  } = useTrey();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 bg-[#FDFDFF]"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-6 pt-8 pb-6 border-b-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <SheetTitle className="text-2xl font-black tracking-tight lowercase first-letter:uppercase">
                    your trey
                  </SheetTitle>
                  <SheetDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {totalItems} {totalItems === 1 ? "treat" : "treats"} ready
                  </SheetDescription>
                </div>
              </div>
            </div>
          </SheetHeader>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {trey.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="h-32 w-32 rounded-[40px] bg-indigo-50/50 flex items-center justify-center mb-6 group-hover:bg-indigo-50 transition-all">
                  <ShoppingBag className="h-16 w-16 text-indigo-200" />
                </div>
                <p className="text-slate-800 font-black text-xl tracking-tight lowercase first-letter:uppercase mb-2">
                  trey is empty
                </p>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  Add some delicious treats
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {trey.map((item, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-[32px] p-5 transition-all shadow-[0_10px_40px_rgba(0,0,0,0.02)] border ${
                      item.isConfrim
                        ? "border-green-100 bg-green-50/30 shadow-[0_10px_40px_rgba(34,197,94,0.08)]"
                        : "border-slate-50 hover:border-indigo-100 hover:shadow-[0_20px_50px_rgba(99,102,241,0.06)]"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Item Image */}
                      <div className="relative w-20 h-20 rounded-[24px] bg-slate-50/50 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.itemName}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <Sparkles className="h-8 w-8 text-indigo-100" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-black text-slate-800 tracking-tight lowercase first-letter:uppercase text-lg">
                              {item.itemName}
                            </h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                              ৳{item.price} per item
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.isConfrim ? (
                              <Badge
                                variant="default"
                                className="bg-green-500 hover:bg-green-600 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest"
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Done
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-amber-600 border-amber-200 bg-amber-50 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest"
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Waiting
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 bg-slate-50 rounded-full p-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-9 w-9 p-0 rounded-full bg-white hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-95"
                              onClick={() =>
                                updateQuantity(item.itemName, item.quentity - 1)
                              }
                              disabled={item.isConfrim}
                            >
                              <Minus className="h-4 w-4 stroke-[3px]" />
                            </Button>
                            <span className="font-black text-xl w-10 text-center tracking-tighter">
                              {item.quentity}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-9 w-9 p-0 rounded-full bg-white hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-95"
                              onClick={() =>
                                updateQuantity(item.itemName, item.quentity + 1)
                              }
                              disabled={item.isConfrim}
                            >
                              <Plus className="h-4 w-4 stroke-[3px]" />
                            </Button>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {!item.isConfrim && (
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600 rounded-2xl h-9 px-4 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                                onClick={() => confirmItem(item.itemName)}
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Confirm
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-9 w-9 p-0 rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 transition-all active:scale-95"
                              onClick={() => removeFromTrey(item.itemName)}
                              disabled={item.isConfrim}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Total for this item */}
                        <div className="mt-4 pt-3 border-t border-slate-100/50">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                              Item Total
                            </span>
                            <p className="text-lg font-black text-indigo-600 tracking-tighter">
                              ৳{item.price * item.quentity}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {trey.length > 0 && (
            <div className="px-6 py-6 bg-white border-t border-slate-100/50">
              <div className="bg-indigo-50/50 rounded-[32px] p-6 mb-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Total Items
                    </span>
                    <span className="font-black text-xl tracking-tighter">
                      {totalItems}
                    </span>
                  </div>
                  <div className="h-px bg-slate-200/50" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black tracking-tight lowercase first-letter:uppercase">
                      Grand Total
                    </span>
                    <span className="text-3xl font-black text-indigo-600 tracking-tighter">
                      ৳{totalPrice}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-slate-900 hover:bg-indigo-600 h-14 rounded-[28px] text-sm font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg"
                disabled={trey.every((item) => item.isConfrim)}
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Confirm All Items
              </Button>

              <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 text-center mt-4">
                Confirmed treats go straight to the kitchen ✨
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
