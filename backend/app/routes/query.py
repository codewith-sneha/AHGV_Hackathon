from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["Query"])

class QueryRequest(BaseModel):
    question: str
    lecture_id: str
    t_current: float

@router.post("/query")
async def query_assistant(request: QueryRequest):
    """
    Temporary endpoint shell until LangGraph is plugged in.
    Returns simulated response.
    """
    return {
        "answer": f"Received query: '{request.question}' at T={request.t_current}s. LangGraph RAG integration pending.",
        "citations": ["[01:15]"]
    }