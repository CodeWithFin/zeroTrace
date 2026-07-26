import { Flame, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full px-4 sm:px-6 md:px-10 pt-12 pb-10">
      <div className="relative overflow-hidden bg-white border border-black/10 rounded-3xl">
        <div className="relative z-10 p-8 sm:p-12 md:p-16">
          <div className="pb-12 border-b border-black/10">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-black/80" />
              <h3 className="text-2xl text-black tracking-tighter font-medium">
                ZeroTrace — burn-on-read secrets
              </h3>
            </div>
            <p className="text-black/70 max-w-3xl">
              Share API keys, passwords, and tokens without leaving them in Slack
              forever. Encrypted before write. Destroyed on read.
            </p>

            <div className="mt-6 rounded-2xl border border-black/10 bg-gradient-to-b from-neutral-700 to-neutral-900 p-5 sm:p-6 md:p-8 shadow-[0_2.8px_2.2px_rgba(0,0,0,0.034),0_6.7px_5.3px_rgba(0,0,0,0.048),0_12.5px_10px_rgba(0,0,0,0.06),0_22.3px_17.9px_rgba(0,0,0,0.072),0_41.8px_33.4px_rgba(0,0,0,0.086),0_100px_80px_rgba(0,0,0,0.12)]">
              <h4 className="text-white font-semibold tracking-tight mb-3">
                Built for teams that share secrets carefully
              </h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <Flame className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  Atomic delete-on-read so concurrent opens cannot double-read.
                </li>
                <li className="flex items-start gap-2">
                  <Flame className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  Plaintext never touches the database — only AES-256-GCM ciphertext.
                </li>
                <li className="flex items-start gap-2">
                  <Flame className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  Self-hostable with your own encryption key and Postgres.
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-12">
            <div>
              <h4 className="text-black/80 text-xs uppercase tracking-[0.2em] font-medium">
                Product
              </h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a href="#create" className="text-black/60 hover:text-black transition">
                    Create link
                  </a>
                </li>
                <li>
                  <a href="#how" className="text-black/60 hover:text-black transition">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#security" className="text-black/60 hover:text-black transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-black/80 text-xs uppercase tracking-[0.2em] font-medium">
                Stack
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-black/60">
                <li>Next.js App Router</li>
                <li>AES-256-GCM</li>
                <li>PostgreSQL</li>
              </ul>
            </div>
            <div>
              <h4 className="text-black/80 text-xs uppercase tracking-[0.2em] font-medium">
                Privacy
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-black/60">
                <li>No accounts</li>
                <li>No analytics required</li>
                <li>7-day unread TTL</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-black/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-black/60 text-sm">
              © {new Date().getFullYear()} ZeroTrace. Secrets leave no trace.
            </p>
            <a
              href="#create"
              className="text-black/60 hover:text-black transition text-sm inline-flex items-center gap-1"
            >
              Back to top
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
