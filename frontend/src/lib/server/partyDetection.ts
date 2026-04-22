const GENERIC_TITLE_TOKENS = new Set([
  "agreement",
  "amendment",
  "appendix",
  "client",
  "company",
  "contract",
  "customer",
  "document",
  "for",
  "master",
  "msa",
  "nda",
  "proposal",
  "service",
  "services",
  "statement",
  "sow",
  "term",
  "terms",
  "vendor",
  "with",
]);

function sanitizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function toDisplayName(value: string | null | undefined, fallback: string) {
  const cleaned = sanitizeWhitespace(value || "");
  return cleaned || fallback;
}

function normalizeCandidate(value: string) {
  return sanitizeWhitespace(
    value
      .replace(/[_-]+/g, " ")
      .replace(/[|/\\]/g, " ")
      .replace(/\b(inc|llc|ltd|corp|corporation|company|co)\b\.?/gi, (match) =>
        match.toUpperCase()
      )
      .replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9.&,'() -]+$/g, "")
  );
}

function looksLikeName(value: string) {
  const words = value.split(/\s+/).filter(Boolean);
  if (words.length === 0 || words.length > 8) {
    return false;
  }

  const meaningfulWords = words.filter((word) => !GENERIC_TITLE_TOKENS.has(word.toLowerCase()));
  if (meaningfulWords.length === 0) {
    return false;
  }

  return meaningfulWords.some((word) => /[A-Z]/.test(word[0] || "") || /^[A-Z0-9&.'()-]+$/.test(word));
}

function pickTitleCandidate(title: string, filename: string) {
  const source = normalizeCandidate(title || filename.replace(/\.pdf$/i, ""));
  const splitCandidates = source
    .split(/\b(?:and|for|with|vs|versus|between)\b|[-|]/i)
    .map((part) => normalizeCandidate(part))
    .filter(Boolean);

  const explicit = splitCandidates.find((candidate) => looksLikeName(candidate));
  if (explicit) {
    return explicit;
  }

  const compact = source
    .split(/\s+/)
    .filter((token) => !GENERIC_TITLE_TOKENS.has(token.toLowerCase()))
    .slice(0, 5)
    .join(" ");

  return looksLikeName(compact) ? compact : null;
}

function extractLikelyPdfText(fileBytes: Uint8Array) {
  const decoded = new TextDecoder("latin1").decode(fileBytes);
  const printable = decoded.replace(/[\u0000-\u001F]+/g, " ");
  const literalStrings = Array.from(printable.matchAll(/\(([^()]{3,120})\)/g))
    .map((match) => sanitizeWhitespace(match[1] || ""))
    .filter((segment) => /[A-Za-z]{3,}/.test(segment));

  return sanitizeWhitespace(`${printable} ${literalStrings.join(" ")}`);
}

function extractNamedPartyFromText(text: string) {
  const patterns = [
    /\b(?:client|customer|company|provider|vendor|supplier)\s*[:\-]\s*([A-Z][A-Za-z0-9&.,'() -]{2,80})/i,
    /\bbetween\s+[A-Z][A-Za-z0-9&.,'() -]{2,80}\s+and\s+([A-Z][A-Za-z0-9&.,'() -]{2,80})/i,
    /\bthis\s+(?:agreement|contract)\s+is\s+between\s+[A-Z][A-Za-z0-9&.,'() -]{2,80}\s+and\s+([A-Z][A-Za-z0-9&.,'() -]{2,80})/i,
    /\b(?:for|on behalf of)\s+([A-Z][A-Za-z0-9&.,'() -]{2,80})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    const candidate = normalizeCandidate(match?.[1] || "");
    if (candidate && looksLikeName(candidate)) {
      return candidate;
    }
  }

  return null;
}

export type DetectedParties = {
  userName: string;
  clientName: string | null;
};

export function detectParties(input: {
  title: string;
  filename: string;
  fileBytes?: Uint8Array;
  userName?: string | null;
}) {
  const userName = toDisplayName(input.userName, "The reviewing party");
  const textCandidate = input.fileBytes ? extractNamedPartyFromText(extractLikelyPdfText(input.fileBytes)) : null;
  const titleCandidate = pickTitleCandidate(input.title, input.filename);
  const clientName = [textCandidate, titleCandidate].find(
    (candidate) =>
      candidate &&
      candidate.toLowerCase() !== userName.toLowerCase() &&
      candidate.toLowerCase() !== "the reviewing party"
  ) || null;

  return {
    userName,
    clientName,
  } satisfies DetectedParties;
}
