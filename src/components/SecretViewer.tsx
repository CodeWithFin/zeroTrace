"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy, Eye, LoaderCircle } from "lucide-react";

type ViewState =
  | { status: "confirm" }
  | { status: "loading" }
  | { status: "ready"; secret: string }
  | { status: "gone"; message: string }
  | { status: "error"; message: string };

export function SecretViewer({ id }: { id: string }) {
  const [state, setState] = useState<ViewState>({ status: "confirm" });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [id]);

  async function reveal() {
    setState({ status: "loading" });

    try {
      const response = await fetch(`/api/secrets/${id}`);
      const data = (await response.json()) as {
        secret?: string;
        error?: string;
        burned?: boolean;
      };

      if (response.status === 410) {
        setState({
          status: "gone",
          message:
            data.error ||
            "This secret has already been viewed or no longer exists.",
        });
        return;
      }

      if (!response.ok || !data.secret) {
        throw new Error(data.error || "Unable to retrieve secret.");
      }

      setState({ status: "ready", secret: data.secret });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  }

  async function copySecret(value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-3xl overflow-hidden backdrop-blur-md bg-white/70 border border-white/20 p-6 sm:p-8 shadow-xl shadow-black/5">
      {state.status === "confirm" ? (
        <>
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tighter text-black mb-3">
            Reveal this secret?
          </h1>
          <p className="text-black/60 leading-relaxed mb-8 max-w-xl">
            Opening this link decrypts the payload and permanently deletes it
            from the database in the same request. You cannot view it again.
          </p>
          <button
            type="button"
            onClick={reveal}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-neutral-700 to-neutral-900 text-white px-5 py-3 text-sm font-medium hover:opacity-90 transition"
          >
            <Eye className="h-4 w-4" />
            Reveal and burn
          </button>
        </>
      ) : null}

      {state.status === "loading" ? (
        <div className="flex items-center gap-3 text-black/60 py-10">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Decrypting and burning…
        </div>
      ) : null}

      {state.status === "ready" ? (
        <>
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tighter text-black mb-3">
            Secret revealed
          </h1>
          <p className="text-black/60 mb-6 text-sm">
            Copy it now. Refreshing this page will not recover it.
          </p>
          <pre className="whitespace-pre-wrap break-words rounded-2xl border border-black/10 bg-white/80 px-4 py-4 text-sm font-mono text-black mb-4 max-h-[420px] overflow-auto">
            {state.secret}
          </pre>
          <button
            type="button"
            onClick={() => copySecret(state.secret)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-neutral-700 to-neutral-900 text-white px-5 py-3 text-sm font-medium hover:opacity-90 transition"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy secret
              </>
            )}
          </button>
        </>
      ) : null}

      {state.status === "gone" || state.status === "error" ? (
        <>
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tighter text-black mb-3">
            {state.status === "gone" ? "Nothing left to show" : "Something failed"}
          </h1>
          <p className="text-black/60 mb-8">{state.message}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-neutral-700 to-neutral-900 text-white px-5 py-3 text-sm font-medium hover:opacity-90 transition"
          >
            Create a new link
          </Link>
        </>
      ) : null}
    </div>
  );
}
