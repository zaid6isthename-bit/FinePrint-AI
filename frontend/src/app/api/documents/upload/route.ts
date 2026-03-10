import { NextResponse } from "next/server";
import { analyzeDocument } from "@/lib/server/analyzer";
import { createId, getUserFromAuthHeader, readDb, writeDb } from "@/lib/server/store";

export async function POST(request: Request) {
    const user = await getUserFromAuthHeader(request.headers.get("authorization"));
    if (!user) {
        return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
    }

    const url = new URL(request.url);
    const title = url.searchParams.get("title")?.trim();
    if (!title) {
        return NextResponse.json({ detail: "Title is required." }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
        return NextResponse.json({ detail: "A PDF file is required." }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
        return NextResponse.json({ detail: "Only PDF files are supported." }, { status: 400 });
    }

    const analysis = analyzeDocument(title, file.name);
    const now = new Date().toISOString();
    const document = {
        id: createId(),
        title,
        filename: file.name,
        uploadDate: now,
        status: "COMPLETED" as const,
        riskScore: analysis.riskScore,
        negotiationMsg: analysis.negotiationMsg,
        errorMessage: null,
        userId: user.id,
        clauses: analysis.clauses,
    };

    const db = await readDb();
    db.documents.unshift(document);
    await writeDb(db);

    return NextResponse.json(document, { status: 200 });
}
