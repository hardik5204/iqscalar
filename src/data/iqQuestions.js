// IQ Questions Data - Bundled with the application
// This ensures the questions are always available without external file dependencies

export const iqQuestions = [
  {
    id: 1,
    category: "Verbal-Logical Reasoning",
    question_text: "Which of the following words is the most suitable antonym for PROFLIGATE?",
    options: {
      "A": "Lavish",
      "B": "Virtuous", 
      "C": "Thrifty",
      "D": "Obsequious",
      "E": "Morose"
    },
    answer: "C",
    explanation: "Profligate means recklessly extravagant or wasteful. Thrifty means using money and other resources carefully and not wastefully, making it the most direct antonym."
  },
  {
    id: 2,
    category: "Verbal-Logical Reasoning",
    question_text: "If a Sycophant is to Obsequiousness as a Misanthrope is to _______, then what is a Recluse to _______?",
    options: {
      "A": "Cynicism, Gregariousness",
      "B": "Hatred, Seclusion",
      "C": "Benevolence, Introversion",
      "D": "Philanthropy, Hospitality",
      "E": "Malevolence, Garrulousness"
    },
    answer: "B",
    explanation: "A sycophant is characterized by obsequiousness (excessive flattery). A misanthrope is characterized by hatred (of humankind). A recluse is characterized by seclusion."
  },
  {
    id: 3,
    category: "Numerical & Abstract Reasoning",
    question_text: "What number comes next in the following sequence?\n3, 5, 11, 29, 83, ?",
    options: {
      "A": "169",
      "B": "245",
      "C": "211",
      "D": "197",
      "E": "251"
    },
    answer: "B",
    explanation: "The pattern is x_n = 3 * x_{n-1} - 4. \n3*5 - 4 = 11\n3*11 - 4 = 29\n3*29 - 4 = 83\n3*83 - 4 = 245"
  },
  {
    id: 4,
    category: "Numerical & Abstract Reasoning",
    question_text: "A, B, C, and D are four integers.\n1. When A is added to B, the sum is 5 less than C.\n2. The sum of B and C is 1 more than twice D.\n3. The sum of A and D is exactly C.\n4. D is 8.\nWhat is the value of A?",
    options: {
      "A": "-2",
      "B": "-3",
      "C": "0",
      "D": "6",
      "E": "1"
    },
    answer: "D",
    explanation: "1. Start with D = 8.\n2. From statement 3: A + 8 = C.\n3. From statement 2: B + C = 2(8) + 1 = 17.\n4. Isolate A and B: A = C - 8 and B = 17 - C.\n5. Substitute into statement 1: (C - 8) + (17 - C) = C - 5.\n6. Simplify: 9 = C - 5, so C = 14.\n7. Find A: A = C - 8 = 14 - 8 = 6."
  },
  {
    id: 5,
    category: "Verbal-Logical Reasoning",
    question_text: "Complete the analogy: PALAVER is to ORATE as…",
    options: {
      "A": "Enigma is to Conundrum",
      "B": "Cabal is to Conspire",
      "C": "Fealty is to Betray",
      "D": "Chicanery is to Simplify",
      "E": "Diatribe is to Praise"
    },
    answer: "B",
    explanation: "To palaver is to engage in prolonged and idle talk, a specific form of orating. A cabal is a secret political clique or faction, and its members conspire. The relationship is that of a noun (group/concept) to the verb it performs."
  },
  {
    id: 6,
    category: "Numerical & Abstract Reasoning",
    question_text: "In a sequence where each term is the sum of the previous two terms, if the 5th term is 13 and the 7th term is 34, what is the 6th term?",
    options: {
      "A": "21",
      "B": "23",
      "C": "25",
      "D": "27",
      "E": "29"
    },
    answer: "A",
    explanation: "Let the sequence be a, b, c, d, 13, f, 34. Since each term is the sum of the previous two: f = 13 + d and 34 = f + 13. So f = 34 - 13 = 21."
  },
  {
    id: 7,
    category: "Verbal-Logical Reasoning",
    question_text: "All philosophers are thinkers. Some thinkers are writers. Some writers are poets. Which of the following must be true?",
    options: {
      "A": "All philosophers are writers.",
      "B": "Some philosophers are poets.",
      "C": "Some thinkers are poets.",
      "D": "All poets are thinkers.",
      "E": "None of the above must be true."
    },
    answer: "E",
    explanation: "None of the statements must be true. The premises only establish overlapping sets but don't guarantee any of the conclusions in options A-D."
  },
  {
    id: 8,
    category: "Numerical & Abstract Reasoning",
    question_text: "If 3 workers can complete a task in 8 days, how many days would it take 6 workers to complete the same task?",
    options: {
      "A": "2 days",
      "B": "4 days",
      "C": "6 days",
      "D": "8 days",
      "E": "16 days"
    },
    answer: "B",
    explanation: "This is an inverse proportion problem. If 3 workers take 8 days, then 6 workers (double the workers) will take half the time: 8 ÷ 2 = 4 days."
  },
  {
    id: 9,
    category: "Verbal-Logical Reasoning",
    question_text: "Which word best completes the analogy: EPHEMERAL is to PERMANENT as TRANSIENT is to _______?",
    options: {
      "A": "Temporary",
      "B": "Enduring",
      "C": "Fleeting",
      "D": "Momentary",
      "E": "Brief"
    },
    answer: "B",
    explanation: "Ephemeral means short-lived, and permanent is its opposite. Transient also means short-lived, so its opposite would be enduring (long-lasting)."
  },
  {
    id: 10,
    category: "Numerical & Abstract Reasoning",
    question_text: "What is the next number in the sequence: 2, 6, 12, 20, 30, ?",
    options: {
      "A": "40",
      "B": "42",
      "C": "44",
      "D": "46",
      "E": "48"
    },
    answer: "B",
    explanation: "The differences between consecutive terms are: 4, 6, 8, 10, 12. The next difference should be 12, so 30 + 12 = 42."
  },
  {
    id: 11,
    category: "Verbal-Logical Reasoning",
    question_text: "If all roses are flowers and some flowers are red, which statement is definitely true?",
    options: {
      "A": "All roses are red.",
      "B": "Some roses are red.",
      "C": "All red things are flowers.",
      "D": "Some red things are roses.",
      "E": "None of the above is definitely true."
    },
    answer: "E",
    explanation: "None of the statements are definitely true. The premises don't establish any necessary connection between roses and red color."
  },
  {
    id: 12,
    category: "Numerical & Abstract Reasoning",
    question_text: "A clock shows 3:15. What is the angle between the hour and minute hands?",
    options: {
      "A": "7.5°",
      "B": "15°",
      "C": "22.5°",
      "D": "30°",
      "E": "45°"
    },
    answer: "A",
    explanation: "At 3:00, the hour hand is at 90°. In 15 minutes, it moves 15 × 0.5° = 7.5°. The minute hand is at 90°. The angle between them is 7.5°."
  }
];

export default iqQuestions; 