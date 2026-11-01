export const mockQuizPool = [
  {
    question:
      "Based on the lecture you just watched, which part of the chloroplast is the site of the Calvin cycle?",
    options: ["Thylakoid membrane", "Stroma", "Lumen", "Granum"],
    correct: 1,
    explanation:
      "The Calvin cycle (light-independent reactions) takes place in the stroma — the fluid surrounding the thylakoids. The thylakoid membrane is where the light-dependent reactions occur.",
  },
  {
    question:
      "What is the primary pigment responsible for absorbing light energy in photosynthesis?",
    options: ["Carotenoid", "Chlorophyll", "Xanthophyll", "Phycobilin"],
    correct: 1,
    explanation:
      "Chlorophyll is the primary pigment in chloroplasts that absorbs light energy, particularly in the blue and red wavelengths, to drive photosynthesis.",
  },
  {
    question:
      "Which of the following is NOT a product of the light-dependent reactions?",
    options: ["ATP", "NADPH", "Oxygen", "Glucose"],
    correct: 3,
    explanation:
      "Glucose is produced during the Calvin cycle (light-independent reactions), not during the light-dependent reactions. The light reactions produce ATP, NADPH, and oxygen.",
  },
  {
    question:
      "Where do the light-dependent reactions of photosynthesis take place?",
    options: [
      "Stroma",
      "Thylakoid membrane",
      "Cytoplasm",
      "Outer chloroplast membrane",
    ],
    correct: 1,
    explanation:
      "The light-dependent reactions occur in the thylakoid membrane, where photosystems I and II are located and where ATP and NADPH are generated.",
  },
  {
    question:
      "What is the main role of water in the light-dependent reactions?",
    options: [
      "It acts as a primary electron donor",
      "It provides carbon for glucose",
      "It absorbs light energy",
      "It stores ATP",
    ],
    correct: 0,
    explanation:
      "Water (H2O) is split during the light-dependent reactions (photolysis) to provide electrons, protons, and oxygen. The electrons replace those lost by Photosystem II.",
  },
];

export const fetchMockQuiz = async () => {
  await new Promise((r) => setTimeout(r, 600));
  return { quiz: mockQuizPool };
};
