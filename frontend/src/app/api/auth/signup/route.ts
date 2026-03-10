import { NextResponse } from "next/server";
import { createEmailUser, findUserByEmail } from "@/lib/server/repository";

export async function POST(request: Request) {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();

    if (!email || !password) {
        return NextResponse.json({ detail: "Email and password are required." }, { status: 400 });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        return NextResponse.json({ detail: "Email already registered" }, { status: 400 });
    }

    const user = await createEmailUser({
        email,
        password,
        firstName,
        lastName,
    });

    return NextResponse.json(user, { status: 201 });
}
