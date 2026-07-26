import { NextResponse } from "next/server";
import { pruneExpiredSecrets } from "@/lib/db";

/**
 * Optional maintenance endpoint for TTL cleanup.
 * Protect with CRON_SECRET when exposed publicly.
 */
export async function POST(request: Request) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const auth = request.headers.get("authorization");
      if (auth !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
      }
    }

    const deleted = await pruneExpiredSecrets();
    return NextResponse.json({ deleted });
  } catch (error) {
    console.error("Failed to prune secrets:", error);
    return NextResponse.json(
      { error: "Unable to prune secrets." },
      { status: 500 },
    );
  }
}
