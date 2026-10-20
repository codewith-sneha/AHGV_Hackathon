# Deployment Guide

Timestamp-Aware AI Learning Assistant: a React + Tailwind frontend, a Node.js ingestion backend, and a FastAPI learning agent. Deploys to AWS with Qdrant Cloud (vectors) and Gemini (answers).

## Architecture

```
Browser (React + Tailwind)
   |  upload content                 ask a question
   v                                  v
Node backend --chunk, embed, upsert--> Qdrant Cloud <--scoped search-- FastAPI agent --> Gemini
   |
   +--> S3 (media) <-- CloudFront URLs used by the player and citations
```

| Component | Tech | Role |
|---|---|---|
| Frontend | React, Tailwind | Player, chat UI, uploads |
| Ingestion backend | Node.js | Extract, chunk, embed, upsert to Qdrant (last step) |
| Learning agent | FastAPI | Intent routing, scoped retrieval, answers, citations |
| Vector DB | Qdrant Cloud | Chunk vectors and payloads |
| LLM | Gemini 2.5 Flash (fallback Flash-Lite) | Answer generation |

The agent answers only from video chunks that end at or before the learner's pause time, plus documents the learner is allowed to use. This is enforced inside the Qdrant query and re-checked in code.

## Prerequisites

- **Accounts:** Qdrant Cloud, Google AI Studio (Gemini API key)
- **Tools:** Node.js 20, Python 3.11, Docker, AWS CLI v2
- **Repo layout used in this guide:**

```
repo/
├── frontend/   React + Tailwind
├── backend/    Node.js ingestion (entry: server.js)
└── agent/      FastAPI agent (entry: app.py)
```

## 1. Integration contract

> [!IMPORTANT]
> The Node backend writes to Qdrant and the agent reads from it. They share no code, so the settings below must match exactly. A mismatch raises no error: answers just get worse.

| Setting | Value |
|---|---|
| Embedding model | `BAAI/bge-small-en-v1.5` (384 dimensions, cosine, normalised vectors) |
| Collection | `knowledge_base`, same `QDRANT_COLLECTION` in both services |

The agent's `Embedder` is pinned to this model and ignores `EMBED_MODEL`, so the Node embedder must match it.

**Payload fields** written for every chunk:

| Field | Type | Notes |
|---|---|---|
| `text` | string | Required |
| `source` | string | Video ID or document name |
| `kind` | string | `video`, `audio`, `pdf`, `ppt`, `pptx`, `text` (lowercase) |
| `start`, `end` | float (seconds) | Video/audio only; `-1` if not applicable |
| `page`, `slide` | integer | Documents only; `-1` if not applicable |
| `url` | string | Absolute, or starting with `/` (prefixed by `FILES_BASE_URL`) |
| `course_id` | string | Required on every chunk if the frontend sends a `course_id` |

**Rules**

- A video chunk's `source` must equal the `video_id` the frontend sends. A document's `source` must be in the `allowed_resources` list.
- A video chunk is visible only when `end <= pause_time`. Use short chunks (20 to 60 s) for precise protection.
- Create payload indexes on `source`, `kind`, `course_id` (keyword) and `start`, `end` (float), either in the Node backend or once via `CREATE_INDEXES=1`.

**Parity check.** Have Node write the embedding of the sentence below to `node_vector.json`, then run:

```python
import json, sys
import numpy as np
from fastembed import TextEmbedding

TEXT = "A stack is a last-in first-out data structure."
a = np.array(list(TextEmbedding(model_name="BAAI/bge-small-en-v1.5").embed([TEXT]))[0])
n = np.array(json.load(open(sys.argv[1])))
cos = float(a @ n / (np.linalg.norm(a) * np.linalg.norm(n)))
print(len(a), len(n), round(cos, 4))
assert len(a) == len(n) == 384 and cos > 0.99, "Embedding mismatch"
```

## 2. Before you deploy

- [ ] **Agent:** add the missing import: `from fastapi import APIRouter, FastAPI, HTTPException`. Without it the 503 handler raises `NameError`.
- [ ] **Agent:** always set `CORS_ORIGINS` (exact origins, comma-separated, no spaces, no trailing slash). Unset, it defaults to `*`.
- [ ] **Agent (recommended):** add a light health route, because `/health` loads the model and queries Qdrant:

  ```python
  @router.get("/live")
  def live() -> dict:
      return {"ok": True}
  ```

- [ ] **Node:** run ingestion asynchronously (return a job ID). App Runner cuts requests off after about 120 s. Expose `GET /health`.
- [ ] **Repo:** `.env` is git-ignored, `.env.example` is committed, lockfiles are committed.

## 3. Environment variables

Store `GEMINI_API_KEY` and `QDRANT_API_KEY` in AWS Secrets Manager. Never commit them or put them in the frontend.

