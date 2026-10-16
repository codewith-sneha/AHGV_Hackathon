const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

const futureKeywords = ['next', 'later', 'upcoming', 'after', 'advanced', 'chapter 5']
const offTopicKeywords = ['weather', 'food', 'movie', 'cricket', 'stock', 'recipe']
const responses = {
  past: (ts) => `
### Answer

**Arrays** are the most fundamental data structure — a collection of elements stored in contiguous memory locations.

Each element is accessed by its **index** starting from 0.

**Key operations:**
- Access: **O(1)** — direct index access
- Search: **O(n)** — linear scan
- Insert/Delete: **O(n)** — shifting required

> 📍 Video [${ts}] — instructor explained memory allocation here
> 📄 PDF Page 3 — Array definition and operations

---
*Grounded in content up to ${ts}*
`,

  summary: (ts) => `
### 📋 Summary (00:00 — ${ts})

Here's what you've learned so far:

1. **What is a Data Structure** — organized way to store and access data
2. **Arrays** — contiguous memory, index-based access, O(1) lookup
3. **Linked Lists** — nodes with pointers, dynamic size, O(n) access
4. **Memory Allocation** — stack vs heap, static vs dynamic

> 📍 [01:20] — data structure overview diagram
> 📍 [05:45] — array vs linked list comparison
> 📄 PDF Pages 1–5 — covers all concepts above

---
*Summary grounded in content up to ${ts}*
`,

  mockInterview: (ts) => `
### 🎯 Mock Interview — DSA Basics

Testing your understanding up to **${ts}**:

**Q1:** What is the time complexity of accessing an element in an array by index?

**Q2:** What is the difference between an array and a linked list?

**Q3:** When would you prefer a linked list over an array?

---
*Answer in the chat and I'll give feedback!*
`,

  future: () => `
### ⏳ Not Covered Yet

This topic hasn't been covered in the lecture yet.

Keep watching and ask again when you reach that section! 🎯
`,

  offTopic: () => `
### 🚫 Out of Scope

This question isn't related to the current course content.

Please ask questions about the lecture, PDF or slides in this session.
`
}

export const mockIngest = async (lectureId) => {
  await new Promise(r => setTimeout(r, 1500))
  console.log('Mock ingest:', { lectureId })
  return { success: true, lecture_id: lectureId, message: 'Lecture ready' }
}

export const mockQuery = async (question, lectureId, timestampSeconds) => {
  await new Promise(r => setTimeout(r, 800))
  const ts = formatTime(timestampSeconds)
  const q = question.toLowerCase()

  if (offTopicKeywords.some(k => q.includes(k)))
    return { answer: responses.offTopic(), type: 'off_topic' }

  if (futureKeywords.some(k => q.includes(k)))
    return { answer: responses.future(), type: 'future' }

  if (q.includes('mock interview') || q.includes('interview'))
    return { answer: responses.mockInterview(ts), type: 'interview' }

  if (q.includes('summarize') || q.includes('summary') || q.includes('learned so far'))
    return { answer: responses.summary(ts), type: 'summary' }

  if (q.includes('last 2 minutes') || q.includes('explain'))
    return { answer: responses.past(ts), type: 'past' }

  return { answer: responses.past(ts), type: 'past' }
}