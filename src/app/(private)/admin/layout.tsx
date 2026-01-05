// @/app/admin/layout.tsx
import React from "react";
import AdminSidebar from "@/components/private/layout/sidebar";
import AdminHeader from "@/components/private/layout/admin-header";
import { SidebarProvider } from "@/context/sidebar-context";

export const metadata = {
  title: "Admin Studio",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-[#FDFDFF]">
        {/* Sidebar: Handles its own mobile visibility via Context */}
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header: Contains the Menu Toggle for Mobile */}
          <AdminHeader />
          
          {/* Main Content: Padding adjusted for better breathing room */}
          <main className="flex-1 p-4 md:p-8 w-full">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}