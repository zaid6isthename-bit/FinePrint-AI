import { NextResponse } from "next/server";
import { createId, createPasswordHash, readDb, sanitizeUser, writeDb } from "@/lib/server/store";

export async function POST(request: Request) {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();

    if (!email || !password) {
        return NextResponse.json({ detail: "Email and password are required." }, { status: 400 });
    }

    const db = await readDb();
    const existingUser = db.users.find((user) => user.email === email);
    if (existingUser) {
        return NextResponse.json({ detail: "Email already registered" }, { status: 400 });
    }

    const user = {
        id: createId(),
        email,
        passwordHash: createPasswordHash(password),
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        createdAt: new Date().toISOString(),
    };

    db.users.push(user);
    await writeDb(db);

    return NextResponse.json(sanitizeUser(user), { status: 201 });
}
