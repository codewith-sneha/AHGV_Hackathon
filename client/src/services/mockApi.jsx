const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

const futureKeywords = ['calvin cycle', 'dark reaction', 'rubisco', 'g3p', 'carbon fixation', 'factors', 'temperature', 'light intensity']
const offTopicKeywords = [
  'weather', 'food', 'movie', 'cricket', 'stock', 'recipe', 'politics',
  'algorithm', 'coding', 'time complexity', 'big o', 'sorting', 'array',
  'linked list', 'binary', 'mitochondria', 'cell division', 'dna', 'rna',
  'genetics', 'evolution', 'ecosystem', 'osmosis', 'diffusion']
const responses = {

  main: (ts) => `
### What is Photosynthesis?

**Photosynthesis** is the process by which plants, algae and cyanobacteria use light energy to turn carbon dioxide and water into sugar, releasing oxygen as a by-product.

**Basic equation:**
\`\`\`
6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂
\`\`\`

**Why it matters:**
- Almost all food chains start with sugar made this way
- Almost all atmospheric oxygen comes from it
- Nearly all life on Earth is ultimately fusion-powered (energy from the Sun)

**Two stages:**
1. **Light-dependent reactions** — in thylakoid membranes; capture light, produce ATP and NADPH, release O₂
2. **Calvin cycle (light-independent)** — in stroma; uses ATP and NADPH to fix CO₂ into sugar (G3P)

**Relation to respiration:**
- Photosynthesis = cellular respiration in reverse
- Respiration breaks glucose down; photosynthesis builds it up

> 📍 Video [${ts}] — instructor introduced photosynthesis here
> 📄 PDF Page 1 — overview, why it matters, two stages

---
*Grounded in content watched up to ${ts}*
`,

  chloroplast: (ts) => `
### The Chloroplast

Photosynthesis takes place in **chloroplasts** — found in plant cells but NOT in animal cells.

**Key parts:**

| Part | What it is | Role |
|---|---|---|
| Thylakoid | Flattened membrane sac | Holds chlorophyll and light reaction complexes |
| Granum | Stack of thylakoids | Packs large membrane area into small space |
| Lumen | Space inside thylakoid | H⁺ builds up here to drive ATP production |
| Stroma | Fluid around thylakoids | Site of the Calvin cycle |

**Chlorophyll:**
- Absorbs mainly **red and blue** light
- Reflects **green** light → why leaves look green
- **Chlorophyll a** is the main pigment
- **Chlorophyll b** and **carotenoids** are accessory pigments

> 📍 Video [${ts}] — instructor explained chloroplast structure here
> 📄 PDF Page 2 — chloroplast parts and their roles

---
*Grounded in content watched up to ${ts}*
`,

  lightReactions: (ts) => `
### Stage 1: Light-Dependent Reactions

The light reactions turn light energy into chemical energy and release O₂.

**Location:** Thylakoid membranes

**The four complexes in order:**

1. **Photosystem II (PSII)** — reaction centre P680
   - Light excites an electron
   - Splits water: 2H₂O → 4H⁺ + 4e⁻ + **O₂** ← oxygen we breathe!
   
2. **Cytochrome b₆f complex**
   - Passes electrons from PSII to PSI
   - Pumps H⁺ into lumen

3. **Photosystem I (PSI)** — reaction centre P700
   - Second photon re-energises electrons
   
4. **NADP⁺ reductase**
   - Produces **NADPH**

**ATP production — Chemiosmosis:**
- H⁺ flows back through **ATP synthase** → makes ATP
- Called **photophosphorylation**

**Outputs:**
- ATP → goes to Calvin cycle
- NADPH → goes to Calvin cycle  
- O₂ → released into atmosphere

> 📍 Video [${ts}] — instructor explained PSII and photolysis here
> 📄 PDF Pages 3–4 — full light reactions with four complexes

---
*Grounded in content watched up to ${ts}*
`,

  calvinCycle: (ts) => `
### Stage 2: Calvin Cycle (Light-Independent Reactions)

The Calvin cycle uses ATP and NADPH to build sugar from CO₂.

**Location:** Stroma

**Three phases (per 3 CO₂):**

1. **Carbon fixation**
   - RuBisCO attaches CO₂ to RuBP (5-carbon)
   - Produces 3-PGA (first stable product)

2. **Reduction**
   - ATP and NADPH convert 3-PGA → G3P
   - G3P is a high-energy 3-carbon sugar

3. **Regeneration**
   - 5 of 6 G3P rebuild RuBP using ATP
   - 1 G3P exits as net product

**Balance sheet (3 turns):**
\`\`\`
3 CO₂ in → 9 ATP used → 6 NADPH used → 1 G3P out
\`\`\`

**G3P is converted to:**
- Glucose / sucrose (energy)
- Starch (storage)
- Cellulose (cell walls)

> 📍 Video [${ts}] — instructor explained RuBisCO and carbon fixation here
> 📄 PDF Pages 5–6 — Calvin cycle three phases and balance sheet

---
*Grounded in content watched up to ${ts}*
`,

  rubisco: (ts) => `
### RuBisCO and Photorespiration

**RuBisCO** (ribulose-1,5-bisphosphate carboxylase/oxygenase) fixes carbon in the Calvin cycle.

**Key facts:**
- Most abundant protein on Earth (~0.7 billion tonnes worldwide)
- Very **slow** — fixes only a few CO₂ per second
- Plants compensate by making huge amounts of it

**The problem — Photorespiration:**
- RuBisCO sometimes binds O₂ instead of CO₂
- Produces toxic 2-phosphoglycolate
- Costs ATP, releases CO₂, fixes no new carbon
- Reduces photosynthetic efficiency

**How plants reduce photorespiration:**

| Type | Strategy | Examples |
|---|---|---|
| C3 | No special mechanism | Wheat, rice, most trees |
| C4 | Concentrates CO₂ around RuBisCO | Maize, sugarcane |
| CAM | Opens stomata at night only | Cacti, pineapple |

> 📍 Video [${ts}] — instructor explained why RuBisCO is error-prone
> 📄 PDF Pages 7–8 — RuBisCO, photorespiration, C3/C4/CAM plants

---
*Grounded in content watched up to ${ts}*
`,

  inputs: (ts) => `
### Raw Materials of Photosynthesis

| Input | Entry point | How it gets there |
|---|---|---|
| Water (H₂O) | Roots | Up through xylem to leaves |
| Carbon dioxide (CO₂) | Leaves | Diffuses in through stomata |
| Light (photons) | Leaves | Absorbed by chlorophyll |

**Stomata:**
- Tiny pores on leaves
- CO₂ enters, O₂ exits through same pores
- Plants keep internal O₂ low to reduce photorespiration

> 📍 Video [${ts}] — instructor explained how plants get their raw materials
> 📄 PDF Page 2 — inputs table and stomata role

---
*Grounded in content watched up to ${ts}*
`,

  summary: (ts) => `
### 📋 Summary (00:00 — ${ts})

Here is what you have covered so far:

1. **Photosynthesis** — plants convert light + CO₂ + H₂O → glucose + O₂
2. **Why it matters** — base of all food chains, source of atmospheric oxygen
3. **Chloroplast structure** — thylakoid, granum, lumen, stroma
4. **Chlorophyll** — absorbs red and blue light, reflects green
5. **Stage 1: Light reactions** — PSII → Cyt b₆f → PSI → NADP⁺ reductase; produces ATP, NADPH, O₂
6. **Chemiosmosis** — H⁺ gradient drives ATP synthase → ATP
7. **Stage 2: Calvin cycle** — carbon fixation → reduction → regeneration → G3P
8. **RuBisCO** — fixes CO₂, most abundant protein, causes photorespiration
9. **C3/C4/CAM** — strategies to reduce photorespiration

> 📍 [00:30] — photosynthesis overview
> 📍 [02:00] — chloroplast structure
> 📍 [04:00] — light reactions
> 📍 [07:00] — Calvin cycle
> 📍 [${ts}] — current position
> 📄 PDF Pages 1–8 — all above concepts

---
*Summary grounded in content watched up to ${ts}*
`,

  mockInterview: (ts) => `
### 🎯 Mock Interview — Photosynthesis

Based on content up to **${ts}**:

**Q1:** Write the equation for photosynthesis and explain each component.

**Q2:** Where does the O₂ released during photosynthesis come from — CO₂ or H₂O?

**Q3:** What is the difference between the light-dependent reactions and the Calvin cycle?

**Q4:** What is chemiosmosis and how does it produce ATP?

**Q5:** Why is RuBisCO considered inefficient and what is photorespiration?

---
*Answer below and I will give you feedback!*
`,

  explain: (ts) => `
### Explanation — Last Section Covered

Around **${ts}**, the instructor was covering the **light-dependent reactions**:

**Photolysis — splitting of water:**
\`\`\`
2H₂O → 4H⁺ + 4e⁻ + O₂
\`\`\`
- O₂ released = the oxygen we breathe
- H⁺ stays in lumen to drive ATP synthesis

**Electron transport chain:**
- Excited electrons pass through PSII → Cyt b₆f → PSI
- Energy captured at each step

**Chemiosmosis:**
- H⁺ builds up in lumen
- Flows through ATP synthase → makes ATP
- Called photophosphorylation

> 📍 Video [${ts}] — this was just explained
> 📄 PDF Pages 3–4 — light reactions detail

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

Please ask questions about the **Photosynthesis** lecture loaded in this session.
`
}

