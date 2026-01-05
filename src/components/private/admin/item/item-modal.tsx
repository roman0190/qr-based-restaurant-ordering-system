"use client";

import { Item } from "@/types/item";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/ui/image-upload";
import {
  Sparkles,
  Utensils,
  IndianRupee,
  Package,
  CheckCircle2,
} from "lucide-react";

const categories = [
  "Appetizers",
  "Main Course",
  "Desserts",
  "Beverages",
  "Salads",
  "Soups",
  "Pizza",
  "Burger",
  "Pasta",
  "Seafood",
  "Vegetarian",
  "Sides",
];

const EMPTY: Item = {
  name: "",
  price: 0,
  description: "",
  category: "",
  imageUrl: null,
  available: true,
};

export default function ItemModal({
  open,
  initial,
  onClose,
  onSaved,
}: {
  open: boolean;
  initial?: Item | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Item>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initial ? { ...initial } : EMPTY);
  }, [initial]);

  const updateForm = (updates: Partial<Item>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  async function submit() {
    try {
      setSaving(true);
      const method = form._id ? "PUT" : "POST";
      const endpoint =
        method === "POST" ? "/api/common/items" : "/api/common/items/item";
      const body = form._id ? { ...form, id: form._id } : form;

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Failed to save");

      onSaved();
      onClose();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-[40px] border-none shadow-2xl bg-white/95 backdrop-blur-xl p-8 overflow-hidden">
        {/* Decorative Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

        <DialogHeader className="relative space-y-2 pb-2">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-2xl shadow-lg shadow-indigo-100">
              <Utensils className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">
                {form._id ? "Edit Treat" : "New Treat"}
              </DialogTitle>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                Item Details <Sparkles className="h-3 w-3 text-orange-400" />
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4 relative">
          {/* Name */}
          <div className="space-y-2">
            <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">
              Name
            </Label>
            <Input
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
              placeholder="e.g. Juicy Cheese Burger"
              className="rounded-2xl bg-gray-50/50 border-gray-100 focus:ring-indigo-100 focus:border-indigo-200 h-12"
            />
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">
                Price (৳)
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                  ৳
                </span>
                <Input
                  type="number"
                  step="1"
                  value={form.price}
                  onChange={(e) =>
                    updateForm({ price: Number(e.target.value) || 0 })
                  }
                  className="rounded-2xl bg-gray-50/50 border-gray-100 pl-8 h-12 font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">
                Category
              </Label>
              <Select
                value={form.category}
                onValueChange={(value) => updateForm({ category: value })}
              >
                <SelectTrigger className="rounded-2xl bg-gray-50/50 border-gray-100 h-12 focus:ring-indigo-100">
                  <SelectValue placeholder="Pick Category" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-xl">
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat}
                      value={cat}
                      className="rounded-xl focus:bg-indigo-50 cursor-pointer"
                    >
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">
              Description
            </Label>
            <Textarea
              value={form.description ?? ""}
              onChange={(e) => updateForm({ description: e.target.value })}
              placeholder="Tell us about this delicious item..."
              rows={3}
              className="rounded-2xl bg-gray-50/50 border-gray-100 focus:ring-indigo-100 resize-none p-4"
            />
          </div>

          {/* Image Upload Area */}
          <div className="space-y-2">
            <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">
              Cover Photo
            </Label>
            <div className="rounded-[28px] border-2 border-dashed border-gray-100 bg-gray-50/30 p-2 transition-colors hover:border-indigo-100 group">
              <ImageUpload
                currentUrl={form.imageUrl}
                onUploaded={(url) => updateForm({ imageUrl: url })}
                onRemoved={() => updateForm({ imageUrl: null })}
              />
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
            <div className="flex items-center gap-3">
              <CheckCircle2
                className={`h-5 w-5 ${
                  form.available ? "text-green-500" : "text-gray-300"
                }`}
              />
              <div>
                <Label
                  htmlFor="available"
                  className="text-sm font-black text-gray-700 block leading-none"
                >
                  Available for sale
                </Label>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                  Show this in menu
                </span>
              </div>
            </div>
            <Checkbox
              id="available"
              className="h-6 w-6 rounded-lg border-2 border-gray-200 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
              checked={form.available ?? true}
              onCheckedChange={(checked) =>
                updateForm({ available: !!checked })
              }
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="rounded-2xl font-bold text-gray-400 hover:bg-gray-50 hover:text-gray-600 h-12"
          >
            Discard
          </Button>
          <Button
            onClick={submit}
            disabled={saving}
            className="rounded-2xl bg-gray-900 hover:bg-indigo-600 text-white font-black h-12 px-8 shadow-xl shadow-gray-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
