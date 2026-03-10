import { prisma } from "@/lib/server/db";
import { createId, createPasswordHash, readDb, sanitizeUser, writeDb } from "@/lib/server/store";

type SocialUserInput = {
  email: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  provider: string;
};

type EmailUserInput = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

type ClauseInput = {
  id: string;
  clauseType: string;
  riskLevel: string;
  severityScore: number;
  originalText: string;
  simplifiedText: string | null;
};

type DocumentInput = {
  title: string;
  filename: string;
  riskScore: number;
  negotiationMsg: string;
  userId: string;
  clauses: ClauseInput[];
};

export async function findUserByEmail(email: string) {
  const normalizedEmail = email.toLowerCase();

  if (prisma) {
    return prisma.user.findUnique({ where: { email: normalizedEmail } });
  }

  const db = await readDb();
  return db.users.find((user) => user.email === normalizedEmail) ?? null;
}

export async function createEmailUser(input: EmailUserInput) {
  const email = input.email.toLowerCase();
  const passwordHash = createPasswordHash(input.password);

  if (prisma) {
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: input.firstName || undefined,
        lastName: input.lastName || undefined,
        provider: "credentials",
      },
    });

    return sanitizeUser(user);
  }

  const db = await readDb();
  const user = {
    id: createId(),
    email,
    passwordHash,
    firstName: input.firstName || undefined,
    lastName: input.lastName || undefined,
    provider: "credentials",
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);
  await writeDb(db);
  return sanitizeUser(user);
}

export async function upsertSocialUser(input: SocialUserInput) {
  const email = input.email.toLowerCase();

  if (prisma) {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        firstName: input.firstName || undefined,
        lastName: input.lastName || undefined,
        image: input.image || undefined,
        provider: input.provider,
      },
      create: {
        email,
        firstName: input.firstName || undefined,
        lastName: input.lastName || undefined,
        image: input.image || undefined,
        provider: input.provider,
      },
    });

    return user;
  }

  const db = await readDb();
  const existing = db.users.find((user) => user.email === email);

  if (existing) {
    existing.firstName = input.firstName || existing.firstName;
    existing.lastName = input.lastName || existing.lastName;
    existing.image = input.image || existing.image;
    existing.provider = input.provider;
    await writeDb(db);
    return existing;
  }

  const created = {
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

export async function createCompletedDocument(input: DocumentInput) {
  if (prisma) {
    return prisma.document.create({
      data: {
        title: input.title,
        filename: input.filename,
        riskScore: input.riskScore,
        status: "COMPLETED",
        negotiationMsg: input.negotiationMsg,
        errorMessage: null,
        userId: input.userId,
        clauses: {
          create: input.clauses.map((clause) => ({
            clauseType: clause.clauseType,
            riskLevel: clause.riskLevel,
            severityScore: clause.severityScore,
            originalText: clause.originalText,
            simplifiedText: clause.simplifiedText,
          })),
        },
      },
      include: { clauses: true },
    });
  }

  const db = await readDb();
  const document = {
    id: createId(),
    title: input.title,
    filename: input.filename,
    uploadDate: new Date().toISOString(),
    status: "COMPLETED" as const,
    riskScore: input.riskScore,
    negotiationMsg: input.negotiationMsg,
    errorMessage: null,
    userId: input.userId,
    clauses: input.clauses,
  };

  db.documents.unshift(document);
  await writeDb(db);
  return document;
}

export async function listDocumentsByUser(userId: string) {
  if (prisma) {
    return prisma.document.findMany({
      where: { userId },
      orderBy: { uploadDate: "desc" },
      include: { clauses: true },
    });
  }

  const db = await readDb();
  return db.documents
    .filter((document) => document.userId === userId)
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
}

export async function getDocumentById(documentId: string) {
  if (prisma) {
    return prisma.document.findUnique({
      where: { id: documentId },
      include: { clauses: true },
    });
  }

  const db = await readDb();
  return db.documents.find((document) => document.id === documentId) ?? null;
}
