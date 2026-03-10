import { NextResponse } from "next/server";
import { getUserFromAuthHeader, readDb } from "@/lib/server/store";

export async function GET(request: Request) {
    const user = await getUserFromAuthHeader(request.headers.get("authorization"));
    if (!user) {
        return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
    }

    const db = await readDb();
    const documents = db.documents
        .filter((document) => document.userId === user.id)
        .map((document) => ({
            id: document.id,
            title: document.title,
            filename: document.filename,
            uploadDate: document.uploadDate,
            status: document.status,
            riskScore: document.riskScore,
            negotiationMsg: document.negotiationMsg,
            errorMessage: document.errorMessage,
        }));

    return NextResponse.json(documents);
}
