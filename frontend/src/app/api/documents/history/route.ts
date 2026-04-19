import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { listDocumentsByUser } from "@/lib/server/repository";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
    }

    const documents = (await listDocumentsByUser(session.user.id))
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
