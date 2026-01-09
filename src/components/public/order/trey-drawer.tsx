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
      <SheetContent side="right" className="w-full sm:max-w-lg p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
              <ShoppingBag className="h-6 w-6" />
              Your Trey
            </SheetTitle>
            <SheetDescription>
              {totalItems} {totalItems === 1 ? "item" : "items"} in your order
            </SheetDescription>
          </SheetHeader>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {trey.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <ShoppingBag className="h-10 w-10 text-slate-300" />
                </div>
                <p className="text-slate-400 font-bold">Your trey is empty</p>
                <p className="text-slate-300 text-sm mt-2">
                  Start adding items to your order
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {trey.map((item, index) => (
                  <div
                    key={index}
                    className={`bg-white border rounded-2xl p-4 transition-all ${
                      item.isConfrim
                        ? "border-green-200 bg-green-50"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-slate-800">
                              {item.itemName}
                            </h3>
                            <p className="text-sm text-slate-500">
                              ৳{item.price} × {item.quentity}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.isConfrim ? (
                              <Badge
                                variant="default"
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Confirmed
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-amber-600 border-amber-200"
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 rounded-full"
                              onClick={() =>
                                updateQuantity(item.itemName, item.quentity - 1)
                              }
                              disabled={item.isConfrim}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-bold text-lg w-8 text-center">
                              {item.quentity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 rounded-full"
                              onClick={() =>
                                updateQuantity(item.itemName, item.quentity + 1)
                              }
                              disabled={item.isConfrim}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {!item.isConfrim && (
                              <Button
                                size="sm"
                                variant="default"
                                className="bg-green-500 hover:bg-green-600 h-8"
                                onClick={() => confirmItem(item.itemName)}
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Confirm
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => removeFromTrey(item.itemName)}
                              disabled={item.isConfrim}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Total for this item */}
                        <div className="mt-2 pt-2 border-t border-slate-100">
                          <p className="text-sm font-bold text-slate-700">
                            Subtotal: ৳{item.price * item.quentity}
                          </p>
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
            <div className="border-t px-6 py-4 bg-slate-50 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Total Items:</span>
                  <span className="font-bold">{totalItems}</span>
                </div>
                <div className="flex justify-between text-lg font-black">
                  <span>Total:</span>
                  <span className="text-indigo-600">৳{totalPrice}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-slate-900 hover:bg-indigo-600 h-12 text-base font-bold"
                  disabled={trey.every((item) => item.isConfrim)}
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Confirm All
                </Button>
              </div>

              <p className="text-xs text-slate-500 text-center">
                Confirmed items will be sent to the kitchen
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
