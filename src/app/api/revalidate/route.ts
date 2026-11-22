import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook: called on every publish/unpublish/delete. Expires all cached
 * Sanity queries so the next visit renders the new content.
 * The webhook is signed with SANITY_REVALIDATE_SECRET (server env only).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { message: "SANITY_REVALIDATE_SECRET no configurado" },
      { status: 500 }
    );
  }
  try {
    // `true` waits for Sanity's eventual consistency before we refetch.
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(
      req,
      secret,
      true
    );
    if (!isValidSignature) {
      return NextResponse.json({ message: "Firma inválida" }, { status: 401 });
    }
    revalidateTag("sanity", { expire: 0 });
    return NextResponse.json({ revalidated: true, type: body?._type ?? null });
  } catch (err) {
    console.error("revalidate", err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