| Variable | Used by | Notes |
|---|---|---|
| `QDRANT_URL` | backend, agent | Qdrant Cloud cluster URL |
| `QDRANT_API_KEY` | backend, agent | Secret |
| `QDRANT_COLLECTION` | backend, agent | Same value in both |
| `FILES_BASE_URL` | backend, agent | Media CloudFront URL |
| `CORS_ORIGINS` | backend, agent | Frontend origin, e.g. `https://<frontend-domain>` |
| `GEMINI_API_KEY` | agent | Secret |
| `CREATE_INDEXES` | agent | `1` on first deploy only, then remove |
| `PORT`, `NODE_ENV` | backend | `8080`, `production` |
| `AWS_REGION`, `S3_BUCKET` | backend | Media bucket |

Frontend (build time, so rebuild after changing): `VITE_API_URL=https://<backend-url>` and `VITE_AGENT_URL=https://<agent-url>`. Create React App uses the `REACT_APP_` prefix instead.

Optional agent tuning, all with defaults: `GEMINI_MODEL`, `GEMINI_FALLBACK_MODELS`, `LLM_ATTEMPTS`, `MIN_SCORE` (0.25), `CONTEXT_CHARS`, `RECENT_SECONDS`, `QDRANT_VECTOR_NAME`.

## 4. Run locally

Use a Qdrant server, not file mode: `QDRANT_PATH` storage cannot be shared by two processes.

```bash
docker run -p 6333:6333 qdrant/qdrant                       # Qdrant
cd backend && npm ci && npm start                           # Node backend
cd agent && python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000                        # Agent
cd frontend && npm ci && npm run dev                        # Frontend
```

`app:app` means the variable `app` inside `app.py`; run it from inside `agent/`. Use `--reload` for development only. Set `QDRANT_URL=http://localhost:6333` in both services, ingest a sample video and PDF, then run the parity check from section 1.

## 5. Verify

```bash
export AGENT=https://<agent-url>
curl $AGENT/health        # {"ok": true, "points": N} with N > 0
curl -X POST $AGENT/chat -H "Content-Type: application/json" -d '{
  "question": "<a question about the video>",
  "video_id": "<video-id>",
  "pause_time": "12:40",
  "allowed_resources": [],
  "course_id": "<course-id>"
}'
```

| Test | Expected |
|---|---|
| Question on content before the pause time | Answer with `[n]` citations |
| Same question with `pause_time` `"0:30"` | `refused: true`, or `later: true` if confirmed to come later |
| Same call with `pause_time` 30, then run the command below | `0` |
| `docs_check` action with `allowed_resources: []` | Refusal, no documents used |
| Click a video citation in the UI | Player seeks to that time |
| Browser console during a full session | No CORS or mixed-content errors |

Command for the third test (no citation may end after the pause time):

```bash
curl -s -X POST $AGENT/chat -H "Content-Type: application/json" -d '{
  "question": "<a question about the video>",
  "video_id": "<video-id>",
  "pause_time": 30
}' | jq '[.citations[] | select(.end > 30)] | length'
```

The second and third tests prove the no-spoiler guarantee holds on the live deployment.

## 6. Troubleshooting

| Symptom | Likely cause and fix |
|---|---|
| `No module named 'app'` | Run `uvicorn` from inside `agent/`; the command is `uvicorn <filename>:app` |
| `/health` 500 or `points: 0` | Ingestion not run, or `QDRANT_COLLECTION` differs between services |
| Everything refused, or poor answers | Embedding mismatch (run the parity check), missing `end` on video chunks, or `course_id` missing from payloads |
| CORS error in the browser | `CORS_ORIGINS` must be the exact origin: no spaces, no trailing slash; redeploy |
| Frontend calls `localhost` | `VITE_*` values are baked in at build time; rebuild, upload, invalidate |
| Route refresh returns 403 or 404 | Add the 403/404 to `/index.html` mapping on the frontend distribution |
| Video will not seek, or media 403 | Check the OAC bucket policy and the `url` values stored in Qdrant |
| `/chat` returns 503 | Gemini busy or out of quota; retry (the response has `Retry-After`) |
| `/chat` returns 500 `NameError` | The `HTTPException` import is missing |
| App Runner health check fails | Use `/live`, raise the timeout, check CloudWatch logs for bad env values |
| Upload fails after about 120 s | Ingestion must be asynchronous |

## 7. Operations, security and limitations

**Operations**

- Logs go to CloudWatch. Each `/chat` response includes `timings_ms` for latency tracing.
- Changing an env var redeploys the service. Release by pushing a new image tag; roll back by pointing to the previous tag.
- Pause App Runner services when not demoing, and delete all resources when the project is retired. Rotate any key that appears in a log, screenshot or commit.

**Security**

- HTTPS everywhere. Buckets stay private behind CloudFront. IAM roles are least-privilege. Never deploy the agent with the default `CORS_ORIGINS=*`.
- The agent has no built-in rate limiting and every `/chat` call uses Gemini quota. Add AWS WAF rate rules before a public launch.
- Transcript text is sent to Gemini, so review the data-use terms of the API tier you use.

**Known limitations**

- `pause_time` and `allowed_resources` currently come from the browser, so a modified client could request later content. For production, have the Node backend authenticate the learner, look up real progress and enrolments, and call the agent server-to-server.
- The "this topic will be covered later" reply confirms a topic exists later in the video. It is gated by a strict verifier and fails closed, but it is a deliberate trade-off.
- No automated tests or CI/CD yet; a GitHub Actions workflow can build and push images.
