"use client";
import { useSidebar } from "@/context/sidebar-context";
import { Menu, Bell, UserCircle } from "lucide-react";

export default function AdminHeader() {
  const { toggle } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white/80 px-4 backdrop-blur-md md:px-8">
      {/* Mobile Menu Button */}
      <button
        onClick={toggle}
        className="rounded-xl p-2 hover:bg-gray-50 md:hidden"
      >
        <Menu className="h-6 w-6 text-gray-600" />
      </button>

      {/* Breadcrumb or Search Placeholder */}
      <div className="hidden md:block">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
          Dashboard / Overview
        </p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button className="relative rounded-xl p-2 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 border-2 border-white" />
        </button>
        <div className="h-8 w-[1px] bg-gray-100 mx-2" />
        <div className="flex items-center gap-2 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-gray-900 leading-none">
              Admin User
            </p>
            <p className="text-[10px] font-bold text-indigo-500 mt-1 uppercase tracking-tighter">
              Super Admin
            </p>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center border-2 border-white shadow-sm text-indigo-600">
            <UserCircle className="h-6 w-6" />
          </div>
        </div>
      </div>
    </header>
  );
}
