"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Table = {
  _id?: string;
  number: string;
  capacity: number;
  status: "available" | "occupied" | "reserved";
};

export default function TableModal({
  open,
  initial,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  initial?: Table | null;
  onOpenChange: (open: boolean) => void;
  onSaved?: (table?: Table) => void;
}) {
  const [fields, setFields] = useState<Table>({
    number: initial?.number ?? "",
    capacity: initial?.capacity ?? 2,
    status: initial?.status ?? "available",
    _id: initial?._id,
  });

  useEffect(() => {
    if (initial) {
      setFields({
        number: initial.number ?? "",
        capacity: initial.capacity ?? 2,
        status: initial.status ?? "available",
        _id: initial._id,
      });
    } else {
      setFields({
        number: "",
        capacity: 2,
        status: "available",
      });
    }
  }, [initial]);

  async function onSubmit() {
    try {
      const payload = {
        number: fields.number,
        capacity: Number(fields.capacity),
        status: fields.status,
      };

      const method = fields._id ? "PUT" : "POST";
      const endpoint = fields._id
        ? `/api/tables?id=${fields._id}`
        : "/api/tables";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.ok) {
        onOpenChange(false);
        onSaved?.(json.table);
      } else {
        alert(`${json.error}`);
      }
    } catch (err) {
      alert((err as Error).message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Table" : "Add Table"}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mb-4">
          {initial
            ? "Edit the table details."
            : "Add a new table to the restaurant."}
        </DialogDescription>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-4"
        >
          <div>
            <Label>Table Number / Name</Label>
            <Input
              placeholder="e.g. 1, 2, VIP-1"
              value={fields.number}
              onChange={(e) => setFields({ ...fields, number: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Capacity</Label>
            <Input
              type="number"
              value={String(fields.capacity)}
              onChange={(e) =>
                setFields({ ...fields, capacity: Number(e.target.value) || 0 })
              }
              required
            />
          </div>

          <div>
            <Label>Status</Label>
            <select
              value={fields.status}
              onChange={(e) =>
                setFields({ ...fields, status: e.target.value as any })
              }
              className="w-full p-2 border rounded-xl bg-white text-sm"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>

          <DialogFooter>
            <div className="flex gap-3 w-full">
              <Button type="submit" className="flex-1 bg-indigo-600 text-white">
                Save Table
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
