from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks, HTTPException, status
from typing import List
from app.api.deps import get_current_user
from app.db.prisma import db
from app.schemas.document import DocumentResponse, ClauseResponse
from app.services.document_service import DocumentService
from app.schemas.user import UserResponse

router = APIRouter()

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    background_tasks: BackgroundTasks,
    title: str,
    file: UploadFile = File(...),
    current_user: UserResponse = Depends(get_current_user)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    file_bytes = await file.read()
    
    # Create initial document record
    document = await db.document.create(
        data={
            "title": title,
            "filename": file.filename,
            "userId": current_user.id,
            "status": "PROCESSING"
        }
    )
    
    # Trigger background ML processing
    background_tasks.add_task(DocumentService.process_document, document.id, file_bytes)
    
    # Manual serialization since object contains datetime objects that Prisma returns which might need conversion if pydantic complains
    return {
        "id": document.id,
        "title": document.title,
        "filename": document.filename,
        "uploadDate": document.uploadDate.isoformat(),
        "status": document.status,
        "riskScore": document.riskScore,
        "negotiationMsg": document.negotiationMsg,
        "clauses": []
    }

@router.get("/history", response_model=List[DocumentResponse])
async def get_history(current_user: UserResponse = Depends(get_current_user)):
    documents = await db.document.find_many(
        where={"userId": current_user.id},
        order={"uploadDate": "desc"}
    )
    
    result = []
    for doc in documents:
        result.append({
            "id": doc.id,
            "title": doc.title,
            "filename": doc.filename,
            "uploadDate": doc.uploadDate.isoformat(),
            "status": doc.status,
            "riskScore": doc.riskScore,
            "negotiationMsg": doc.negotiationMsg
        })
    return result

@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: str, current_user: UserResponse = Depends(get_current_user)):
    document = await db.document.find_unique(
        where={"id": document_id},
        include={"clauses": True}
    )
    
    if not document or document.userId != current_user.id:
        raise HTTPException(status_code=404, detail="Document not found")
        
    clauses = [
        ClauseResponse(
            id=c.id,
            originalText=c.originalText,
            simplifiedText=c.simplifiedText,
            clauseType=c.clauseType,
            riskLevel=c.riskLevel,
            severityScore=c.severityScore
        ) for c in document.clauses
    ] if document.clauses else []
    
    return {
        "id": document.id,
        "title": document.title,
        "filename": document.filename,
        "uploadDate": document.uploadDate.isoformat(),
        "status": document.status,
        "riskScore": document.riskScore,
        "negotiationMsg": document.negotiationMsg,
        "clauses": clauses
    }
