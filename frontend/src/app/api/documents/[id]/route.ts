import { NextResponse } from "next/server";
import { getUserFromAuthHeader, readDb } from "@/lib/server/store";

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const user = await getUserFromAuthHeader(request.headers.get("authorization"));
    if (!user) {
        return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
    }

    const { id } = await context.params;
    const db = await readDb();
    const document = db.documents.find((entry) => entry.id === id);

    if (!document) {
        return NextResponse.json({ detail: `Document ${id} not found in vault.` }, { status: 404 });
    }

    if (document.userId !== user.id) {
        return NextResponse.json({ detail: "Access denied. This instrument belongs to another operative." }, { status: 403 });
    }

    return NextResponse.json(document);
}
