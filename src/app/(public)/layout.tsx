import React from "react";
import PublicHeader from "@/components/public/layout/header";
import { TreyProvider } from "@/context/trey-context";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TreyProvider>
      <div className="min-h-screen bg-[#FDFDFF] selection:bg-indigo-100 selection:text-indigo-600">
        <PublicHeader />
        {children}
      </div>
    </TreyProvider>
  );
}
