import { NextResponse } from "next/server";
import { decryptText } from "@/lib/crypto";
import { burnSecret } from "@/lib/db";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!UUID_RE.test(id)) {
      return NextResponse.json({ error: "Invalid secret link." }, { status: 400 });
    }

    const row = await burnSecret(id);

    if (!row) {
      return NextResponse.json(
        {
          error: "This secret has already been viewed or no longer exists.",
          burned: true,
        },
        { status: 410 },
      );
    }

    const plaintext = decryptText({
      encryptedPayload: row.encrypted_payload,
      iv: row.iv,
      authTag: row.auth_tag,
    });

    return NextResponse.json({
      secret: plaintext,
      burned: true,
    });
  } catch (error) {
    console.error("Failed to burn secret:", error);
    return NextResponse.json(
      { error: "Unable to retrieve secret." },
      { status: 500 },
    );
  }
}
