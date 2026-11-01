import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, "../../"))
sys.path.append(project_root)

from app.services.qdrant_service import init_qdrant_collection
from agent.app import router as agent_router
from agent.quiz import router as quiz_router          # CHANGED: import the quiz router
from app.routes.interview import router as interview_router

app = FastAPI(title="AHGV Learning Assistant API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    try:
        init_qdrant_collection()
    except Exception as e:
        print(f"Warning: Qdrant not available ({e}). Interview will still work.")


app.include_router(agent_router, prefix="/api", tags=["Agentic RAG"])
app.include_router(quiz_router, prefix="/api", tags=["Quiz"])   # CHANGED: serves /api/quiz/final and /api/quiz/feedback
app.include_router(interview_router, prefix="/api")


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "FastAPI Gateway"}