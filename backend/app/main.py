import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# --- THE MAGIC LINK ---
# This points Python to the main AHGV_Hackathon folder so it can see the 'agent' folder
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, "../../"))
sys.path.append(project_root)

# Import YOUR ingestion route
#from app.routes.ingest import router as ingest_router
from app.services.qdrant_service import init_qdrant_collection

from agent.app import router as agent_router

app = FastAPI(title="AHGV Learning Assistant API", version="1.0.0")

# Enable CORS for Next.js / React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_qdrant_collection()

# 1. Mount your ingestion routes
#app.include_router(ingest_router)

# 2. Mount her agent routes under /api (This makes her /chat endpoint accessible at /api/chat)
app.include_router(agent_router, prefix="/api", tags=["Agentic RAG"])

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "FastAPI Gateway"}