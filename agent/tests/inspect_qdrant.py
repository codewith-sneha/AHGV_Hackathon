import os
from collections import defaultdict
from dotenv import load_dotenv
from qdrant_client import QdrantClient

load_dotenv()
qd = QdrantClient(url=os.getenv("QDRANT_URL"), api_key=os.getenv("QDRANT_API_KEY") or None) \
    if os.getenv("QDRANT_URL") else QdrantClient(path=os.getenv("QDRANT_PATH", "./qdrant_data"))
col = os.getenv("QDRANT_COLLECTION", "knowledge_base")

sources = defaultdict(lambda: {"kind": set(), "n": 0, "max_end": 0.0})
offset = None
while True:
    pts, offset = qd.scroll(col, limit=256, offset=offset, with_payload=True, with_vectors=False)
    for p in pts:
        pl = p.payload or {}
        s = sources[pl.get("source")]
        s["kind"].add(pl.get("kind"))
        s["n"] += 1
        s["max_end"] = max(s["max_end"], float(pl.get("end") or 0))
    if offset is None:
        break

for src, info in sources.items():
    print(src, info)