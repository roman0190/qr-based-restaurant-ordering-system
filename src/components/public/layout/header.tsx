import { UtensilsCrossed } from "lucide-react";
import Link from "next/link";

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-slate-900">
           Menu Studio
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Placeholder for future actions like Cart or Language switcher */}
          {/* <Button variant="ghost" size="icon">
            <ShoppingBag className="h-5 w-5 text-slate-600" />
          </Button> */}
        </div>
      </div>
    </header>
  );
}
