const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

const futureKeywords = ['next', 'later', 'upcoming', 'after', 'design techniques', 'backtracking', 'dynamic programming', 'greedy', 'branch and bound']
const offTopicKeywords = ['weather', 'food', 'movie', 'cricket', 'stock', 'recipe', 'politics']

const responses = {

  algorithm: (ts) => `
### What is an Algorithm?

An **algorithm** is a step-by-step procedure to solve a computational problem.

**Origin:** The word comes from the name of Persian mathematician **Al-Khwarizmi** (9th century).

**Key Definition:**
> A finite set of well-defined instructions to solve a problem, given some input, producing an output.

**Five Characteristics (must remember):**
1. **Input** — zero or more inputs accepted
2. **Output** — at least one output produced
3. **Definiteness** — every step must be clear and unambiguous
4. **Finiteness** — must terminate after a finite number of steps
5. **Effectiveness** — each step must be basic and feasible

> 📍 Video [${ts}] — instructor explained this with everyday examples
> 📄 PDF Pages 1–3 — full definition and characteristics

---
*Grounded in content watched up to ${ts}*
`,

  algoVsProgram: (ts) => `
### Algorithm vs Program

| | Algorithm | Program |
|---|---|---|
| Phase | Design phase | Implementation phase |
| Who writes | Domain expert | Programmer |
| Language | Any (pseudocode, flowchart) | Specific language (C, Java) |
| Hardware | Independent | Dependent |
| Lifecycle | Part of SDLC design | Part of SDLC implementation |

**Key insight:**
- Algorithm requires **domain knowledge**
- Program requires **programming skill**
- An algorithm can be converted to a program in **any language**

> 📍 Video [${ts}] — instructor drew the comparison table here
> 📄 PDF Pages 4–5 — full comparison with SDLC context

---
*Grounded in content watched up to ${ts}*
`,

  pseudocode: (ts) => `
### Algorithm Representation

There are **3 ways** to represent an algorithm:

**1. Natural Language**
- Simple English statements
- Easy to understand but ambiguous

**2. Pseudocode**
- Structured English with programming-like syntax
- Not language specific
- Example for swapping two numbers:
\`\`\`
BEGIN
  temp = a
  a = b
  b = temp
END
\`\`\`

**3. Flowcharts**
- Diagrammatic representation
- Uses standard symbols:
  - Oval → Start/End
  - Rectangle → Process
  - Diamond → Decision
  - Arrow → Flow direction

> 📍 Video [${ts}] — instructor drew flowchart symbols here
> 📄 PDF Pages 5–7 — pseudocode conventions and flowchart examples

---
*Grounded in content watched up to ${ts}*
`,

  complexity: (ts) => `
### Time and Space Complexity

**A Priori Analysis** (before execution):
- Theoretical analysis
- Count frequency of operations
- Language and hardware independent ✓

**A Posteriori Analysis** (after execution):
- Practical measurement
- Depends on hardware and language ✗

---

**Frequency Count Method:**
\`\`\`
for (i = 0; i < n; i++)     // executes n+1 times
  sum = sum + a[i];          // executes n times
\`\`\`
Total = **2n + 1** → O(n)

**Nested Loops:**
\`\`\`
for (i = 0; i < n; i++)
  for (j = 0; j < n; j++)
    // executes n² times → O(n²)
\`\`\`

---

**Space Complexity:**
- Fixed part: code, constants
- Variable part: input data, stack space
- Total space = Fixed + Variable

> 📍 Video [${ts}] — frequency count method demonstrated here
> 📄 PDF Pages 10–11 — time and space complexity with examples

---
*Grounded in content watched up to ${ts}*
`,

  notation: (ts) => `
### Asymptotic Notations

Used to describe algorithm performance as input size grows.

**Big-O (O) — Upper Bound (Worst Case):**
- Maximum time algorithm will take
- Most commonly used notation
- Example: Linear search → O(n)

**Big-Omega (Ω) — Lower Bound (Best Case):**
- Minimum time algorithm will take
- Example: Linear search → Ω(1) (element at first position)

**Big-Theta (Θ) — Tight Bound (Average Case):**
- Both upper and lower bound
- Most precise representation

**Common Growth Rates (slowest to fastest):**
\`\`\`
O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)
\`\`\`

> 📍 Video [${ts}] — growth rate graph shown here
> 📄 PDF Pages 11–12 — all three notations with examples

---
*Grounded in content watched up to ${ts}*
`,

  gcd: (ts) => `
### GCD Example — Euclid's Algorithm

**Problem:** Find GCD of two numbers a and b

**Euclid's Algorithm:**
\`\`\`
while (b != 0):
  temp = b
  b = a % b
  a = temp
return a
\`\`\`

**Dry Run — GCD(12, 8):**
\`\`\`
a=12, b=8 → b=12%8=4, a=8
a=8,  b=4 → b=8%4=0,  a=4
b=0 → return 4
GCD(12,8) = 4 ✓
\`\`\`

This is one of the oldest algorithms — dates back to **300 BC**.

> 📍 Video [${ts}] — instructor did this dry run step by step
> 📄 PDF Pages 3, 8–9 — GCD problem and Euclid's algorithm

---
*Grounded in content watched up to ${ts}*
`,

  summary: (ts) => `
### 📋 Summary (00:00 — ${ts})

Here is what you have covered so far:

1. **Definition of Algorithm** — step-by-step procedure to solve a problem, origin from Al-Khwarizmi
2. **5 Characteristics** — Input, Output, Definiteness, Finiteness, Effectiveness
3. **Algorithm vs Program** — design phase vs implementation phase, domain knowledge vs programming skill
4. **Representation** — natural language, pseudocode, flowcharts with standard symbols
5. **Solved Examples** — swap two numbers, sum of array, linear search, Euclid's GCD
6. **Algorithm Analysis** — A Priori (theoretical) vs A Posteriori (practical)
7. **Time Complexity** — frequency count method, O(n), O(n²) for nested loops
8. **Space Complexity** — fixed + variable parts
9. **Asymptotic Notations** — Big-O (worst), Big-Omega (best), Big-Theta (average)

> 📍 [01:30] — algorithm definition and characteristics
> 📍 [04:45] — algorithm vs program comparison table
> 📍 [07:20] — pseudocode and flowchart symbols
> 📍 [09:10] — Euclid's GCD dry run
> 📍 [${ts}] — current position
> 📄 PDF Pages 1–12 — all above concepts

---
*Summary grounded in content watched up to ${ts}*
`,

  mockInterview: (ts) => `
### 🎯 Mock Interview — Introduction to Algorithms

Based on content up to **${ts}**:

**Q1:** State and explain the five characteristics of an algorithm.

**Q2:** What is the difference between A Priori and A Posteriori analysis? Which is preferred and why?

**Q3:** Find the time complexity of this code:
\`\`\`
for (i = 0; i < n; i++)
  for (j = 0; j < n; j++)
    print(i + j)
\`\`\`

**Q4:** What is the difference between Big-O, Big-Omega and Big-Theta notation?

**Q5:** Convert Euclid's GCD algorithm to pseudocode and do a dry run for GCD(16, 4).

---
*Answer below and I will give you feedback!*
`,

  explain: (ts) => `
### Explanation — Last Section Covered

Around **${ts}**, the instructor was covering **Algorithm Analysis**:

**A Priori Analysis:**
- Done BEFORE running the program
- Count number of operations mathematically
- Result is independent of hardware/language
- We use this in practice ✓

**Frequency Count Method:**
\`\`\`
Statement          | Frequency
-------------------|----------
int sum = 0;       | 1
i = 0;             | 1  
i < n (check)      | n+1
sum = sum + a[i]   | n
i++                | n
return sum         | 1
Total              | 3n + 4 → O(n)
\`\`\`

This is how we calculate time complexity without running the code.

> 📍 Video [${ts}] — this was explained just now
> 📄 PDF Page 10 — frequency count method table

---
*Grounded in content watched up to ${ts}*
`,

  future: () => `
### ⏳ Not Covered Yet

This topic has not been covered in the lecture yet.

Keep watching — it will be explained in the upcoming section! 🎯
`,

  offTopic: () => `
### 🚫 Out of Scope

This question is not related to the current course content.

Please ask questions about the lecture, PDF or slides loaded in this session.
`
}

