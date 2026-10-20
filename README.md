# BuildVerse AI Learning Assistant

An AI-powered learning platform where students can ask questions about lecture content they've already watched. The AI answers **only from content consumed so far** — enforcing a Timestamp Guard that prevents spoilers and ensures grounded, citation-backed responses.

---

## What It Does

- Student watches a video lecture
- Pauses at any point and asks a question
- AI answers using **only** content watched up to that timestamp
- Citations reference exact video timestamps and PDF pages
- Future content → "Not covered yet"
- Off-topic questions → "Out of scope"

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + Tailwind CSS |
| Backend | FastAPI (Python) |
| LLM | Gemini API / OpenRouter |
| Embeddings | sentence-transformers |
| Vector DB | ChromaDB |
| Transcription | Whisper (OpenAI) |
| PDF/PPT Parsing | PyMuPDF + python-pptx |
| Orchestration | LangGraph |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

---

## Project Structure

AHGV_Hackathon/
├── client/                  # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   └── LecturePage.jsx
│   │   ├── components/
│   │   │   ├── ChatPanel.jsx
│   │   │   └── VideoPlayer.jsx
│   │   ├── hooks/
│   │   │   └── useVideoTime.js
│   │   └── services/
│   │       ├── api.js
│   │       └── mockApi.js
│   └── public/
│       ├── lecture.mp4        (not tracked in git)
│       └── Lecture1_Notes.pdf
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── routes/
│   │   │   ├── ingest.py
│   │   │   └── query.py
│   │   ├── services/
│   │   │   ├── pdf_service.py
│   │   │   ├── qdrant_service.py
│   │   │   └── whisper_service.py
│   │   ├── config.py
│   │   └── main.py
│   └── requirements.txt
└── agent/                   # LangGraph agent
    ├── app.py
    └── requirements.txt

---

## Frontend Setup

~~~bash
# Clone the repo
git clone https://github.com/codewith-sneha/AHGV_Hackathon.git
cd AHGV_Hackathon/client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add video file (not tracked in git)
# Place your lecture.mp4 in client/public/

# Start development server
npm run dev
~~~

---

## Backend Setup

~~~bash
cd server

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Start backend server
uvicorn main:app --reload --port 8000
~~~

---

## Environment Variables

### Frontend (`client/.env`)

~~~env
VITE_API_BASE_URL=http://localhost:8000
VITE_VIDEO_URL=/lecture.mp4
~~~

### Backend (`server/.env`)

~~~env
GEMINI_API_KEY=your_key_here
QDRANT_PATH=./qdrant_data
QDRANT_COLLECTION=knowledge_base
EMBED_MODEL=all-MiniLM-L6-v2
GEMINI_MODEL=gemini-2.0-flash
~~~

---

## Video File

The lecture video is not tracked in git due to file size limits.

Each team member should download their own copy:

~~~bash
brew install yt-dlp

yt-dlp -f "bestvideo+bestaudio" --merge-output-format mp4 \
  "https://www.youtube.com/watch?v=YOUR_VIDEO_URL" \
  -o "client/public/lecture.mp4"
~~~

---

## Demo Mode

The frontend includes a mock API for demo without backend.

In `src/components/ChatPanel.jsx`:

~~~js
const USE_MOCK = true   // demo mode — no backend needed
const USE_MOCK = false  // connect to real backend
~~~

---

## Live Demo

- Frontend: https://ai-learning-assistant-alpha.vercel.app/
- Backend: https://ahgv-learning-backend.onrender.com
- API Docs: https://ahgv-learning-backend.onrender.com/docs

---

## API Documentation

See [API.md](./API.md) for full endpoint documentation.

---

## Team — Syntax Squad

| Name | Role |
|---|---|
| Sneha | Frontend |
| Manawi | Backend |
| Ritu | AI/ML |

---

## Hackathon

AHGV BuildVerse Hackathon 2026