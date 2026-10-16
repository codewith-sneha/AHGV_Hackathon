const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const queryAssistant = async (question, lectureId, timestamp, history = []) => {
  const res = await fetch(`${API_BASE}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question,
      video_id: lectureId,
      t_current: timestamp,
      course_id: 'CS101',
      action: 'auto',
      history,
    }),
  })
  if (!res.ok) throw new Error('Query failed')
  return res.json()
}

export const ingestLecture = async (lectureId) => {
  const res = await fetch(`${API_BASE}/api/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lecture_id: lectureId }),
  })
  if (!res.ok) throw new Error('Ingest failed')
  return res.json()
}