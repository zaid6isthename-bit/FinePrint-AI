import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { analyzeDocument } from "@/lib/server/analyzer";
import { createCompletedDocument } from "@/lib/server/repository";
import { detectParties } from "@/lib/server/partyDetection";
import { PDFParse } from "pdf-parse";

async function extractPdfText(fileBytes: Uint8Array) {
    try {
        const parser = new PDFParse({ data: fileBytes });
        const result = await parser.getText();
        await parser.destroy();
        return result.text?.trim() || "";
    } catch {
        return "";
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
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

    const fileBytes = new Uint8Array(await file.arrayBuffer());
    const extractedText = await extractPdfText(fileBytes);
    const userName = [session.user.firstName, session.user.lastName].filter(Boolean).join(" ") || session.user.name || session.user.email;
    const parties = detectParties({
        title,
        filename: file.name,
        fileBytes,
        extractedText,
        userName,
    });
    const analysis = analyzeDocument(title, file.name, parties);
    const document = await createCompletedDocument({
        title,
        filename: file.name,
        riskScore: analysis.riskScore,
        negotiationMsg: analysis.negotiationMsg,
        userId: session.user.id,
        userName: analysis.userName,
        clientName: analysis.clientName,
        clauses: analysis.clauses,
    });

    return NextResponse.json(document, { status: 200 });
}
