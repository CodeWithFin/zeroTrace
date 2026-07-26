import Link from "next/link";
import { Flame } from "lucide-react";

export function Header() {
  return (
    <header>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm sm:text-base font-medium tracking-tight text-black"
          >
            <Flame className="h-4 w-4" strokeWidth={2} />
            ZeroTrace
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#how"
              className="text-sm text-black/60 hover:text-black transition"
            >
              How it works
            </a>
            <a
              href="#security"
              className="text-sm text-black/60 hover:text-black transition"
            >
              Security
            </a>
          </nav>
          <a
            href="#create"
            className="inline-flex items-center justify-center text-sm text-white bg-gradient-to-b from-neutral-700 to-neutral-900 rounded-xl px-5 py-2 shadow-[0_2.8px_2.2px_rgba(0,0,0,0.034),0_6.7px_5.3px_rgba(0,0,0,0.048),0_12.5px_10px_rgba(0,0,0,0.06),0_22.3px_17.9px_rgba(0,0,0,0.072),0_41.8px_33.4px_rgba(0,0,0,0.086),0_100px_80px_rgba(0,0,0,0.12)] hover:opacity-85 transition"
          >
            Create link
          </a>
        </div>
      </div>
    </header>
  );
}
