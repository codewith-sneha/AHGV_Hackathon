import os
from dotenv import load_dotenv
from fastembed import TextEmbedding
from qdrant_client import QdrantClient, models

load_dotenv()
url = os.getenv("QDRANT_URL", "")
col = os.getenv("QDRANT_COLLECTION", "knowledge_base")
qd = (QdrantClient(url=url, api_key=os.getenv("QDRANT_API_KEY") or None) if url
      else QdrantClient(path=os.getenv("QDRANT_PATH") or "./qdrant_data"))

if qd.collection_exists(col) and qd.count(col).count > 0:
    raise SystemExit(f"'{col}' already has data. Use a different QDRANT_COLLECTION for testing.")

# (text, source, kind, start, end, page)   -1 = not applicable, like your ingestion
V = "lecture1.mp4"
rows = [
    ("Welcome. In this lecture we study searching algorithms. Linear search checks every element one by one, which takes O(n) time.", V, "video", 0, 60, -1),
    ("Binary search works only on a sorted array. It compares the target with the middle element and discards half of the array each step.", V, "video", 60, 120, -1),
    ("Because binary search halves the search space each time, its time complexity is O(log n). For one million elements that is about 20 comparisons.", V, "video", 120, 180, -1),
    ("A common mistake is running binary search on an unsorted array. The result is wrong because the discard step assumes sorted order.", V, "video", 180, 240, -1),
    ("Now we move to hash tables. A hash table maps keys to buckets using a hash function, giving average O(1) lookups.", V, "video", 600, 660, -1),
    ("Collisions happen when two keys hash to the same bucket. We resolve them using chaining or open addressing.", V, "video", 660, 720, -1),
    ("Binary search summary: requires sorted input, O(log n) time, and O(1) extra space when implemented iteratively.", "notes.pdf", "pdf", -1, -1, 1),
]

model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")  # same model as your Embedder
vecs = [v.tolist() for v in model.embed([r[0] for r in rows])]

if not qd.collection_exists(col):
    qd.create_collection(col, vectors_config=models.VectorParams(size=len(vecs[0]), distance=models.Distance.COSINE))

qd.upsert(col, points=[
    models.PointStruct(
        id=i, vector=vecs[i],
        payload={"text": t, "source": s, "kind": k, "start": a, "end": b, "page": p, "slide": -1, "url": ""},
    )
    for i, (t, s, k, a, b, p) in enumerate(rows)
])
print(f"Seeded {len(rows)} chunks into '{col}'")