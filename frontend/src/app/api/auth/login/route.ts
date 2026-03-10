import { NextResponse } from "next/server";
import { createPasswordHash, createToken, readDb, sanitizeUser, writeDb } from "@/lib/server/store";

export async function POST(request: Request) {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
        return NextResponse.json({ detail: "Email and password are required." }, { status: 400 });
    }

    const db = await readDb();
    const user = db.users.find((entry) => entry.email === email);
    if (!user || user.passwordHash !== createPasswordHash(password)) {
        return NextResponse.json({ detail: "Invalid credentials" }, { status: 401 });
    }

    const token = createToken();
    db.sessions = db.sessions.filter((session) => session.userId !== user.id);
    db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
    await writeDb(db);

    return NextResponse.json({
        access_token: token,
        token_type: "bearer",
        user: sanitizeUser(user),
    });
}
