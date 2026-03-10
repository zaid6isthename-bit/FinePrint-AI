import { NextResponse } from "next/server";
import { createPasswordHash, sanitizeUser } from "@/lib/server/store";
import { findUserByEmail } from "@/lib/server/repository";

export async function POST(request: Request) {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
        return NextResponse.json({ detail: "Email and password are required." }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user || user.passwordHash !== createPasswordHash(password)) {
        return NextResponse.json({ detail: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({
        user: sanitizeUser(user),
    });
}
