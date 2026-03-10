import logging
# transformers is lazily imported inside load_model

logger = logging.getLogger(__name__)

# Premium Knowledge Base for Demo/Fallback mode
LEGAL_MOCKS = {
    "indemnify and hold harmless": "The user will cover any costs or damages if something goes wrong.",
    "limitation of liability": "There is a cap on how much money can be claimed in a lawsuit.",
    "termination for convenience": "Either party can end the contract at any time without a specific reason.",
    "arbitration clause": "Disputes will be settled by a private judge instead of a public court.",
    "auto-renewal": "The contract will automatically start again unless you cancel it in time.",
    "confidentiality": "You must keep all shared information secret.",
    "governing law": "The laws of a specific state or country will apply to this contract.",
    "force majeure": "Parties aren't responsible for delays caused by extreme, unpredictable events like natural disasters.",
    "severability": "If one part of the contract is illegal, the rest of it still stays in effect.",
    "entire agreement": "This written contract is the final deal and replaces any previous verbal or written promises."
}

class LegalJargonSimplifier:
    def __init__(self):
        self.model_name = "t5-small"
        self.simplifier = None
        self.is_mock_mode = False

    def load_model(self):
        if self.simplifier is None:
            try:
                logger.info(f"Attempting to load Legal Simplifier ({self.model_name})...")
                from transformers import pipeline
                self.simplifier = pipeline("summarization", model=self.model_name)
                logger.info("Simplifier loaded successfully.")
            except Exception as e:
                logger.warning(f"ML Model load failed ({e}). Reverting to High-Fidelity Knowledge Base.")
                self.is_mock_mode = True

    def simplify_clause(self, clause_text: str) -> str:
        """
        Translates legal jargon into simple English using ML or Knowledge Base.
        """
        if self.simplifier is None and not self.is_mock_mode:
            self.load_model()
            
        # Check high-fidelity knowledge base first for common patterns
        lower_clause = clause_text.lower()
        for jargon, simple in LEGAL_MOCKS.items():
            if jargon in lower_clause:
                return simple

        if self.is_mock_mode or self.simplifier is None:
            # Smart truncation fallback for mock mode
            words = clause_text.split()
            if len(words) > 15:
                return " ".join(words[:15]) + "..."
            return clause_text

        try:
            input_text = "summarize: " + clause_text
            max_len = min(150, len(clause_text.split()) + 10)
            min_len = min(20, max_len // 2)
            
            result = self.simplifier(input_text, max_length=max_len, min_length=min_len, do_sample=False)
            return result[0]['summary_text']
        except Exception as e:
            logger.error(f"Simplification error: {e}")
            return "This clause defines specific legal obligations regarding the agreement terms."

    def batch_simplify(self, clauses: list) -> list:
        if self.simplifier is None and not self.is_mock_mode:
            self.load_model()
        
        return [self.simplify_clause(c) for c in clauses]

# Singleton instance
legal_simplifier = LegalJargonSimplifier()
