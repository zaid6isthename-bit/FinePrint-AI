import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export type StoredUser = {
    id: string;
    email: string;
    passwordHash?: string;
    firstName?: string;
    lastName?: string;
    provider?: string;
    image?: string;
    createdAt: string;
};

export type StoredClause = {
    id: string;
    clauseType: string;
    riskLevel: string;
    severityScore: number;
    originalText: string;
    simplifiedText: string | null;
};

export type StoredDocument = {
    id: string;
    title: string;
    filename: string;
    uploadDate: string;
    status: "PROCESSING" | "COMPLETED" | "FAILED";
    riskScore: number | null;
    negotiationMsg: string | null;
    errorMessage: string | null;
    userId: string;
    clauses: StoredClause[];
};

export type StoredSession = {
    token: string;
    userId: string;
    createdAt: string;
};

type DatabaseShape = {
    users: StoredUser[];
    documents: StoredDocument[];
    sessions: StoredSession[];
};

const dataDir = path.join(process.cwd(), ".local-data");
const dbPath = path.join(dataDir, "fineprint-db.json");

const defaultDb: DatabaseShape = {
    users: [],
    documents: [],
    sessions: [],
};

async function ensureDbFile() {
    await mkdir(dataDir, { recursive: true });
    try {
        await readFile(dbPath, "utf8");
    } catch {
        await writeFile(dbPath, JSON.stringify(defaultDb, null, 2), "utf8");
    }
}

export async function readDb(): Promise<DatabaseShape> {
    await ensureDbFile();
    const raw = await readFile(dbPath, "utf8");
    return JSON.parse(raw) as DatabaseShape;
}

export async function writeDb(db: DatabaseShape) {
    await ensureDbFile();
    await writeFile(dbPath, JSON.stringify(db, null, 2), "utf8");
}

export function sanitizeUser(user: StoredUser) {
    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
    };
}

export function createPasswordHash(password: string) {
    return crypto.createHash("sha256").update(password).digest("hex");
}

export function createToken() {
    return crypto.randomUUID();
}

export function createId() {
    return crypto.randomUUID();
}

export async function getUserFromAuthHeader(authHeader: string | null) {
    if (!authHeader?.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.slice("Bearer ".length);
    const db = await readDb();
    const session = db.sessions.find((entry) => entry.token === token);
    if (!session) {
        return null;
    }

    return db.users.find((user) => user.id === session.userId) ?? null;
}

export async function findUserByEmail(email: string) {
    const db = await readDb();
    return db.users.find((user) => user.email === email.toLowerCase()) ?? null;
}

export async function upsertOAuthUser(input: {
    email: string;
    firstName?: string;
    lastName?: string;
    image?: string;
    provider: string;
}) {
    const db = await readDb();
    const email = input.email.toLowerCase();
    const existing = db.users.find((user) => user.email === email);

    if (existing) {
        existing.firstName = input.firstName || existing.firstName;
        existing.lastName = input.lastName || existing.lastName;
        existing.image = input.image || existing.image;
        existing.provider = input.provider;
        await writeDb(db);
        return existing;
    }

    const created: StoredUser = {
        id: createId(),
        email,
        firstName: input.firstName,
        lastName: input.lastName,
        image: input.image,
        provider: input.provider,
        createdAt: new Date().toISOString(),
    };

    db.users.push(created);
    await writeDb(db);
    return created;
}
