"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, User, Phone, Lock } from "lucide-react";

interface SessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tableNumber: string;
  onSessionCreated: (sessionId: string, pin: string) => void;
  mode: "create" | "validate";
  onModeChange?: (mode: "create" | "validate") => void;
}

export default function SessionModal({
  open,
  onOpenChange,
  tableNumber,
  onSessionCreated,
  mode,
  onModeChange,
}: SessionModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tablePin, setTablePin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [localMode, setLocalMode] = useState<"create" | "validate">(mode);

  // Update local mode when prop changes
  useEffect(() => {
    setLocalMode(mode);
  }, [mode]);

  const currentMode = localMode;

  const switchMode = () => {
    const newMode = currentMode === "create" ? "validate" : "create";
    setLocalMode(newMode);
    setError("");
    if (onModeChange) {
      onModeChange(newMode);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (currentMode === "create") {
        // Create new session
        const response = await fetch(`/api/public/tables/session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tableNumber,
            customerName,
            customerPhone,
            tablePin,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create session");
        }

        onSessionCreated(data.session.id, tablePin);
        onOpenChange(false);
      } else {
        // Validate existing session
        const response = await fetch(
          `/api/public/tables/session?table=${tableNumber}&pin=${tablePin}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Invalid PIN");
        }

        onSessionCreated(data.session.id, tablePin);
        onOpenChange(false);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">
            {currentMode === "create" ? "Start Your Order" : "Enter Your PIN"}
          </DialogTitle>
          <DialogDescription>
            {currentMode === "create"
              ? `Create a session for Table ${tableNumber}`
              : `Enter your PIN to access Table ${tableNumber}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {currentMode === "create" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-bold">
                  Your Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-bold">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pin" className="text-sm font-bold">
                  Create 4-Digit PIN
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="pin"
                    type="password"
                    placeholder="Create a 4-digit PIN"
                    value={tablePin}
                    onChange={(e) => setTablePin(e.target.value)}
                    className="pl-10"
                    maxLength={4}
                    pattern="[0-9]{4}"
                    required
                  />
                </div>
                <p className="text-xs text-slate-500">
                  You'll need this PIN to access your order later
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="pin" className="text-sm font-bold">
                Enter Your PIN
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="pin"
                  type="password"
                  placeholder="Enter 4-digit PIN"
                  value={tablePin}
                  onChange={(e) => setTablePin(e.target.value)}
                  className="pl-10"
                  maxLength={4}
                  pattern="[0-9]{4}"
                  required
                />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-slate-900 hover:bg-indigo-600 transition-colors"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : currentMode === "create" ? (
              "Start Session"
            ) : (
              "Access Session"
            )}
          </Button>

          {/* Mode Switch Link */}
          <div className="text-center">
            <button
              type="button"
              onClick={switchMode}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-bold underline"
            >
              {currentMode === "create"
                ? "Already have a session? Enter PIN"
                : "Create new session instead"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
