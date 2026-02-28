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

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    logger.info("Starting up FinePrint AI Backend...")
    # Fire and forget the database connection to ensure immediate port binding for Render health checks
    import asyncio
    asyncio.create_task(connect_db())
    logger.info("Web server initialization complete. Port binding should occur now.")

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

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    # Note: Use reload=False in production, but here we stay consistent with dev
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
