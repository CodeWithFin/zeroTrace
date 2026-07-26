import { NextResponse } from "next/server";
import { encryptText } from "@/lib/crypto";
import { insertSecret } from "@/lib/db";
import { getAppUrl } from "@/lib/env";

const MAX_SECRET_LENGTH = 50_000;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { secret?: unknown };
    const secret = typeof body.secret === "string" ? body.secret : "";

    if (!secret.trim()) {
      return NextResponse.json(
        { error: "Secret text is required." },
        { status: 400 },
      );
    }

    if (secret.length > MAX_SECRET_LENGTH) {
      return NextResponse.json(
        { error: `Secret must be ${MAX_SECRET_LENGTH} characters or fewer.` },
        { status: 400 },
      );
    }

    const encrypted = encryptText(secret);
    const id = await insertSecret({
      encryptedPayload: encrypted.encryptedPayload,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
    });

    const url = `${getAppUrl()}/s/${id}`;

    return NextResponse.json({ id, url });
  } catch (error) {
    console.error("Failed to create secret:", error);
    return NextResponse.json(
      { error: "Unable to create secret link." },
      { status: 500 },
    );
  }
}
