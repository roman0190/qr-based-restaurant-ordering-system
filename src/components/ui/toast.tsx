"use client";

import React, { useEffect } from "react";

export default function Toast({
  message,
  open,
  onClose,
}: {
  message?: string;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(t);
  }, [open, onClose]);

  if (!open || !message) return null;

  return (
    <div className="fixed right-4 bottom-6 z-50">
      <div className="px-4 py-2 bg-black text-white rounded shadow">
        {message}
      </div>
    </div>
  );
}
