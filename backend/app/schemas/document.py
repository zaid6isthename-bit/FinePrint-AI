from pydantic import BaseModel
from typing import List, Optional

class ClauseResponse(BaseModel):
    id: str
    originalText: str
    simplifiedText: Optional[str]
    clauseType: str
    riskLevel: str
    severityScore: float

    class Config:
        from_attributes = True

class DocumentResponse(BaseModel):
    id: str
    title: str
    filename: str
    uploadDate: str
    riskScore: Optional[float]
    status: str
    negotiationMsg: Optional[str]
    clauses: Optional[List[ClauseResponse]] = []

    class Config:
        from_attributes = True