export const mockIngest = async (lectureId) => {
  await new Promise(r => setTimeout(r, 1500))
  return { success: true, lecture_id: lectureId, message: 'Lecture ready' }
}

export const mockQuery = async (question, lectureId, timestampSeconds) => {
  await new Promise(r => setTimeout(r, 900))
  const ts = formatTime(timestampSeconds)
  const q = question.toLowerCase()

  if (offTopicKeywords.some(k => q.includes(k)))
    return { answer: responses.offTopic(), type: 'off_topic' }

  if (futureKeywords.some(k => q.includes(k)))
    return { answer: responses.future(), type: 'future' }

  if (q.includes('mock interview') || q.includes('interview') || q.includes('quiz') || q.includes('test me'))
    return { answer: responses.mockInterview(ts), type: 'interview' }

  if (q.includes('summarize') || q.includes('summary') || q.includes('learned so far') || q.includes('covered so far'))
    return { answer: responses.summary(ts), type: 'summary' }

  if (q.includes('last 2 minutes') || q.includes('last two minutes') || q.includes('just now') || q.includes('explain'))
    return { answer: responses.explain(ts), type: 'explain' }

  if (q.includes('gcd') || q.includes('euclid'))
    return { answer: responses.gcd(ts), type: 'past' }

  if (q.includes('complexity') || q.includes('big o') || q.includes('time') || q.includes('space') || q.includes('frequency'))
    return { answer: responses.complexity(ts), type: 'past' }

  if (q.includes('notation') || q.includes('omega') || q.includes('theta') || q.includes('asymptotic'))
    return { answer: responses.notation(ts), type: 'past' }

  if (q.includes('pseudocode') || q.includes('flowchart') || q.includes('represent'))
    return { answer: responses.pseudocode(ts), type: 'past' }

  if (q.includes('program') || q.includes('difference') || q.includes('sdlc') || q.includes('domain'))
    return { answer: responses.algoVsProgram(ts), type: 'past' }

  if (q.includes('algorithm') || q.includes('characteristic') || q.includes('definition') || q.includes('what is'))
    return { answer: responses.algorithm(ts), type: 'past' }

  return { answer: responses.algorithm(ts), type: 'past' }
}