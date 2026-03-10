import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { readDb } from "@/lib/server/store";

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
    }

    const { id } = await context.params;
    const db = await readDb();
    const document = db.documents.find((entry) => entry.id === id);

    if (!document) {
        return NextResponse.json({ detail: `Document ${id} not found in vault.` }, { status: 404 });
    }

    if (document.userId !== session.user.id) {
        return NextResponse.json({ detail: "Access denied. This instrument belongs to another operative." }, { status: 403 });
    }

    return NextResponse.json(document);
}