export const mockIngest = async (lectureId) => {
  return { success: true, lecture_id: lectureId, message: 'Lecture ready' }
}

export const mockQuery = async (question, lectureId, timestampSeconds) => {
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

  if (q.includes('rubisco') || q.includes('photorespiration') || q.includes('c3') || q.includes('c4') || q.includes('cam'))
    return { answer: responses.rubisco(ts), type: 'past' }

  if (q.includes('calvin') || q.includes('dark reaction') || q.includes('light independent') || q.includes('g3p') || q.includes('carbon fixation') || q.includes('rubp'))
    return { answer: responses.calvinCycle(ts), type: 'past' }

  if (q.includes('light reaction') || q.includes('psii') || q.includes('psi') || q.includes('atp') || q.includes('nadph') || q.includes('chemiosmosis') || q.includes('photolysis') || q.includes('thylakoid'))
    return { answer: responses.lightReactions(ts), type: 'past' }

  if (q.includes('chloroplast') || q.includes('stroma') || q.includes('granum') || q.includes('lumen'))
    return { answer: responses.chloroplast(ts), type: 'past' }

  if (q.includes('chlorophyll') || q.includes('green') || q.includes('pigment') || q.includes('absorb'))
    return { answer: responses.chloroplast(ts), type: 'past' }

  if (q.includes('water') || q.includes('co2') || q.includes('carbon dioxide') || q.includes('stomata') || q.includes('input') || q.includes('raw material'))
    return { answer: responses.inputs(ts), type: 'past' }

  if (q.includes('photosynthesis') || q.includes('what is') || q.includes('definition') || q.includes('equation') || q.includes('glucose') || q.includes('oxygen') || q.includes('overview'))
    return { answer: responses.main(ts), type: 'past' }

  return { answer: responses.main(ts), type: 'past' }
}