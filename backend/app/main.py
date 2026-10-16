from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.services.qdrant_service import init_qdrant_collection
from app.routes.ingest import router as ingest_router
from app.routes.query import router as query_router

app = FastAPI(title="AHGV Learning Assistant API", version="1.0.0")

# Enable CORS for Next.js / React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_qdrant_collection()

app.include_router(ingest_router)
app.include_router(query_router)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "FastAPI Gateway"}