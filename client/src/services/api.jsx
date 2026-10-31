// const API_BASE = 'https://ahgv-learning-backend.onrender.com'
const API_BASE = 'http://localhost:8000'

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

export const ingestLecture = async () => {
  return { success: true }
}

// ── Interview API ─────────────────────────────────────────────────────────────
export const interviewStart = async (config) => {
  const res = await fetch(`${API_BASE}/api/interview/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  })
  if (!res.ok) throw new Error('Interview start failed')
  return res.json()
}

export const interviewRespond = async (payload) => {
  const res = await fetch(`${API_BASE}/api/interview/respond`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Interview respond failed')
  return res.json()
}

export const interviewFinish = async (payload) => {
  const res = await fetch(`${API_BASE}/api/interview/finish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Interview finish failed')
  return res.json()
}