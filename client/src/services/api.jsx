const API_BASE = 'https://ahgv-learning-backend.onrender.com'

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