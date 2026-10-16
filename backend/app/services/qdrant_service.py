from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams
from app.config import QDRANT_URL, QDRANT_API_KEY, COLLECTION_NAME, VECTOR_SIZE

qdrant_client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
)

def init_qdrant_collection():
    """Ensure the collection exists with cosine distance and 384 dimensions."""
    collections = qdrant_client.get_collections().collections
    collection_names = [col.name for col in collections]
    
    if COLLECTION_NAME not in collection_names:
        qdrant_client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE),
        )
        print(f"[Qdrant] Created collection: '{COLLECTION_NAME}'")
    else:
        print(f"[Qdrant] Collection '{COLLECTION_NAME}' already exists.")