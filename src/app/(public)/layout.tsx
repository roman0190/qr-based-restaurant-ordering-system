import React from "react";
import PublicHeader from "@/components/public/layout/header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FDFDFF] selection:bg-indigo-100 selection:text-indigo-600">
      <PublicHeader />
      {children}
    </div>
  );
}
