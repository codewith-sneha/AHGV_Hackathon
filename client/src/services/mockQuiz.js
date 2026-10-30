// Dummy quiz data for end video quiz
// Backend ready hone pe api.queryQuiz() se replace hoga

export const mockQuiz = {
  question: "Based on the lecture you just watched, which part of the chloroplast is the site of the Calvin cycle?",
  options: [
    "Thylakoid membrane",
    "Stroma",
    "Lumen",
    "Granum"
  ],
  correct: 1, // index of correct option (Stroma)
  explanation: "The Calvin cycle (light-independent reactions) takes place in the stroma — the fluid surrounding the thylakoids. The thylakoid membrane is where the light-dependent reactions occur."
}

// Simulate API call delay (jaise real backend hota hai)
export const fetchMockQuiz = async () => {
  await new Promise(r => setTimeout(r, 600))
  return { quiz: [mockQuiz] }
}