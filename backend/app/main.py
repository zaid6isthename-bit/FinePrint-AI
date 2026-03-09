from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
import os
from app.db.prisma import connect_db, disconnect_db
from app.api.endpoints import auth, documents

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="FinePrint AI API",
    description="Backend API for FinePrint AI - Legal Agreement Risk Analyzer",
    version="1.0.0"
)

# Configure CORS - open to all origins since auth uses JWT headers, not cookies
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    logger.info("Starting up FinePrint AI Backend...")
    await connect_db()
    logger.info("Web server initialization complete.")

@app.on_event("shutdown")
async def shutdown():
    logger.info("Shutting down FinePrint AI Backend...")
    await disconnect_db()

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])

@app.get("/")
async def root():
    return {"message": "Welcome to the FinePrint AI API"}

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
