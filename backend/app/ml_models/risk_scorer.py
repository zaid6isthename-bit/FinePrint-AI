import logging
from transformers import pipeline

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
        if self.scorer is None:
            logger.info(f"Loading Risk Scorer ({self.model_name})...")
            self.scorer = pipeline("sentiment-analysis", model=self.model_name)
            logger.info("Scorer loaded.")

    def calculate_severity(self, clause_text: str, clause_type: str) -> float:
        """
        Calculates a risk severity score (0.0 to 1.0) based on sentiment and clause type.
        """
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
