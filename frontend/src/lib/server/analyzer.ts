import { createId, StoredClause } from "@/lib/server/store";

type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

type ClauseTemplate = {
    clauseType: string;
    riskLevel: RiskLevel;
    severityScore: number;
    originalText: string;
    simplifiedText: string;
};

const ruleTemplates: Array<{ keywords: string[]; template: ClauseTemplate }> = [
    {
        keywords: ["renew", "subscription", "term"],
        template: {
            clauseType: "Auto Renewal",
            riskLevel: "HIGH",
            severityScore: 0.74,
            originalText: "This agreement renews automatically for successive terms unless written notice is provided at least 30 days before the renewal date.",
            simplifiedText: "The contract keeps renewing on its own unless you cancel early in writing.",
        },
    },
    {
        keywords: ["data", "privacy", "share", "personal"],
        template: {
            clauseType: "Data Sharing Consent",
            riskLevel: "CRITICAL",
            severityScore: 0.91,
            originalText: "You authorize the company and its affiliates to share, process, and retain customer information for analytics, advertising, and service improvement purposes.",
            simplifiedText: "Your data can be shared broadly across related companies and used for tracking or marketing.",
        },
    },
    {
        keywords: ["fee", "charge", "payment", "late"],
        template: {
            clauseType: "Hidden Charges",
            riskLevel: "MEDIUM",
            severityScore: 0.56,
            originalText: "Administrative charges, convenience fees, and service adjustments may be applied without additional notice and are due immediately when assessed.",
            simplifiedText: "Extra fees can be added later without much warning.",
        },
    },
    {
        keywords: ["arbitration", "dispute", "claim"],
        template: {
            clauseType: "Arbitration Clauses",
            riskLevel: "HIGH",
            severityScore: 0.69,
            originalText: "Any dispute arising under this agreement shall be resolved exclusively by binding arbitration and not in a court of law.",
            simplifiedText: "If there is a dispute, you may have to go to arbitration instead of court.",
        },
    },
    {
        keywords: ["terminate", "termination", "cancel"],
        template: {
            clauseType: "Termination Clauses",
            riskLevel: "MEDIUM",
            severityScore: 0.48,
            originalText: "The provider may terminate this agreement immediately for convenience, while customer termination rights are subject to a 60-day notice period.",
            simplifiedText: "The provider can end the contract faster than you can.",
        },
    },
];

const defaultClauses: ClauseTemplate[] = [
    {
        clauseType: "Standard Terms",
        riskLevel: "LOW",
        severityScore: 0.22,
        originalText: "The agreement contains a standard set of obligations, service definitions, and payment administration language.",
        simplifiedText: "Most of the contract is routine, but you should still review the business terms carefully.",
    },
    {
        clauseType: "Termination Clauses",
        riskLevel: "MEDIUM",
        severityScore: 0.44,
        originalText: "Termination rights favor the provider and may reduce your flexibility if the relationship changes quickly.",
        simplifiedText: "Ending the agreement may be harder for you than for the other side.",
    },
    {
        clauseType: "Data Sharing Consent",
        riskLevel: "HIGH",
        severityScore: 0.71,
        originalText: "Operational data rights are broad enough that customer information may be reused beyond the immediate service workflow.",
        simplifiedText: "Your information may be used more broadly than you expect.",
    },
];

function buildNegotiationMessage(title: string, clauses: StoredClause[]) {
    const highest = [...clauses]
        .sort((a, b) => b.severityScore - a.severityScore)
        .slice(0, 3)
        .map((clause) => `- ${clause.clauseType}: ${clause.simplifiedText ?? clause.originalText}`)
        .join("\n");

    return [
        `Hello, I reviewed ${title} and would like to discuss a few provisions before signing:`,
        highest,
        "Could we narrow these terms or add clearer limits so the agreement is more balanced?",
    ].join("\n\n");
}

export function analyzeDocument(title: string, filename: string) {
    const haystack = `${title} ${filename}`.toLowerCase();
    const matched = ruleTemplates
        .filter((rule) => rule.keywords.some((keyword) => haystack.includes(keyword)))
        .map((rule) => rule.template);

    const baseTemplates = matched.length > 0 ? matched : defaultClauses;
    const uniqueTemplates = Array.from(new Map(baseTemplates.map((entry) => [entry.clauseType, entry])).values());

    const clauses: StoredClause[] = uniqueTemplates.map((template) => ({
        id: createId(),
        clauseType: template.clauseType,
        riskLevel: template.riskLevel,
        severityScore: template.severityScore,
        originalText: template.originalText,
        simplifiedText: template.simplifiedText,
    }));

    const average = clauses.reduce((sum, clause) => sum + clause.severityScore, 0) / Math.max(clauses.length, 1);
    const riskScore = Math.min(100, Math.round(average * 100));

    return {
        clauses,
        riskScore,
        negotiationMsg: buildNegotiationMessage(title, clauses),
    };
}
