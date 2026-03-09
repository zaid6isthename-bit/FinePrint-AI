import logging
# transformers is lazily imported inside load_model

logger = logging.getLogger(__name__)

class LegalJargonSimplifier:
    def __init__(self):
        # We use a T5 model for translation/summarization tasks
        self.model_name = "t5-small"
        self.simplifier = None

    def load_model(self):
        if self.simplifier is None:
            logger.info(f"Loading Legal Simplifier ({self.model_name})...")
            # Using basic summarization pipeline as proxy for simplification
            from transformers import pipeline
            self.simplifier = pipeline("summarization", model=self.model_name)
            logger.info("Simplifier loaded.")

    def simplify_clause(self, clause_text: str) -> str:
        """
        Translates legal jargon into simple English.
        """
        if self.simplifier is None:
            self.load_model()
            
        try:
            # We prefix with summarize, as T5 expects task prefixes
            # For better results we'd fine-tune a model on plain-english translations
            input_text = "summarize: " + clause_text
            
            # Ensure text isn't too long or short
            max_len = min(150, len(clause_text.split()) + 10)
            min_len = min(30, max_len // 2)
            
            result = self.simplifier(input_text, max_length=max_len, min_length=min_len, do_sample=False)
            return result[0]['summary_text']
        except Exception as e:
            logger.error(f"Simplification error: {e}")
            return "Could not simplify this clause."

    def batch_simplify(self, clauses: list) -> list:
        if self.simplifier is None:
            self.load_model()
        
        if not clauses:
            return []
            
        try:
            inputs = ["summarize: " + c for c in clauses]
            # T5 is compute-heavy so we keep batch_size low
            results = self.simplifier(inputs, max_length=150, min_length=30, do_sample=False, batch_size=4)
            return [res['summary_text'] for res in results]
        except Exception as e:
            logger.error(f"Batch simplification error: {e}")
            return ["Could not simplify this clause."] * len(clauses)

# Singleton instance
legal_simplifier = LegalJargonSimplifier()
