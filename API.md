# API Documentation — BuildVerse AI Learning Assistant

Base URL: `https://ahgv-learning-backend.onrender.com`

---

## Endpoints

---


---

### POST /api/ingest

Ingests course content (video transcript, PDF, PPT) into the vector database for a given lecture.

**Request Body:**
~~~json
{
  "lecture_id": "L01",
  "video_url": "/lecture.mp4",
  "pdf_url": "/Lecture1_Notes.pdf",
  "ppt_url": "/Lecture1_Slides.pptx"
}
~~~

**Parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| lecture_id | string | ✓ | Unique lecture identifier |
| video_url | string | ✓ | Path or URL to video file |
| pdf_url | string | ✗ | Path or URL to PDF notes |
| ppt_url | string | ✗ | Path or URL to PPT slides |

**Response:**
~~~json
{
  "success": true,
  "lecture_id": "L01",
  "message": "Lecture ingested successfully"
}
~~~

**What it does:**
- Transcribes video using Whisper
- Extracts text from PDF using PyMuPDF
- Chunks all content with timestamps
- Generates embeddings using sentence-transformers
- Stores in Qdrant vector database
- Ready for /api/chat queries


### POST /api/chat

Main chat endpoint. Returns AI answer grounded in watched content only.

**Request Body:**
```json
{
  "question": "What is photosynthesis?",
  "video_id": "L01",
  "pause_time": 300.0,
  "action": "auto",
  "history": [
    {
      "role": "user",
      "content": "previous question"
    },
    {
      "role": "assistant", 
      "content": "previous answer"
    }
  ]
}
```

**Parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| question | string | ✓ | Student's question |
| video_id | string | ✓ | Lecture ID (e.g. "L01") |
| pause_time | float | ✓ | Current video position in seconds |
| action | string | ✓ | Always "auto" |
| history | array | ✗ | Previous conversation turns |

**Response:**
```json
{
  "answer": "Photosynthesis is the process...[1][2]",
  "intent": "answer",
  "refused": false,
  "citations": [
    {
      "n": 1,
      "source": "L01",
      "kind": "video",
      "label": "02:15–03:00",
      "start": 135.0,
      "end": 180.0,
      "seek_to": 135.0,
      "snippet": "...relevant transcript chunk..."
    },
    {
      "n": 2,
      "source": "Lecture1_Notes.pdf",
      "kind": "pdf",
      "label": "Page 3",
      "snippet": "...relevant PDF chunk..."
    }
  ],
  "quiz": null,
  "scope": {
    "video_id": "L01",
    "to": 300.0
  },
  "timings_ms": {
    "retrieve": 120,
    "llm": 450,
    "total": 580
  }
}
```

**Response when refused (future content):**
```json
{
  "answer": "This topic is covered later in the video please continue watching ",
  "intent": "refused",
  "refused": true,
  "citations": []
}
```


**Response when question asked is off topic (not related ):**
```json
{
  "answer": "I couldn't find this in the part of the video you've watched or in your permitted course materials, so I can't answer it without guessing. ",
  "intent": "refused",
  "refused": true,
  "citations": []
}
```

---

### GET /health

Check if backend is running.

**Response:**
```json
{
  "ok": true,
  "points": 1250
}
```

---

## Intent Types

| Intent | Meaning |
|---|---|
| answer | Normal answer from watched content |
| summary | Summary of watched content |
| refused | Content not yet covered in video |
| off_topic | Question unrelated to course |

---

## Error Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 422 | Validation error — check request body |
| 500 | Server error — check backend logs |

---

---

## Gemini API — LLM Integration

The backend uses **Google Gemini** as the LLM for generating answers.

### Model Used
~~~
gemini-2.0-flash
~~~

### How It Works

1. Student question + video transcript chunks + PDF chunks are sent to Gemini
2. Gemini generates a grounded answer using only the provided context
3. Response includes citations back to source chunks
4. If no relevant content found → refused = true

### Gemini API Setup

Get your API key from:
~~~
https://aistudio.google.com/app/apikey
~~~

Add to backend `.env`:
~~~env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.0-flash
~~~

---

## Frontend API Integration

```js
// src/services/api.js

const API_BASE = import.meta.env.VITE_API_BASE_URL

export const queryAssistant = async (question, lectureId, timestamp, history = []) => {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question,
      video_id: lectureId,
      pause_time: timestamp,
      action: 'auto',
      history,
    }),
  })
  if (!res.ok) throw new Error('Query failed')
  return res.json()
}
```