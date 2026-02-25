import re
from typing import List

class DocumentSplitter:
    @staticmethod
    def split_into_clauses(text: str) -> List[str]:
        """
        Basic regex heuristic to split legal text into usable segments (clauses).
        This breaks on double newlines, numbering (e.g., "1.", "1.1"), 
        or common legal section headers ("ARTICLE I", "Section 1").
        """
        # Split by double newline or numbering heuristic
        # Regex looks for Number-dot-space at start of line
        segments = re.split(r'\n\s*\d+\.\s+', text)
        
        clauses = []
        for seq in segments:
            # Further split by smaller sub-sections or double carriage returns
            sub_sections = re.split(r'\n\n', seq)
            for sub in sub_sections:
                clean_sub = sub.strip()
                # Only keep substantial clauses (e.g., > 10 words)
                if len(clean_sub.split()) > 10:
                    clauses.append(clean_sub)
                    
        return clauses
