import asyncio
from fastapi import UploadFile
from app.db.prisma import db
from app.ml_models.text_extractor import PDFExtractor
from app.ml_models.document_splitter import DocumentSplitter
from app.ml_models.clause_classifier import clause_classifier
from app.ml_models.risk_scorer import risk_scorer
from app.ml_models.simplifier import legal_simplifier
from app.ml_models.risk_analyzer import DocumentRiskAnalyzer
import logging

logger = logging.getLogger(__name__)

class DocumentService:
    @staticmethod
    async def process_document(doc_id: str, file_bytes: bytes):
        """
        Background task to process the uploaded document through the ML pipeline.
        """
        try:
            logger.info(f"Starting processing for document {doc_id}")
            
            # 1. Extract and Clean Text
            raw_text = PDFExtractor.extract_text(file_bytes)
            clean_text = PDFExtractor.clean_text(raw_text)
            
            # 2. Split into Clauses
            raw_clauses = DocumentSplitter.split_into_clauses(clean_text)
            
            processed_clauses = []
            
            # 3. Analyze each clause
            for text in raw_clauses:
                # Classify
                clause_type, conf = clause_classifier.classify_clause(text)
                
                # If it's highly standard or irrelevant, we might optionally skip or score low
                # Score severity
                severity = risk_scorer.calculate_severity(text, clause_type)
                risk_level = risk_scorer.get_risk_level_string(severity)
                
                # Simplify (only if risk is medium or higher to save compute)
                simplified = None
                if severity > 0.3:
                    simplified = legal_simplifier.simplify_clause(text)
                
                clause_data = {
                    "documentId": doc_id,
                    "originalText": text[:4000],  # Limit length for DB safety
                    "simplifiedText": simplified,
                    "clauseType": clause_type,
                    "riskLevel": risk_level,
                    "severityScore": float(severity)
                }
                
                # Save clause to DB
                new_clause = await prisma.clause.create(data=clause_data)
                processed_clauses.append(clause_data)

            # 4. Calculate final risk score and generate message
            final_score = DocumentRiskAnalyzer.calculate_total_risk_score(processed_clauses)
            neg_msg = DocumentRiskAnalyzer.generate_negotiation_message(final_score, processed_clauses)
            
            # 5. Update Document status
            await prisma.document.update(
                where={"id": doc_id},
                data={
                    "status": "COMPLETED",
                    "riskScore": final_score,
                    "negotiationMsg": neg_msg
                }
            )
            logger.info(f"Finished processing document {doc_id}. Risk Score: {final_score}")

        except Exception as e:
            logger.error(f"Error processing document {doc_id}: {e}")
            await prisma.document.update(
                where={"id": doc_id},
                data={"status": "FAILED"}
            )
