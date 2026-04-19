from typing import List, Dict

class DocumentRiskAnalyzer:
    @staticmethod
    def calculate_total_risk_score(clauses: List[Dict]) -> float:
        """
        Calculates total risk score (0-100) based on formula:
        - Number of risky clauses
        - Severity level
        - Financial impact (inferred from clause type)
        """
        total_score = 0
        total_weight = 0
        
        for c in clauses:
            severity = c.get('severityScore', 0)
            
            # Simple weighting mechanism
            if severity > 0.8:  # CRITICAL
                weight = 5
            elif severity > 0.5: # HIGH
                weight = 3
            elif severity > 0.3: # MEDIUM
                weight = 1
            else: # LOW
                weight = 0.1
                
            total_score += (severity * weight)
            total_weight += weight
            
        if total_weight == 0:
            return 0.0
            
        # Normalize to 0-100 scale (capped at 100)
        final_score = (total_score / total_weight) * 100
        return round(min(final_score, 100), 2)
    
    @staticmethod
    def generate_negotiation_message(total_score: float, risky_clauses: List[Dict], tone: str = "professional") -> str:
        """
        Generates a negotiation draft based on identified risks.
        """
        if not risky_clauses:
            return "The agreement looks standard. No major negotiation points identified."
            
        top_risks = sorted(risky_clauses, key=lambda x: x['severityScore'], reverse=True)[:3]
        
        points = []
        for risk in top_risks:
            points.append(f"- Regarding '{risk['clauseType']}': {risk['simplifiedText']}")
            
        points_str = "\n".join(points)
        
        if tone == "casual":
            msg = (
                f"Hi there,\n\nI reviewed the contract and have a few concerns, mostly around these points:\n\n"
                f"{points_str}\n\nCould we please discuss modifying these sections? Let me know your thoughts.\n\nThanks!"
            )
        else:
            msg = (
                f"Dear [Name],\n\nUpon reviewing the agreement (Risk Score: {total_score}/100), "
                f"I would like to request clarification and potential revision on the following highly restrictive clauses:\n\n"
                f"{points_str}\n\nPlease let me know when we can discuss these amendments.\n\nSincerely,\n[Your Name]"
            )
        return msg
