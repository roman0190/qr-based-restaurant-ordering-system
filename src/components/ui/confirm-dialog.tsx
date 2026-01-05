"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./dialog";
import { Button } from "./button";

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title ?? "Are you sure?"}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mb-4">
          {description ?? "This action cannot be undone."}
        </DialogDescription>

        <DialogFooter>
          <div className="flex gap-3">
            <Button
              className="bg-red-600 text-white"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              Confirm
            </Button>
            <Button className="bg-gray-200" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
