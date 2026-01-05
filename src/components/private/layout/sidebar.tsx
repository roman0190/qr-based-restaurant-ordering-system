// @/components/admin/admin-sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  Users,
  Settings,
  Sparkles,
  LogOut,
  Table as TableIcon,
} from "lucide-react";
import { useSidebar } from "@/context/sidebar-context";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/items", label: "Items", icon: UtensilsCrossed },
  { href: "/admin/tables", label: "Tables", icon: TableIcon },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname() || "";
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/20 backdrop-blur-sm md:hidden"
          onClick={close}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-gray-100 bg-white p-6 transition-transform duration-300 ease-in-out md:sticky md:top-0 md:h-screen md:translate-x-0 flex flex-col overflow-hidden ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Close button for mobile */}
        <button
          onClick={close}
          className="absolute right-4 top-6 rounded-xl p-2 text-gray-400 md:hidden hover:bg-gray-50"
        >
          <X className="h-6 w-6" />
        </button>

        {/* --- LOGO --- */}
        <div className="mb-10 flex items-center gap-3 px-2 shrink-0">
          <div className="bg-indigo-600 h-10 w-10 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Sparkles className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">
              Menu Studio
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Control Panel
            </p>
          </div>
        </div>

        {/* --- NAVIGATION (flex-grow manually handles the space) --- */}
        <nav className="flex flex-col gap-2 flex-1 overflow-hidden group-hover:overflow-y-auto custom-scrollbar">
          {navItems.map((it) => {
            const Icon = it.icon;
            const active =
              pathname === it.href ||
              (it.href !== "/admin" && pathname.startsWith(it.href));
            return (
              <Link
                key={it.href}
                href={it.href}
                onClick={close}
                className={`group flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  active
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100"
                    : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    active
                      ? "text-white"
                      : "text-gray-400 group-hover:text-indigo-500"
                  }`}
                />
                <span>{it.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* --- LOGOUT (Always at the very bottom) --- */}
        <div className="mt-auto pt-6 border-t border-gray-50 shrink-0">
          <button className="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-2xl transition-all group active:scale-95">
            <div className="bg-rose-100 p-2 rounded-xl group-hover:bg-rose-200 transition-colors">
              <LogOut className="h-4 w-4" />
            </div>
            <span>Logout</span>
          </button>

          <div className="mt-4 px-4 pb-2">
            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest text-center">
              © 2026 Menu Studio
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
