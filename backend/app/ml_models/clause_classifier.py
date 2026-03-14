import logging
# transformers is lazily imported inside load_model to speed up server boot
from app.core.config import settings

logger = logging.getLogger(__name__)

class LegalClauseClassifier:
    def __init__(self):
        # We use zero-shot classification for flexibility in clause categorization
        # Using distilbart instead of bart-large to save memory and improve speed on basic servers
        self.model_name = "valhalla/distilbart-mnli-12-1"
        self.classifier = None
        self.labels = [
            "Hidden Charges",
            "Auto Renewal",
            "Data Sharing Consent",
            "Arbitration Clauses",
            "Foreclosure Penalties",
            "Late Payment Fees",
            "Termination Clauses",
            "Standard Terms"
        ]
        self.keyword_map = {
            "Hidden Charges": ["charge", "charges", "fee", "fees", "billing", "price", "penalty"],
            "Auto Renewal": ["renew", "renewal", "subscription", "term automatically", "auto-renew"],
            "Data Sharing Consent": ["data", "privacy", "share", "personal information", "affiliate"],
            "Arbitration Clauses": ["arbitration", "dispute", "binding arbitration", "forum"],
            "Foreclosure Penalties": ["foreclosure", "collateral", "security interest"],
            "Late Payment Fees": ["late payment", "late fee", "interest", "overdue"],
            "Termination Clauses": ["terminate", "termination", "cancel", "suspend"],
            "Standard Terms": [],
        }

    def load_model(self):
        if settings.LIGHTWEIGHT_ANALYSIS:
            logger.info("LIGHTWEIGHT_ANALYSIS enabled. Using heuristic classifier.")
            return
        if self.classifier is None:
            logger.info(f"Loading Legal Clause Classifier ({self.model_name})...")
            from transformers import pipeline
            self.classifier = pipeline("zero-shot-classification", model=self.model_name)
            logger.info("Classifier loaded.")

    def heuristic_classify(self, clause_text: str):
        text = clause_text.lower()
        best_label = "Standard Terms"
        best_score = 0.35

        for label, keywords in self.keyword_map.items():
            if not keywords:
                continue

            hits = sum(1 for keyword in keywords if keyword in text)
            if hits:
                score = min(0.45 + (hits * 0.15), 0.95)
                if score > best_score:
                    best_label = label
                    best_score = score

        return best_label, round(best_score, 2)

    def classify_clause(self, clause_text: str):
        if settings.LIGHTWEIGHT_ANALYSIS:
            return self.heuristic_classify(clause_text)

        if self.classifier is None:
            self.load_model()
            
        result = self.classifier(
            clause_text,
            candidate_labels=self.labels,
            multi_label=False
        )
        
        # Return top match
        top_label = result['labels'][0]
        top_score = result['scores'][0]
        return top_label, top_score

    def batch_classify(self, clauses: list):
        """Processes multiple clauses in a single optimized pass."""
        if settings.LIGHTWEIGHT_ANALYSIS:
            return [self.heuristic_classify(clause) for clause in clauses]

        if self.classifier is None:
            self.load_model()
        
        if not clauses:
            return []

        # Batch size of 4-8 is usually optimal for CPU to avoid memory spikes
        results = self.classifier(
            clauses,
            candidate_labels=self.labels,
            multi_label=False,
            batch_size=4
        )
        
        return [(res['labels'][0], res['scores'][0]) for res in results]

# Singleton instance
clause_classifier = LegalClauseClassifier()
