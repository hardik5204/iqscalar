const fs = require('fs');
const path = require('path');

// Convert IQ Test Questions
try {
  const iqData = JSON.parse(fs.readFileSync('public/IQ_Test_Questions.json', 'utf8'));
  const iqQuestionsJS = `// Full IQ Questions Dataset - Bundled with the application
// This ensures all questions are always available without external file dependencies

export const iqQuestions = ${JSON.stringify(iqData.iq_questions, null, 2)};

export default iqQuestions;
`;
  fs.writeFileSync('src/data/fullIqQuestions.js', iqQuestionsJS);
  console.log(`✅ Converted ${iqData.iq_questions.length} IQ questions to JavaScript`);
} catch (error) {
  console.error('Error converting IQ questions:', error.message);
}

// Convert Practice Questions
try {
  const practiceData = JSON.parse(fs.readFileSync('public/Practice_Questions.json', 'utf8'));
  const practiceQuestionsJS = `// Full Practice Questions Dataset - Bundled with the application
// This ensures all practice questions are always available without external file dependencies

export const practiceQuestions = ${JSON.stringify(practiceData.practice_questions, null, 2)};

export default practiceQuestions;
`;
  fs.writeFileSync('src/data/fullPracticeQuestions.js', practiceQuestionsJS);
  console.log(`✅ Converted ${practiceData.practice_questions.length} practice questions to JavaScript`);
} catch (error) {
  console.error('Error converting practice questions:', error.message);
}

console.log('🎉 Conversion complete!'); 