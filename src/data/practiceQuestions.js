// Practice Questions Data - Bundled with the application
// This ensures the practice questions are always available without external file dependencies

export const practiceQuestions = [
  {
    id: 1,
    category: "Verbal-Logical Reasoning",
    question_text: "Which word best completes the analogy: HAPPY is to SAD as JOY is to _______?",
    options: {
      "A": "Sorrow",
      "B": "Anger",
      "C": "Fear",
      "D": "Love",
      "E": "Peace"
    },
    answer: "A",
    explanation: "Happy and sad are opposites. Joy and sorrow are also opposites."
  },
  {
    id: 2,
    category: "Numerical & Abstract Reasoning",
    question_text: "What number comes next in the sequence: 2, 4, 8, 16, 32, ?",
    options: {
      "A": "48",
      "B": "56",
      "C": "64",
      "D": "72",
      "E": "80"
    },
    answer: "C",
    explanation: "Each number is multiplied by 2: 2×2=4, 4×2=8, 8×2=16, 16×2=32, 32×2=64."
  },
  {
    id: 3,
    category: "Spatial Reasoning",
    question_text: "If you have 5 different colored balls, how many different ways can you arrange them in a line?",
    options: {
      "A": "25",
      "B": "60",
      "C": "120",
      "D": "240",
      "E": "360"
    },
    answer: "C",
    explanation: "This is a permutation of 5 distinct items: 5! = 5×4×3×2×1 = 120."
  },
  {
    id: 4,
    category: "Verbal-Logical Reasoning",
    question_text: "Complete the analogy: BOOK is to READING as FORK is to _______?",
    options: {
      "A": "Eating",
      "B": "Cooking",
      "C": "Kitchen",
      "D": "Food",
      "E": "Dining"
    },
    answer: "A",
    explanation: "A book is used for reading, a fork is used for eating."
  },
  {
    id: 5,
    category: "Numerical & Abstract Reasoning",
    question_text: "If 3 workers can complete a task in 6 hours, how long would it take 9 workers to complete the same task?",
    options: {
      "A": "1 hour",
      "B": "2 hours",
      "C": "3 hours",
      "D": "4 hours",
      "E": "6 hours"
    },
    answer: "B",
    explanation: "This is an inverse proportion. If 3 workers take 6 hours, then 9 workers (3 times more) will take 1/3 of the time: 6 ÷ 3 = 2 hours."
  },
  {
    id: 6,
    category: "Verbal-Logical Reasoning",
    question_text: "Which word doesn't belong: Apple, Orange, Banana, Carrot",
    options: {
      "A": "Apple",
      "B": "Orange",
      "C": "Banana",
      "D": "Carrot"
    },
    answer: "D",
    explanation: "Carrot is a vegetable, while the others are fruits."
  },
  {
    id: 7,
    category: "Numerical & Abstract Reasoning",
    question_text: "What is the missing number in the sequence: 3, 6, 9, 12, ?",
    options: {
      "A": "14",
      "B": "15",
      "C": "16",
      "D": "18",
      "E": "20"
    },
    answer: "B",
    explanation: "The sequence increases by 3 each time: 3+3=6, 6+3=9, 9+3=12, 12+3=15."
  },
  {
    id: 8,
    category: "Spatial Reasoning",
    question_text: "How many faces does a cube have?",
    options: {
      "A": "4",
      "B": "6",
      "C": "8",
      "D": "12",
      "E": "24"
    },
    answer: "B",
    explanation: "A cube has 6 faces: top, bottom, front, back, left, and right."
  },
  {
    id: 9,
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
    id: 10,
    category: "Numerical & Abstract Reasoning",
    question_text: "What is 25% of 80?",
    options: {
      "A": "15",
      "B": "20",
      "C": "25",
      "D": "30",
      "E": "35"
    },
    answer: "B",
    explanation: "25% = 1/4, so 25% of 80 = 80 ÷ 4 = 20."
  }
];

export default practiceQuestions; 