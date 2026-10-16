const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const ingestLecture = async (lectureId) => {
  const res = await fetch(`${API_BASE}/api/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lecture_id: lectureId,
      video_url: `${window.location.origin}/lecture.mp4`,
      pdf_url: `${window.location.origin}/Lecture4_Notes.pdf`,
      ppt_url: `${window.location.origin}/Lecture4_Slides.pptx`,
      duration: '47 min',
    }),
  })
  if (!res.ok) throw new Error('Ingest failed')
  return res.json()
}

export const queryAssistant = async (question, lectureId, timestamp) => {
  const res = await fetch(`${API_BASE}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question,
      lecture_id: lectureId,
      timestamp,
    }),
  })
  if (!res.ok) throw new Error('Query failed')
  return res.json()
}