"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  Copy,
  Flame,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";

type CreateResponse = {
  id: string;
  url: string;
  error?: string;
};

export function CreateSecretForm() {
  const [secret, setSecret] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setUrl(null);
    setCopied(false);
    setLoading(true);

    try {
      const response = await fetch("/api/secrets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });
      const data = (await response.json()) as CreateResponse;

      if (!response.ok) {
        throw new Error(data.error || "Unable to create secret link.");
      }

      setUrl(data.url);
      setSecret("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  if (url) {
    return (
      <div className="rounded-3xl overflow-hidden backdrop-blur-md bg-white/70 border border-white/20 p-6 sm:p-8 shadow-xl shadow-black/5">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 px-2.5 py-1 text-xs mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Link ready — burns after one view
        </div>
        <h2 className="text-2xl sm:text-3xl font-medium tracking-tighter text-black mb-2">
          Your secret link
        </h2>
        <p className="text-black/60 mb-6 text-sm sm:text-base">
          Share this once. The moment someone opens it, the encrypted payload is
          permanently destroyed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            readOnly
            value={url}
            className="flex-1 w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-black/20 font-mono"
          />
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-neutral-700 to-neutral-900 text-white px-5 py-3 text-sm font-medium hover:opacity-90 transition"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy link
              </>
            )}
          </button>
        </div>
        <button
          type="button"
          onClick={() => setUrl(null)}
          className="mt-6 text-sm text-black/50 hover:text-black transition"
        >
          Create another secret
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl overflow-hidden backdrop-blur-md bg-white/70 border border-white/20 p-6 sm:p-8 shadow-xl shadow-black/5"
    >
      <div className="flex items-center gap-2 text-black/50 text-xs mb-4">
        <ShieldCheck className="h-4 w-4" />
        Encrypted with AES-256-GCM before storage
      </div>
      <label htmlFor="secret" className="sr-only">
        Secret text
      </label>
      <textarea
        id="secret"
        name="secret"
        required
        rows={8}
        value={secret}
        onChange={(event) => setSecret(event.target.value)}
        placeholder="Paste an API key, .env block, password, or token…"
        className="w-full resize-y rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm sm:text-base text-black placeholder:text-black/35 outline-none focus:ring-2 focus:ring-black/20"
      />
      {error ? (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-xs text-black/45 inline-flex items-center gap-1.5">
          <Flame className="h-3.5 w-3.5" />
          No account. One view. Then gone.
        </p>
        <button
          type="submit"
          disabled={loading || !secret.trim()}
          className="group inline-flex items-center gap-2 relative overflow-hidden text-sm font-medium text-white ring-1 ring-white/10 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background:
              "linear-gradient(135deg, rgb(55, 65, 81) 0%, rgb(107, 114, 128) 100%)",
            boxShadow: "rgb(75, 85, 99) 0px 0px 1.6em -0.6em inset",
            height: "2.8em",
            padding: "0.35em 3.3em 0.35em 1.2em",
            letterSpacing: "0.05em",
          }}
        >
          {loading ? "Encrypting…" : "Create burn link"}
          <span
            className="absolute right-[0.3em] flex items-center justify-center h-[2.2em] w-[2.2em] transition-all duration-300 group-hover:w-[calc(100%-0.6em)] bg-white rounded-[0.7em]"
            style={{ boxShadow: "0.1em 0.1em 0.6em 0.2em #4b5563" }}
          >
            {loading ? (
              <LoaderCircle className="w-[1.1em] h-[1.1em] text-[#4b5563] animate-spin" />
            ) : (
              <ArrowRight className="w-[1.1em] h-[1.1em] text-[#4b5563] transition-transform duration-300 group-hover:translate-x-[0.1em]" />
            )}
          </span>
        </button>
      </div>
    </form>
  );
}
