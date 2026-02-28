import logging
# transformers is lazily imported inside load_model to speed up server boot

logger = logging.getLogger(__name__)

class LegalClauseClassifier:
    def __init__(self):
        # We use zero-shot classification for flexibility in clause categorization
        self.model_name = "facebook/bart-large-mnli"
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

    def load_model(self):
        if self.classifier is None:
            logger.info(f"Loading Legal Clause Classifier ({self.model_name})...")
            from transformers import pipeline
            self.classifier = pipeline("zero-shot-classification", model=self.model_name)
            logger.info("Classifier loaded.")

    def classify_clause(self, clause_text: str):
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

# Singleton instance
clause_classifier = LegalClauseClassifier()
