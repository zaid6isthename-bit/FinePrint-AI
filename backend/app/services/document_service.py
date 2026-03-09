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
            
            # 3. Comprehensive Neural Analysis
            analysis_start = time.time()
            
            # Step 3.1: Batch Categorization
            category_start = time.time()
            classification_results = clause_classifier.batch_classify(raw_clauses)
            logger.info(f"Clause categorization complete in {time.time() - category_start:.2f}s")
            
            # Step 3.2: Batch Risk Assessment
            risk_start = time.time()
            types = [res[0] for res in classification_results]
            severity_scores = risk_scorer.batch_calculate_severity(raw_clauses, types)
            logger.info(f"Risk assessment complete in {time.time() - risk_start:.2f}s")
            
            # Step 3.3: Selective Batch Simplification
            sim_start = time.time()
            to_simplify_indices = [i for i, sev in enumerate(severity_scores) if sev > 0.3]
            simplified_texts = ["Not required"] * len(raw_clauses)
            
            if to_simplify_indices:
                texts_to_sim = [raw_clauses[i] for i in to_simplify_indices]
                sim_results = legal_simplifier.batch_simplify(texts_to_sim)
                for idx, result_text in zip(to_simplify_indices, sim_results):
                    simplified_texts[idx] = result_text
            logger.info(f"Legal simplification complete in {time.time() - sim_start:.2f}s")
            
            # 4. Bulk Data Assembly & Persistence
            processed_clauses = []
            for i in range(len(raw_clauses)):
                processed_clauses.append({
                    "documentId": doc_id,
                    "originalText": raw_clauses[i][:4000],
                    "simplifiedText": simplified_texts[i] if simplified_texts[i] != "Not required" else None,
                    "clauseType": classification_results[i][0],
                    "riskLevel": risk_scorer.get_risk_level_string(severity_scores[i]),
                    "severityScore": float(severity_scores[i])
                })
                
            await db.clause.create_many(data=processed_clauses)
            logger.info(f"Forensic analysis & DB sync complete in {time.time() - analysis_start:.2f}s")
            
            # 5. Final Risk Synthesis
            analyzer_start = time.time()
            final_score = DocumentRiskAnalyzer.calculate_total_risk_score(processed_clauses)
            neg_msg = DocumentRiskAnalyzer.generate_negotiation_message(final_score, processed_clauses)
            logger.info(f"Risk synthesis complete in {time.time() - analyzer_start:.2f}s")
            
            # 6. Finalize Transaction
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
