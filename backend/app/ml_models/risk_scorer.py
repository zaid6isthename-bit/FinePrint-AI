import logging
# transformers is lazily imported inside load_model
from app.core.config import settings

logger = logging.getLogger(__name__)

class RiskScorer:
    def __init__(self):
        # We can use sentiment analysis fine-tuned on financial/legal texts, 
        # or a general one to estimate severity of terms.
        self.model_name = "nlptown/bert-base-multilingual-uncased-sentiment"
        self.scorer = None
        
        # Define risk levels based on clause types
        self.risk_multiplier = {
            "Hidden Charges": 1.5,
            "Auto Renewal": 1.2,
            "Data Sharing Consent": 1.8,
            "Arbitration Clauses": 1.3,
            "Foreclosure Penalties": 2.0,
            "Late Payment Fees": 1.1,
            "Termination Clauses": 1.4,
            "Standard Terms": 0.5
        }

    def load_model(self):
        if settings.LIGHTWEIGHT_ANALYSIS:
            logger.info("LIGHTWEIGHT_ANALYSIS enabled. Using heuristic risk scorer.")
            return
        if self.scorer is None:
            logger.info(f"Loading Risk Scorer ({self.model_name})...")
            from transformers import pipeline
            self.scorer = pipeline("sentiment-analysis", model=self.model_name)
            logger.info("Scorer loaded.")

    def heuristic_score(self, clause_text: str, clause_type: str) -> float:
        text = clause_text.lower()
        severity = 0.18

        risky_terms = {
            "high": ["sole discretion", "without notice", "non-refundable", "binding", "penalty", "liable"],
            "medium": ["may", "automatically", "consent", "share", "terminate", "fee", "interest"],
        }

        severity += 0.18 * sum(1 for term in risky_terms["medium"] if term in text)
        severity += 0.22 * sum(1 for term in risky_terms["high"] if term in text)

        multiplier = self.risk_multiplier.get(clause_type, 1.0)
        final_severity = min(severity * multiplier, 1.0)
        return round(final_severity, 2)

    def calculate_severity(self, clause_text: str, clause_type: str) -> float:
        """
        Calculates a risk severity score (0.0 to 1.0) based on sentiment and clause type.
        """
        if settings.LIGHTWEIGHT_ANALYSIS:
            return self.heuristic_score(clause_text, clause_type)

        if self.scorer is None:
            self.load_model()
            
        result = self.scorer(clause_text[:512])[0] # Limit to 512 tokens
        
        # nlptown model returns '1 star' to '5 stars'. 
        # 1 star = very negative (HIGH RISK)
        # 5 star = very positive (LOW RISK)
        star_rating = int(result['label'][0])
        
        # Base severity (1.0 for 1 star, 0.2 for 5 star)
        base_severity = (6 - star_rating) * 0.2
        
        # Apply multiplier based on clause type
        multiplier = self.risk_multiplier.get(clause_type, 1.0)
        
        final_severity = min(base_severity * multiplier, 1.0)
        return round(final_severity, 2)

    def batch_calculate_severity(self, clauses: list, types: list) -> list:
        if settings.LIGHTWEIGHT_ANALYSIS:
            return [self.heuristic_score(clause, types[i]) for i, clause in enumerate(clauses)]

        if self.scorer is None:
            self.load_model()
        
        if not clauses:
            return []
            
        # Limit texts to 512 tokens/chars for efficiency
        truncated = [c[:512] for c in clauses]
        results = self.scorer(truncated, batch_size=8)
        
        severities = []
        for i, res in enumerate(results):
            star_rating = int(res['label'][0])
            base_severity = (6 - star_rating) * 0.2
            multiplier = self.risk_multiplier.get(types[i], 1.0)
            final_severity = min(base_severity * multiplier, 1.0)
            severities.append(round(final_severity, 2))
            
        return severities
        
    def get_risk_level_string(self, severity_score: float) -> str:
        if severity_score > 0.8:
            return "CRITICAL"
        elif severity_score > 0.5:
            return "HIGH"
        elif severity_score > 0.3:
            return "MEDIUM"
        else:
            return "LOW"

# Singleton instance
risk_scorer = RiskScorer()
