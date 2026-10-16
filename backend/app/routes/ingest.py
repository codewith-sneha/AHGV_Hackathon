import uuid
import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from sentence_transformers import SentenceTransformer
from qdrant_client.http.models import PointStruct
from app.config import COLLECTION_NAME, EMBEDDING_MODEL_NAME
from app.services.qdrant_service import qdrant_client, init_qdrant_collection
from app.services.whisper_service import transcribe_audio_with_timestamps
from app.services.pdf_service import extract_pdf_chunks

router = APIRouter(prefix="/api", tags=["Ingestion"])
embed_model = SentenceTransformer(EMBEDDING_MODEL_NAME)

@router.post("/ingest")
async def ingest_file(
    file: UploadFile = File(...),
    file_type: str = Form("video"),
    video_duration: float = Form(600.0),
    lecture_id: str = Form(...)
):
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    temp_file_path = os.path.join(temp_dir, file.filename)

    try:
        # Asynchronously read and write the file to guarantee no 0-byte files
        content = await file.read()
        with open(temp_file_path, "wb") as buffer:
            buffer.write(content)

        if file_type == "video":
            chunks = transcribe_audio_with_timestamps(temp_file_path)
        elif file_type == "pdf":
            chunks = extract_pdf_chunks(temp_file_path, video_duration)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file_type.")

        if not chunks:
            return {"status": "warning", "message": "No text extracted from file."}

        # Embed and Upsert
        texts = [c["text"] for c in chunks]
        embeddings = embed_model.encode(texts, normalize_embeddings=True).tolist()

        points = []
        for i, chunk in enumerate(chunks):
            chunk["lecture_id"] = lecture_id
            points.append(
                PointStruct(
                    id=str(uuid.uuid4()),
                    vector=embeddings[i],
                    payload=chunk
                )
            )

        qdrant_client.upsert(
            collection_name=COLLECTION_NAME,
            points=points
        )

        return {
            "status": "success",
            "chunks_ingested": len(points),
            "file": file.filename
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)


@router.delete("/reset_db")
async def reset_database():
    """
    WARNING: This deletes ALL data in the Qdrant collection.
    Used for cleaning up duplicates during hackathon development.
    """
    try:
        # Delete the existing collection and all its vectors
        qdrant_client.delete_collection(collection_name=COLLECTION_NAME)
        
        # Recreate the empty collection using the existing service function
        init_qdrant_collection()
        
        return {"status": "success", "message": f"Collection '{COLLECTION_NAME}' wiped and recreated successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))