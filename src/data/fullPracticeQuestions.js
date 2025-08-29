// Full Practice Questions Dataset - Bundled with the application
// This ensures all practice questions are always available without external file dependencies

export const practiceQuestions = [
  {
    "id": 1,
    "category": "Verbal-Logical Reasoning",
    "question_text": "Which word best completes the analogy: EPHEMERAL is to PERMANENT as TRANSIENT is to _______?",
    "options": {
      "A": "Temporary",
      "B": "Enduring",
      "C": "Fleeting",
      "D": "Brief",
      "E": "Momentary"
    },
    "answer": "B",
    "explanation": "Ephemeral means lasting for a very short time, and permanent means lasting forever. Transient also means lasting for a short time, so its opposite would be enduring (lasting for a long time)."
  },
  {
    "id": 2,
    "category": "Numerical & Abstract Reasoning",
    "question_text": "What number comes next in the sequence: 2, 6, 12, 20, 30, ?",
    "options": {
      "A": "40",
      "B": "42",
      "C": "44",
      "D": "46",
      "E": "48"
    },
    "answer": "B",
    "explanation": "The difference between consecutive terms increases by 2: 4, 6, 8, 10, so the next difference is 12. 30 + 12 = 42."
  },
  {
    "id": 3,
    "category": "Verbal-Logical Reasoning",
    "question_text": "All roses are flowers. Some flowers are red. Some roses are white. Which of the following must be true?",
    "options": {
      "A": "All red flowers are roses",
      "B": "Some white flowers are roses",
      "C": "All white flowers are roses",
      "D": "Some roses are red",
      "E": "No white flowers are red"
    },
    "answer": "B",
    "explanation": "Since all roses are flowers and some roses are white, it follows that some white flowers are roses. The other options are not necessarily true based on the given statements."
  },
  {
    "id": 4,
    "category": "Numerical & Abstract Reasoning",
    "question_text": "If 3 workers can complete a task in 8 hours, how many hours would it take 6 workers to complete the same task?",
    "options": {
      "A": "2",
      "B": "4",
      "C": "6",
      "D": "12",
      "E": "16"
    },
    "answer": "B",
    "explanation": "This is an inverse proportion problem. If 3 workers take 8 hours, then 6 workers (double the workers) will take half the time: 8 ÷ 2 = 4 hours."
  },
  {
    "id": 5,
    "category": "Pattern Recognition",
    "question_text": "Complete the pattern: 1, 3, 6, 10, 15, ?",
    "options": {
      "A": "18",
      "B": "20",
      "C": "21",
      "D": "24",
      "E": "25"
    },
    "answer": "C",
    "explanation": "This is the sequence of triangular numbers. Each number is the sum of consecutive integers starting from 1: 1, 1+2=3, 1+2+3=6, 1+2+3+4=10, 1+2+3+4+5=15, 1+2+3+4+5+6=21."
  },
  {
    "id": 6,
    "category": "Verbal-Logical Reasoning",
    "question_text": "Which word is most similar in meaning to 'UBIQUITOUS'?",
    "options": {
      "A": "Rare",
      "B": "Commonplace",
      "C": "Hidden",
      "D": "Expensive",
      "E": "Ancient"
    },
    "answer": "B",
    "explanation": "Ubiquitous means present, appearing, or found everywhere. Commonplace means occurring or found in ordinary practice, which is the closest synonym."
  },
  {
    "id": 7,
    "category": "Numerical & Abstract Reasoning",
    "question_text": "If x + y = 10 and xy = 24, what is the value of x² + y²?",
    "options": {
      "A": "52",
      "B": "76",
      "C": "100",
      "D": "124",
      "E": "148"
    },
    "answer": "A",
    "explanation": "Use the formula (x + y)² = x² + y² + 2xy. We know x + y = 10 and xy = 24. So 10² = x² + y² + 2(24). 100 = x² + y² + 48. Therefore, x² + y² = 100 - 48 = 52."
  },
  {
    "id": 8,
    "category": "Verbal-Logical Reasoning",
    "question_text": "Complete the analogy: BOOK is to LIBRARY as MONEY is to _______?",
    "options": {
      "A": "Bank",
      "B": "Wallet",
      "C": "Store",
      "D": "Person",
      "E": "Work"
    },
    "answer": "A",
    "explanation": "A library is a place where books are stored and managed. Similarly, a bank is a place where money is stored and managed."
  },
  {
    "id": 9,
    "category": "Pattern Recognition",
    "question_text": "What comes next in the sequence: 2, 4, 8, 16, 32, ?",
    "options": {
      "A": "48",
      "B": "56",
      "C": "64",
      "D": "72",
      "E": "80"
    },
    "answer": "C",
    "explanation": "Each number is multiplied by 2 to get the next number: 2×2=4, 4×2=8, 8×2=16, 16×2=32, 32×2=64."
  },
  {
    "id": 10,
    "category": "Verbal-Logical Reasoning",
    "question_text": "Which of the following is the best definition of 'PARADOX'?",
    "options": {
      "A": "A statement that is obviously true",
      "B": "A statement that contradicts itself but may be true",
      "C": "A statement that is always false",
      "D": "A statement that is difficult to understand",
      "E": "A statement that proves something"
    },
    "answer": "B",
    "explanation": "A paradox is a statement that seems to contradict itself or go against common sense, but may actually be true or reveal a deeper truth."
  },
  {
    "id": 11,
    "category": "Numerical & Abstract Reasoning",
    "question_text": "A train travels 120 km in 2 hours. If it maintains the same speed, how long will it take to travel 300 km?",
    "options": {
      "A": "3 hours",
      "B": "4 hours",
      "C": "5 hours",
      "D": "6 hours",
      "E": "7 hours"
    },
    "answer": "C",
    "explanation": "Speed = distance/time = 120/2 = 60 km/h. Time = distance/speed = 300/60 = 5 hours."
  },
  {
    "id": 12,
    "category": "Pattern Recognition",
    "question_text": "Complete the pattern: 1, 4, 9, 16, 25, ?",
    "options": {
      "A": "30",
      "B": "36",
      "C": "42",
      "D": "49",
      "E": "56"
    },
    "answer": "B",
    "explanation": "This is the sequence of perfect squares: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25, 6²=36."
  },
  {
    "id": 13,
    "category": "Verbal-Logical Reasoning",
    "question_text": "If all A are B, and some B are C, which of the following must be true?",
    "options": {
      "A": "All A are C",
      "B": "Some A are C",
      "C": "No A are C",
      "D": "All C are A",
      "E": "None of the above"
    },
    "answer": "E",
    "explanation": "None of the statements must be true. The premises don't provide enough information to determine the relationship between A and C."
  },
  {
    "id": 14,
    "category": "Numerical & Abstract Reasoning",
    "question_text": "If 20% of a number is 40, what is 60% of the same number?",
    "options": {
      "A": "60",
      "B": "80",
      "C": "100",
      "D": "120",
      "E": "140"
    },
    "answer": "D",
    "explanation": "If 20% = 40, then 100% = 40 ÷ 0.2 = 200. Therefore, 60% = 200 × 0.6 = 120."
  },
  {
    "id": 15,
    "category": "Verbal-Logical Reasoning",
    "question_text": "Which word is most opposite in meaning to 'CONCISE'?",
    "options": {
      "A": "Brief",
      "B": "Verbose",
      "C": "Clear",
      "D": "Accurate",
      "E": "Simple"
    },
    "answer": "B",
    "explanation": "Concise means brief and to the point. Verbose means using more words than necessary, which is the opposite."
  },
  {
    "id": 16,
    "category": "Pattern Recognition",
    "question_text": "What comes next in the sequence: 1, 3, 6, 10, 15, 21, ?",
    "options": {
      "A": "25",
      "B": "28",
      "C": "30",
      "D": "35",
      "E": "36"
    },
    "answer": "B",
    "explanation": "This is the sequence of triangular numbers. Each number is the sum of consecutive integers: 1, 1+2=3, 1+2+3=6, etc. The next number is 1+2+3+4+5+6+7=28."
  },
  {
    "id": 17,
    "category": "Verbal-Logical Reasoning",
    "question_text": "Complete the analogy: DOCTOR is to HOSPITAL as TEACHER is to _______?",
    "options": {
      "A": "Student",
      "B": "School",
      "C": "Book",
      "D": "Classroom",
      "E": "Education"
    },
    "answer": "B",
    "explanation": "A hospital is where doctors work. Similarly, a school is where teachers work."
  },
  {
    "id": 18,
    "category": "Numerical & Abstract Reasoning",
    "question_text": "If a rectangle has a perimeter of 20 units and an area of 24 square units, what are its dimensions?",
    "options": {
      "A": "4 × 6",
      "B": "3 × 8",
      "C": "2 × 12",
      "D": "5 × 5",
      "E": "6 × 4"
    },
    "answer": "A",
    "explanation": "Let the dimensions be x and y. Then 2x + 2y = 20 (perimeter) and xy = 24 (area). From the perimeter, x + y = 10. The numbers that add to 10 and multiply to 24 are 4 and 6."
  },
  {
    "id": 19,
    "category": "Pattern Recognition",
    "question_text": "Complete the pattern: 2, 6, 12, 20, 30, 42, ?",
    "options": {
      "A": "50",
      "B": "54",
      "C": "56",
      "D": "60",
      "E": "64"
    },
    "answer": "C",
    "explanation": "The differences between consecutive terms are: 4, 6, 8, 10, 12. The next difference is 14. 42 + 14 = 56."
  },
  {
    "id": 20,
    "category": "Verbal-Logical Reasoning",
    "question_text": "Which of the following words is most similar in meaning to 'DILIGENT'?",
    "options": {
      "A": "Lazy",
      "B": "Hardworking",
      "C": "Intelligent",
      "D": "Friendly",
      "E": "Creative"
    },
    "answer": "B",
    "explanation": "Diligent means having or showing care and conscientiousness in one's work or duties, which is synonymous with hardworking."
  },
  {
    "id": 21,
    "category": "Numerical & Abstract Reasoning",
    "question_text": "If 15% of a number is 45, what is 25% of the same number?",
    "options": {
      "A": "60",
      "B": "75",
      "C": "90",
      "D": "105",
      "E": "120"
    },
    "answer": "B",
    "explanation": "If 15% = 45, then 100% = 45 ÷ 0.15 = 300. Therefore, 25% = 300 × 0.25 = 75."
  },
  {
    "id": 22,
    "category": "Verbal-Logical Reasoning",
    "question_text": "All mammals are animals. Some animals are pets. Some mammals are dogs. Which of the following must be true?",
    "options": {
      "A": "All pets are mammals",
      "B": "Some pets are mammals",
      "C": "All dogs are pets",
      "D": "Some animals are dogs",
      "E": "All mammals are pets"
    },
    "answer": "D",
    "explanation": "Since all mammals are animals and some mammals are dogs, it follows that some animals are dogs."
  },
  {
    "id": 23,
    "category": "Pattern Recognition",
    "question_text": "What comes next in the sequence: 1, 2, 4, 8, 16, 32, ?",
    "options": {
      "A": "48",
      "B": "56",
      "C": "64",
      "D": "72",
      "E": "80"
    },
    "answer": "C",
    "explanation": "Each number is multiplied by 2: 1×2=2, 2×2=4, 4×2=8, 8×2=16, 16×2=32, 32×2=64."
  },
  {
    "id": 24,
    "category": "Verbal-Logical Reasoning",
    "question_text": "Which word is most opposite in meaning to 'HONEST'?",
    "options": {
      "A": "Truthful",
      "B": "Dishonest",
      "C": "Kind",
      "D": "Brave",
      "E": "Smart"
    },
    "answer": "B",
    "explanation": "Honest means truthful and sincere. Dishonest means not honest, which is the direct opposite."
  },
  {
    "id": 25,
    "category": "Pattern Recognition",
    "question_text": "Complete the pattern: 2, 4, 8, 16, 32, 64, ?",
    "options": {
      "A": "96",
      "B": "112",
      "C": "128",
      "D": "144",
      "E": "160"
    },
    "answer": "C",
    "explanation": "Each number is multiplied by 2: 2×2=4, 4×2=8, 8×2=16, 16×2=32, 32×2=64, 64×2=128."
  },
  {
    "id": 26,
    "category": "Verbal-Logical Reasoning",
    "question_text": "All teachers are educators. Some educators are mentors. Some teachers are professors. Which of the following must be true?",
    "options": {
      "A": "All educators are teachers",
      "B": "Some educators are teachers",
      "C": "All professors are teachers",
      "D": "Some mentors are teachers",
      "E": "All teachers are professors"
    },
    "answer": "B",
    "explanation": "Since all teachers are educators, it follows that some educators are teachers."
  },
  {
    "id": 27,
    "category": "Numerical & Abstract Reasoning",
    "question_text": "If x - y = 5 and x + y = 15, what is the value of x?",
    "options": {
      "A": "5",
      "B": "8",
      "C": "10",
      "D": "12",
      "E": "15"
    },
    "answer": "C",
    "explanation": "Add the two equations: (x - y) + (x + y) = 5 + 15. 2x = 20. x = 10."
  },
  {
    "id": 28,
    "category": "Pattern Recognition",
    "question_text": "What comes next in the sequence: 1, 3, 6, 10, 15, 21, 28, ?",
    "options": {
      "A": "35",
      "B": "36",
      "C": "37",
      "D": "38",
      "E": "39"
    },
    "answer": "B",
    "explanation": "This is the sequence of triangular numbers. Each number is the sum of consecutive integers: 1, 1+2=3, 1+2+3=6, etc. The next number is 1+2+3+4+5+6+7+8=36."
  },
  {
    "id": 29,
    "category": "Verbal-Logical Reasoning",
    "question_text": "Which word best completes the analogy: HOT is to COLD as WARM is to _______?",
    "options": {
      "A": "Cool",
      "B": "Freezing",
      "C": "Tepid",
      "D": "Boiling",
      "E": "Mild"
    },
    "answer": "A",
    "explanation": "Hot and cold are opposites. Warm and cool are also opposites."
  },
  {
    "id": 30,
    "category": "Numerical & Abstract Reasoning",
    "question_text": "If 35% of a number is 70, what is the number?",
    "options": {
      "A": "150",
      "B": "180",
      "C": "200",
      "D": "220",
      "E": "250"
    },
    "answer": "C",
    "explanation": "If 35% = 70, then 100% = 70 ÷ 0.35 = 200."
  },
  {
    "id": 31,
    "category": "Verbal-Logical Reasoning",
    "question_text": "Complete the analogy: BEE is to HONEY as COW is to _______?",
    "options": {
      "A": "Milk",
      "B": "Meat",
      "C": "Leather",
      "D": "Grass",
      "E": "Farm"
    },
    "answer": "A",
    "explanation": "A bee produces honey. A cow produces milk."
  },
  {
    "id": 32,
    "category": "Pattern Recognition",
    "question_text": "Complete the pattern: 1, 4, 9, 16, 25, 36, 49, ?",
    "options": {
      "A": "56",
      "B": "60",
      "C": "64",
      "D": "68",
      "E": "72"
    },
    "answer": "C",
    "explanation": "This is the sequence of perfect squares: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25, 6²=36, 7²=49, 8²=64."
  },
  {
    "id": 33,
    "category": "Verbal-Logical Reasoning",
    "question_text": "Which of the following words is most similar in meaning to 'DILIGENT'?",
    "options": {
      "A": "Lazy",
      "B": "Hardworking",
      "C": "Intelligent",
      "D": "Friendly",
      "E": "Creative"
    },
    "answer": "B",
    "explanation": "Diligent means having or showing care and conscientiousness in one's work or duties, which is synonymous with hardworking."
  },
  {
    "id": 34,
    "category": "Numerical & Abstract Reasoning",
    "question_text": "A car travels 240 km in 4 hours. What is its average speed in km/h?",
    "options": {
      "A": "50",
      "B": "55",
      "C": "60",
      "D": "65",
      "E": "70"
    },
    "answer": "C",
    "explanation": "Average speed = total distance ÷ total time = 240 ÷ 4 = 60 km/h."
  },
  {
    "id": 35,
    "category": "Pattern Recognition",
    "question_text": "What comes next in the sequence: 2, 6, 12, 20, 30, 42, 56, ?",
    "options": {
      "A": "70",
      "B": "72",
      "C": "74",
      "D": "76",
      "E": "78"
    },
    "answer": "B",
    "explanation": "The differences between consecutive terms are: 4, 6, 8, 10, 12, 14. The next difference is 16. 56 + 16 = 72."
  },
  {
    "id": 36,
    "category": "Verbal-Logical Reasoning",
    "question_text": "Which word is most opposite in meaning to 'BRAVE'?",
    "options": {
      "A": "Strong",
      "B": "Cowardly",
      "C": "Wise",
      "D": "Kind",
      "E": "Honest"
    },
    "answer": "B",
    "explanation": "Brave means ready to face danger or pain. Cowardly means lacking courage, which is the opposite."
  },
  {
    "id": 37,
    "category": "Numerical & Abstract Reasoning",
    "question_text": "If 45% of a number is 90, what is 55% of the same number?",
    "options": {
      "A": "100",
      "B": "110",
      "C": "120",
      "D": "130",
      "E": "140"
    },
    "answer": "B",
    "explanation": "If 45% = 90, then 100% = 90 ÷ 0.45 = 200. Therefore, 55% = 200 × 0.55 = 110."
  },
  {
    "id": 38,
    "category": "Verbal-Logical Reasoning",
    "question_text": "Complete the analogy: DOG is to PUPPY as CAT is to _______?",
    "options": {
      "A": "Kitten",
      "B": "Cub",
      "C": "Baby",
      "D": "Young",
      "E": "Small"
    },
    "answer": "A",
    "explanation": "A puppy is a young dog. A kitten is a young cat."
  },
  {
    "id": 39,
    "category": "Pattern Recognition",
    "question_text": "What comes next in the sequence: 1, 2, 4, 7, 11, 16, 22, ?",
    "options": {
      "A": "28",
      "B": "29",
      "C": "30",
      "D": "31",
      "E": "32"
    },
    "answer": "B",
    "explanation": "The differences between consecutive terms are: 1, 2, 3, 4, 5, 6. The next difference is 7. 22 + 7 = 29."
  },
  {
    "id": 40,
    "category": "Verbal-Logical Reasoning",
    "question_text": "Which of the following words is most similar in meaning to 'PRUDENT'?",
    "options": {
      "A": "Careful",
      "B": "Quick",
      "C": "Loud",
      "D": "Funny",
      "E": "Strong"
    },
    "answer": "A",
    "explanation": "Prudent means acting with or showing care and thought for the future, which is synonymous with careful."
  },
  {
    "id": 41,
    "category": "Numerical & Abstract Reasoning",
    "question_text": "If 2x + 3y = 12 and x + 2y = 7, what is the value of y?",
    "options": {
      "A": "1",
      "B": "2",
      "C": "3",
      "D": "4",
      "E": "5"
    },
    "answer": "B",
    "explanation": "From the second equation: x = 7 - 2y. Substitute into the first equation: 2(7 - 2y) + 3y = 12. 14 - 4y + 3y = 12. 14 - y = 12. y = 2."
  },
  {
    "id": 42,
    "category": "Pattern Recognition",
    "question_text": "Complete the pattern: 3, 6, 11, 18, 27, 38, ?",
    "options": {
      "A": "49",
      "B": "51",
      "C": "53",
      "D": "55",
      "E": "57"
    },
    "answer": "B",
    "explanation": "The differences between consecutive terms are: 3, 5, 7, 9, 11. The next difference is 13. 38 + 13 = 51."
  },
  {
    "id": 43,
    "category": "Verbal-Logical Reasoning",
    "question_text": "All musicians are artists. Some artists are performers. Some musicians are singers. Which of the following must be true?",
    "options": {
      "A": "All artists are musicians",
      "B": "Some artists are musicians",
      "C": "All singers are musicians",
      "D": "Some performers are musicians",
      "E": "All musicians are singers"
    },
    "answer": "B",
    "explanation": "Since all musicians are artists, it follows that some artists are musicians."
  },
  {
    "id": 44,
    "category": "Numerical & Abstract Reasoning",
    "question_text": "If 50% of a number is 100, what is 25% of the same number?",
    "options": {
      "A": "25",
      "B": "40",
      "C": "50",
      "D": "75",
      "E": "100"
    },
    "answer": "C",
    "explanation": "If 50% = 100, then 100% = 100 ÷ 0.5 = 200. Therefore, 25% = 200 × 0.25 = 50."
  },
  {
    "id": 45,
    "category": "Verbal-Logical Reasoning",
    "question_text": "Which word best completes the analogy: FAST is to SLOW as QUICK is to _______?",
    "options": {
      "A": "Rapid",
      "B": "Swift",
      "C": "Gradual",
      "D": "Sudden",
      "E": "Immediate"
    },
    "answer": "C",
    "explanation": "Fast and slow are opposites. Quick and gradual are also opposites."
  },
  {
    "id": 46,
    "category": "Pattern Recognition",
    "question_text": "What comes next in the sequence: 1, 3, 7, 15, 31, 63, ?",
    "options": {
      "A": "95",
      "B": "105",
      "C": "115",
      "D": "125",
      "E": "127"
    },
    "answer": "E",
    "explanation": "Each number is multiplied by 2 and then 1 is added: 1×2+1=3, 3×2+1=7, 7×2+1=15, 15×2+1=31, 31×2+1=63, 63×2+1=127."
  },
  {
    "id": 47,
    "category": "Verbal-Logical Reasoning",
    "question_text": "Which of the following words is most similar in meaning to 'GENEROUS'?",
    "options": {
      "A": "Lazy",
      "B": "Kind",
      "C": "Intelligent",
      "D": "Friendly",
      "E": "Creative"
    },
    "answer": "B",
    "explanation": "Generous means willing to give or share freely. Kind means having a gentle and considerate nature, which is similar."
  },
  {
    "id": 48,
    "category": "Numerical & Abstract Reasoning",
    "question_text": "A square has a side length of 7 units. What is its perimeter?",
    "options": {
      "A": "14",
      "B": "21",
      "C": "28",
      "D": "35",
      "E": "42"
    },
    "answer": "C",
    "explanation": "Perimeter of a square = 4 × side length = 4 × 7 = 28 units."
  },
  {
    "id": 49,
    "category": "Pattern Recognition",
    "question_text": "Complete the pattern: 2, 5, 10, 17, 26, 37, ?",
    "options": {
      "A": "48",
      "B": "50",
      "C": "52",
      "D": "54",
      "E": "56"
    },
    "answer": "B",
    "explanation": "The differences between consecutive terms are: 3, 5, 7, 9, 11. The next difference is 13. 37 + 13 = 50."
  },
  {
    "id": 50,
    "category": "Verbal-Logical Reasoning",
    "question_text": "Complete the analogy: BIRD is to FLY as FISH is to _______?",
    "options": {
      "A": "Swim",
      "B": "Water",
      "C": "Ocean",
      "D": "Gill",
      "E": "Scale"
    },
    "answer": "A",
    "explanation": "A bird's primary mode of movement is flying. A fish's primary mode of movement is swimming."
  },
  {
    "id": 51,
    "category": "Numerical & Abstract Reasoning",
    "question_text": "If 60% of a number is 120, what is 40% of the same number?",
    "options": {
      "A": "60",
      "B": "70",
      "C": "80",
      "D": "90",
      "E": "100"
    },
    "answer": "C",
    "explanation": "If 60% = 120, then 100% = 120 ÷ 0.6 = 200. Therefore, 40% = 200 × 0.4 = 80."
  },
  {
    "id": 52,
    "category": "Verbal-Logical Reasoning",
    "question_text": "Which word is most opposite in meaning to 'WISE'?",
    "options": {
      "A": "Smart",
      "B": "Foolish",
      "C": "Clever",
      "D": "Intelligent",
      "E": "Knowledgeable"
    },
    "answer": "B",
    "explanation": "Wise means having or showing experience, knowledge, and good judgment. Foolish means lacking good sense or judgment, which is the opposite."
  },
  {
    "id": 53,
    "category": "Pattern Recognition",
    "question_text": "What comes next in the sequence: 1, 4, 9, 16, 25, 36, 49, 64, ?",
    "options": {
      "A": "72",
      "B": "80",
      "C": "81",
      "D": "88",
      "E": "96"
    },
    "answer": "C",
    "explanation": "This is the sequence of perfect squares: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25, 6²=36, 7²=49, 8²=64, 9²=81."
  },
  {
    "id": 54,
    "category": "Verbal-Logical Reasoning",
    "question_text": "All scientists are researchers. Some researchers are professors. Some scientists are biologists. Which of the following must be true?",
    "options": {
      "A": "All researchers are scientists",
      "B": "Some researchers are scientists",
      "C": "All biologists are scientists",
      "D": "Some professors are scientists",
      "E": "All scientists are biologists"
    },
    "answer": "B",
    "explanation": "Since all scientists are researchers, it follows that some researchers are scientists."
  },
  {
    "id": 55,
    "category": "Numerical & Abstract Reasoning",
    "question_text": "If 3x + 2y = 18 and x + y = 7, what is the value of x?",
    "options": {
      "A": "2",
      "B": "3",
      "C": "4",
      "D": "5",
      "E": "6"
    },
    "answer": "C",
    "explanation": "From the second equation: y = 7 - x. Substitute into the first equation: 3x + 2(7 - x) = 18. 3x + 14 - 2x = 18. x + 14 = 18. x = 4."
  },
  {
    "id": 56,
    "category": "Pattern Recognition",
    "question_text": "What comes next in the sequence: 1, 2, 4, 7, 11, 16, 22, 29, ?",
    "options": {
      "A": "36",
      "B": "37",
      "C": "38",
      "D": "39",
      "E": "40"
    },
    "answer": "B",
    "explanation": "The differences between consecutive terms are: 1, 2, 3, 4, 5, 6, 7. The next difference is 8. 29 + 8 = 37."
  },
  {
    "id": 57,
    "category": "Verbal-Logical Reasoning",
    "question_text": "Which word best completes the analogy: LIGHT is to HEAVY as THIN is to _______?",
    "options": {
      "A": "Fat",
      "B": "Wide",
      "C": "Thick",
      "D": "Broad",
      "E": "Large"
    },
    "answer": "C",
    "explanation": "Light and heavy are opposites. Thin and thick are also opposites."
  },
  {
    "id": 58,
    "category": "Numerical & Abstract Reasoning",
    "question_text": "If 70% of a number is 140, what is the number?",
    "options": {
      "A": "180",
      "B": "200",
      "C": "220",
      "D": "240",
      "E": "260"
    },
    "answer": "B",
    "explanation": "If 70% = 140, then 100% = 140 ÷ 0.7 = 200."
  },
  {
    "id": 59,
    "category": "Verbal-Logical Reasoning",
    "question_text": "Complete the analogy: TREE is to FOREST as STAR is to _______?",
    "options": {
      "A": "Sky",
      "B": "Galaxy",
      "C": "Night",
      "D": "Space",
      "E": "Universe"
    },
    "answer": "B",
    "explanation": "A forest is a collection of trees. A galaxy is a collection of stars."
  },
  {
    "id": 60,
    "category": "Pattern Recognition",
    "question_text": "Complete the pattern: 1, 4, 9, 16, 25, 36, 49, 64, 81, ?",
    "options": {
      "A": "90",
      "B": "95",
      "C": "100",
      "D": "105",
      "E": "110"
    },
    "answer": "C",
    "explanation": "This is the sequence of perfect squares: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25, 6²=36, 7²=49, 8²=64, 9²=81, 10²=100."
  }
];

export default practiceQuestions;
