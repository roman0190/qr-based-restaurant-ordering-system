"use client";
import { QrCode, UtensilsCrossed, ArrowRight, Sparkles } from "lucide-react";


export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 bg-slate-50/50">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Animated Icon Container */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse rounded-full" />
          <div className="relative bg-white p-8 rounded-[40px] shadow-2xl shadow-indigo-100/50 border border-slate-50 group">
            <QrCode className="h-20 w-20 text-indigo-600 transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute -top-2 -right-2 bg-amber-400 p-2 rounded-2xl shadow-lg animate-bounce">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Ready to <span className="text-indigo-600">Order?</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Please scan the QR code on your table to view our menu and start
            your dining experience.
          </p>
        </div>

        {/* Instructions */}
        <div className="grid grid-cols-1 gap-4 text-left pt-4">
          {[
            { step: "1", text: "Open your camera or QR scanner" },
            { step: "2", text: "Scan the QR code on your table" },
            { step: "3", text: "Place your order directly from your phone" },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm"
            >
              <span className="shrink-0 h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">
                {item.step}
              </span>
              <span className="text-slate-600 font-semibold text-sm">
                {item.text}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-8">
          <div className="inline-flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-widest">
            <UtensilsCrossed className="h-4 w-4" />
            <span>Menu Studio</span>
          </div>
        </div>
      </div>
    </div>
  );
}
