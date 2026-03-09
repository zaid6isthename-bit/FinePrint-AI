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
            import time
            start_time = time.time()
            logger.info(f"Starting neural audit for document {doc_id}")
            
            # 1. Extract and Clean Text
            extract_start = time.time()
            raw_text = PDFExtractor.extract_text(file_bytes)
            clean_text = PDFExtractor.clean_text(raw_text)
            logger.info(f"Text extraction complete in {time.time() - extract_start:.2f}s")
            
            # 2. Split into Clauses
            split_start = time.time()
            raw_clauses = DocumentSplitter.split_into_clauses(clean_text)
            logger.info(f"Document split into {len(raw_clauses)} segments in {time.time() - split_start:.2f}s")
            
            processed_clauses = []
            
            # 3. Analyze each clause
            analysis_start = time.time()
            for i, text in enumerate(raw_clauses):
                clause_type, conf = clause_classifier.classify_clause(text)
                severity = risk_scorer.calculate_severity(text, clause_type)
                risk_level = risk_scorer.get_risk_level_string(severity)
                
                simplified = None
                if severity > 0.3:
                    simplified = legal_simplifier.simplify_clause(text)
                
                clause_data = {
                    "documentId": doc_id,
                    "originalText": text[:4000],
                    "simplifiedText": simplified,
                    "clauseType": clause_type,
                    "riskLevel": risk_level,
                    "severityScore": float(severity)
                }
                
                await db.clause.create(data=clause_data)
                processed_clauses.append(clause_data)
                
                if (i + 1) % 5 == 0:
                    logger.info(f"Processed {i+1}/{len(raw_clauses)} clauses for {doc_id}...")

            logger.info(f"Forensic analysis complete in {time.time() - analysis_start:.2f}s")
            
            # 4. Calculate final risk score and generate message
            analyzer_start = time.time()
            final_score = DocumentRiskAnalyzer.calculate_total_risk_score(processed_clauses)
            neg_msg = DocumentRiskAnalyzer.generate_negotiation_message(final_score, processed_clauses)
            logger.info(f"Risk synthesis complete in {time.time() - analyzer_start:.2f}s")
            
            # 5. Update Document status
            await db.document.update(
                where={"id": doc_id},
                data={
                    "status": "COMPLETED",
                    "riskScore": final_score,
                    "negotiationMsg": neg_msg
                }
            )
            total_duration = time.time() - start_time
            logger.info(f"Audit finalized for {doc_id}. Score: {final_score}. Total time: {total_duration:.2f}s")

        except Exception as e:
            error_message = str(e)
            logger.error(f"FATAL ERROR during audit of {doc_id}: {error_message}", exc_info=True)
            await db.document.update(
                where={"id": doc_id},
                data={
                    "status": "FAILED",
                    "errorMessage": error_message
                }
            )
