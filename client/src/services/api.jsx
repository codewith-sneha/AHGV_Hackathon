// const API_BASE = 'https://ahgv-learning-backend.onrender.com'
// const API_BASE = 'http://localhost:8000'
const API_BASE = "https://ahgv-learning-backend.onrender.com";
// const API_BASE = 'http://localhost:8000'

export const queryAssistant = async (
  question,
  lectureId,
  timestamp,
  history = [],
) => {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      video_id: lectureId,
      pause_time: timestamp,
      action: "auto",
      history,
      allowed_resources: ["Photosynthesis — Study Notes.pdf"],
    }),
  });
  if (!res.ok) throw new Error("Query failed");
  const data = await res.json();

  console.log("Backend response:", data);
  return data;
};

export const ingestLecture = async () => {
  return { success: true };
};

// ── Interview API ─────────────────────────────────────────────────────────────
export const interviewStart = async (config) => {
  const res = await fetch(`${API_BASE}/api/interview/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error("Interview start failed");
  return res.json();
};

export const interviewRespond = async (payload) => {
  const res = await fetch(`${API_BASE}/api/interview/respond`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Interview respond failed");
  return res.json();
};

export const interviewFinish = async (payload) => {
  const res = await fetch(`${API_BASE}/api/interview/finish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Interview finish failed");
  return res.json();
};
const QUIZ_BASE = import.meta.env.VITE_AGENT_URL || API_BASE;
const QUIZ_PATH = "/quiz";
const readError = async (res, fallback) => {
  try {
    const d = await res.json();
    if (typeof d?.detail === "string") return d.detail;
  } catch {}
  return fallback;
};

export const quizGenerate = async ({
  videoId,
  pauseTime,
  allowedResources,
  numQuestions = 5,
}) => {
  const res = await fetch(`${QUIZ_BASE}${QUIZ_PATH}/final`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      video_id: videoId,
      pause_time: pauseTime,
      allowed_resources: allowedResources,
      course_id: null,
      num_questions: numQuestions,
    }),
  });
  if (!res.ok)
    throw new Error(await readError(res, "Could not create the quiz."));
  return res.json();
};

export const quizFeedback = async ({ quizToken, answers }) => {
  const res = await fetch(`${QUIZ_BASE}${QUIZ_PATH}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quiz_token: quizToken,
      answers,
      ai_feedback: true,
    }),
  });
  if (!res.ok)
    throw new Error(await readError(res, "Could not check your answers."));
  return res.json();
};
