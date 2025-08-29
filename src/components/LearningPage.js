import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import practiceService from '../services/practiceService';

const LearningPage = () => {
  const { isDarkMode } = useTheme();
  const [activeTopic, setActiveTopic] = useState('verbal-logical');
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [learningProgress, setLearningProgress] = useState({});
  const [showTips, setShowTips] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const learningTopics = {
    'verbal-logical': {
      title: 'Verbal & Logical Reasoning',
      icon: '🧠',
      description: 'Master verbal analogies, logical deductions, and critical thinking',
      content: {
        overview: 'Verbal and logical reasoning involves understanding relationships between words, concepts, and ideas. It tests your ability to think critically and make logical connections.',
        keyConcepts: [
          'Analogies: Understanding relationships between pairs of words',
          'Syllogisms: Logical deductions from given premises',
          'Word Relationships: Synonyms, antonyms, and word associations',
          'Critical Thinking: Evaluating arguments and identifying logical fallacies',
          'Verbal Classification: Grouping words by common characteristics',
          'Inference: Drawing conclusions from given information',
          'Deductive Reasoning: Moving from general to specific conclusions'
        ],
        strategies: [
          'Identify the relationship type in analogies',
          'Use elimination method for multiple choice questions',
          'Look for patterns and common themes',
          'Practice with word lists and vocabulary building',
          'Read widely to improve comprehension skills',
          'Break down complex arguments into premises and conclusions',
          'Practice identifying logical fallacies in everyday arguments'
        ],
        examples: [
          {
            type: 'Analogy',
            question: 'Book is to Reading as Fork is to _______?',
            answer: 'Eating',
            explanation: 'A book is used for reading, just as a fork is used for eating. The relationship is tool to its primary function.'
          },
          {
            type: 'Syllogism',
            question: 'All roses are flowers. Some flowers are red. Therefore, some roses are red.',
            answer: 'Cannot be determined',
            explanation: 'The conclusion doesn\'t necessarily follow from the premises. The premises don\'t establish a connection between roses and red color.'
          },
          {
            type: 'Word Relationship',
            question: 'Which word is most similar to "Eloquent"?',
            answer: 'Articulate',
            explanation: 'Both "eloquent" and "articulate" describe the ability to speak clearly and persuasively.'
          }
        ]
      }
    },
    'numerical-abstract': {
      title: 'Numerical & Abstract Reasoning',
      icon: '🔢',
      description: 'Develop mathematical thinking, pattern recognition, and problem-solving skills',
      content: {
        overview: 'Numerical and abstract reasoning tests your ability to work with numbers, identify patterns, and solve mathematical problems. It involves logical thinking with quantitative data.',
        keyConcepts: [
          'Number Sequences: Identifying patterns in numerical series',
          'Mathematical Operations: Understanding relationships between numbers',
          'Percentage and Ratios: Working with proportional relationships',
          'Algebraic Thinking: Solving for unknown variables',
          'Pattern Recognition: Finding rules and relationships',
          'Mathematical Logic: Understanding mathematical proofs and reasoning',
          'Problem Decomposition: Breaking complex problems into simpler parts'
        ],
        strategies: [
          'Look for arithmetic and geometric patterns',
          'Identify the rule governing the sequence',
          'Use trial and error for complex patterns',
          'Practice mental math for speed',
          'Break down complex problems into simpler parts',
          'Use visual representations when possible',
          'Check your work by working backwards'
        ],
        examples: [
          {
            type: 'Number Sequence',
            question: 'What comes next: 2, 4, 8, 16, 32, ?',
            answer: '64',
            explanation: 'Each number is multiplied by 2: 2×2=4, 4×2=8, 8×2=16, 16×2=32, 32×2=64'
          },
          {
            type: 'Mathematical Problem',
            question: 'If 3 workers can complete a task in 8 hours, how long would it take 6 workers?',
            answer: '4 hours',
            explanation: 'This is inverse proportion. If workers double, time halves: 8÷2=4 hours'
          },
          {
            type: 'Percentage Problem',
            question: 'A shirt costs $40. If it\'s discounted by 25%, what is the final price?',
            answer: '$30',
            explanation: '25% of $40 is $10. Final price = $40 - $10 = $30'
          }
        ]
      }
    },
    'pattern-recognition': {
      title: 'Pattern Recognition',
      icon: '🔍',
      description: 'Enhance visual and cognitive pattern recognition abilities',
      content: {
        overview: 'Pattern recognition involves identifying regularities, rules, and structures in data, sequences, or visual information. It\'s crucial for problem-solving and creative thinking.',
        keyConcepts: [
          'Visual Patterns: Recognizing shapes, colors, and visual relationships',
          'Sequential Patterns: Finding order in number and letter sequences',
          'Logical Patterns: Understanding cause-and-effect relationships',
          'Structural Patterns: Identifying organizational principles',
          'Predictive Patterns: Forecasting what comes next',
          'Spatial Patterns: Understanding spatial relationships and transformations',
          'Temporal Patterns: Recognizing patterns over time'
        ],
        strategies: [
          'Look for repeating elements and cycles',
          'Identify the rule or transformation applied',
          'Consider multiple pattern types simultaneously',
          'Use visualization techniques',
          'Practice with different pattern categories',
          'Look for symmetry and balance',
          'Consider both forward and backward patterns'
        ],
        examples: [
          {
            type: 'Visual Pattern',
            question: 'Complete the pattern: Circle, Square, Triangle, Circle, Square, ?',
            answer: 'Triangle',
            explanation: 'The pattern repeats every 3 elements: Circle-Square-Triangle'
          },
          {
            type: 'Number Pattern',
            question: 'What comes next: 1, 3, 6, 10, 15, ?',
            answer: '21',
            explanation: 'This is the sequence of triangular numbers. Each number is the sum of consecutive integers: 1, 1+2=3, 1+2+3=6, etc.'
          },
          {
            type: 'Letter Pattern',
            question: 'Complete: A, C, E, G, ?',
            answer: 'I',
            explanation: 'The pattern skips one letter: A (skip B) C (skip D) E (skip F) G (skip H) I'
          }
        ]
      }
    },
    'spatial-reasoning': {
      title: 'Spatial Reasoning',
      icon: '🎯',
      description: 'Develop spatial awareness and 3D visualization skills',
      content: {
        overview: 'Spatial reasoning involves understanding and manipulating objects in space, visualizing 3D objects from 2D representations, and understanding spatial relationships.',
        keyConcepts: [
          'Mental Rotation: Visualizing objects from different angles',
          'Spatial Visualization: Creating mental images of objects',
          'Pattern Assembly: Understanding how parts fit together',
          'Spatial Orientation: Understanding position and direction',
          '3D to 2D Projection: Converting between dimensions',
          'Spatial Memory: Remembering spatial arrangements',
          'Geometric Transformations: Understanding rotations, reflections, and translations'
        ],
        strategies: [
          'Practice with physical objects and models',
          'Use visualization techniques and mental imagery',
          'Break complex shapes into simpler components',
          'Practice drawing and sketching',
          'Work with puzzles and construction toys',
          'Use computer-aided design tools',
          'Practice mental rotation exercises'
        ],
        examples: [
          {
            type: 'Mental Rotation',
            question: 'If you rotate a cube 90 degrees clockwise, which face becomes the top?',
            answer: 'Depends on the starting position',
            explanation: 'The result depends on which face was originally on top and the axis of rotation.'
          },
          {
            type: 'Pattern Assembly',
            question: 'How many different ways can you arrange 4 identical squares to form a larger square?',
            answer: '1 way',
            explanation: 'There is only one way to arrange 4 identical squares into a 2x2 larger square.'
          },
          {
            type: 'Spatial Visualization',
            question: 'If you fold a piece of paper in half twice, how many layers will you have?',
            answer: '4 layers',
            explanation: 'First fold creates 2 layers, second fold doubles it to 4 layers.'
          }
        ]
      }
    },
    'memory-enhancement': {
      title: 'Memory Enhancement',
      icon: '🧩',
      description: 'Improve memory, concentration, and cognitive retention',
      content: {
        overview: 'Memory enhancement focuses on improving your ability to remember, recall, and retain information. It includes techniques for better concentration and cognitive performance.',
        keyConcepts: [
          'Working Memory: Short-term information processing',
          'Long-term Memory: Permanent information storage',
          'Memory Techniques: Mnemonics and memory aids',
          'Concentration: Focused attention and mental clarity',
          'Memory Consolidation: Converting short-term to long-term memory',
          'Retrieval Strategies: Methods for accessing stored information',
          'Cognitive Load: Managing mental effort and capacity'
        ],
        strategies: [
          'Use mnemonic devices and memory techniques',
          'Practice active recall and spaced repetition',
          'Break information into smaller chunks',
          'Create mental associations and connections',
          'Use visualization and imagery',
          'Practice mindfulness and meditation',
          'Get adequate sleep and exercise regularly'
        ],
        examples: [
          {
            type: 'Mnemonic Device',
            question: 'How can you remember the order of planets from the sun?',
            answer: 'My Very Educated Mother Just Served Us Nine Pizzas',
            explanation: 'This mnemonic represents: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto.'
          },
          {
            type: 'Memory Technique',
            question: 'What\'s the best way to remember a phone number?',
            answer: 'Chunk it into groups',
            explanation: 'Instead of 1234567890, remember it as 123-456-7890 or 12-34-56-78-90.'
          },
          {
            type: 'Active Recall',
            question: 'How can you improve retention when studying?',
            answer: 'Test yourself regularly',
            explanation: 'Active recall through self-testing is more effective than passive re-reading.'
          }
        ]
      }
    }
  };

  useEffect(() => {
    if (practiceMode) {
      loadPracticeQuestions();
    }
  }, [practiceMode, activeTopic]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPracticeQuestions = () => {
    const categoryMap = {
      'verbal-logical': 'Verbal-Logical Reasoning',
      'numerical-abstract': 'Numerical & Abstract Reasoning',
      'pattern-recognition': 'Pattern Recognition'
    };
    
    const questions = practiceService.generatePracticeQuestions(
      categoryMap[activeTopic], 
      10
    );
    setPracticeQuestions(questions);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowExplanation(false);
    setScore(0);
    setTotalQuestions(questions.length);
  };

  const handleAnswerSelect = (answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < practiceQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    } else {
      calculateFinalScore();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  const calculateFinalScore = () => {
    let correct = 0;
    practiceQuestions.forEach((question, index) => {
      if (userAnswers[index] === question.correctIndex) {
        correct++;
      }
    });
    setScore(correct);
    setShowExplanation(true);
    
    // Update learning progress
    updateProgress(activeTopic, 1);
  };

  const startPractice = () => {
    setPracticeMode(true);
  };

  const exitPractice = () => {
    setPracticeMode(false);
    setPracticeQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowExplanation(false);
    setScore(0);
    setTotalQuestions(0);
  };

  const currentQuestion = practiceQuestions[currentQuestionIndex];
  const userAnswer = userAnswers[currentQuestionIndex];
  const isCorrect = userAnswer === currentQuestion?.correctIndex;

  // Learning tips for each topic
  const learningTips = {
    'verbal-logical': [
      'Practice reading diverse materials to improve vocabulary',
      'Learn common logical fallacies to avoid them',
      'Use elimination method for multiple choice questions',
      'Break down complex arguments into premises and conclusions',
      'Practice analogies with everyday objects'
    ],
    'numerical-abstract': [
      'Practice mental math daily for speed and accuracy',
      'Learn common mathematical patterns and sequences',
      'Use visual representations when solving problems',
      'Break complex problems into smaller steps',
      'Practice with real-world applications'
    ],
    'pattern-recognition': [
      'Look for both forward and backward patterns',
      'Consider multiple pattern types simultaneously',
      'Use visualization techniques for complex patterns',
      'Practice with different types of sequences',
      'Look for symmetry and balance in patterns'
    ],
    'spatial-reasoning': [
      'Practice with physical objects and models',
      'Use drawing and sketching to visualize problems',
      'Work with puzzles and construction toys',
      'Practice mental rotation exercises',
      'Use computer-aided design tools'
    ],
    'memory-enhancement': [
      'Use mnemonic devices for better retention',
      'Practice active recall instead of passive reading',
      'Break information into smaller chunks',
      'Create mental associations and connections',
      'Get adequate sleep for memory consolidation'
    ]
  };

  // Update learning progress
  const updateProgress = (topic, completed) => {
    setLearningProgress(prev => ({
      ...prev,
      [topic]: {
        ...prev[topic],
        completed: (prev[topic]?.completed || 0) + completed,
        lastPracticed: new Date().toISOString()
      }
    }));
  };

  if (practiceMode) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-8">
          {/* Practice Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Practice Mode</h1>
            <button
              onClick={exitPractice}
              className={`px-4 py-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              Exit Practice
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Question {currentQuestionIndex + 1} of {practiceQuestions.length}</span>
              <span>{Math.round(((currentQuestionIndex + 1) / practiceQuestions.length) * 100)}% Complete</span>
            </div>
            <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  isDarkMode ? 'bg-blue-500' : 'bg-blue-600'
                }`}
                style={{ width: `${((currentQuestionIndex + 1) / practiceQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          {currentQuestion && (
            <div className={`p-6 rounded-lg mb-6 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
            }`}>
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'
                }`}>
                  {currentQuestion.category}
                </span>
              </div>
              
              <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      userAnswer === index
                        ? isCorrect
                          ? 'border-green-500 bg-green-50 text-green-800'
                          : 'border-red-500 bg-red-50 text-red-800'
                        : showExplanation && index === currentQuestion.correctIndex
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : isDarkMode
                        ? 'border-gray-600 bg-gray-700 hover:border-gray-500'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <div className={`mt-6 p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-blue-50'
                }`}>
                  <h3 className="font-semibold mb-2">Explanation:</h3>
                  <p>{currentQuestion.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-2 rounded-lg ${
                currentQuestionIndex === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            <button
              onClick={handleNextQuestion}
              disabled={userAnswer === undefined}
              className={`px-6 py-2 rounded-lg ${
                userAnswer === undefined
                  ? 'opacity-50 cursor-not-allowed'
                  : isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {currentQuestionIndex === practiceQuestions.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>

          {/* Final Score */}
          {showExplanation && currentQuestionIndex === practiceQuestions.length - 1 && (
            <div className={`mt-8 p-6 rounded-lg text-center ${
              isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
            }`}>
              <h2 className="text-2xl font-bold mb-4">Practice Complete!</h2>
              <p className="text-xl mb-2">
                Your Score: <span className="font-bold text-blue-600">{score}/{totalQuestions}</span>
              </p>
              <p className="text-lg">
                Percentage: <span className="font-bold text-blue-600">{Math.round((score / totalQuestions) * 100)}%</span>
              </p>
              <button
                onClick={loadPracticeQuestions}
                className={`mt-4 px-6 py-2 rounded-lg ${
                  isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                Practice Again
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">IQ Learning Center</h1>
          <p className="text-xl opacity-80">
            Master cognitive skills and boost your IQ through structured learning and practice
          </p>
        </div>

        {/* Topic Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {Object.entries(learningTopics).map(([key, topic]) => (
            <button
              key={key}
              onClick={() => setActiveTopic(key)}
              className={`p-6 rounded-lg text-left transition-all ${
                activeTopic === key
                  ? isDarkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white hover:bg-gray-50 shadow-lg'
              }`}
            >
              <div className="text-3xl mb-3">{topic.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{topic.title}</h3>
              <p className="text-sm opacity-80">{topic.description}</p>
            </button>
          ))}
        </div>

        {/* Learning Content */}
        <div className={`p-8 rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
        }`}>
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">
              {learningTopics[activeTopic].icon} {learningTopics[activeTopic].title}
            </h2>
            <p className="text-lg opacity-80">{learningTopics[activeTopic].content.overview}</p>
          </div>

          {/* Key Concepts */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Key Concepts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningTopics[activeTopic].content.keyConcepts.map((concept, index) => (
                <div key={index} className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className="flex items-start">
                    <span className={`inline-block w-6 h-6 rounded-full text-sm font-bold text-center mr-3 mt-0.5 ${
                      isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
                    } text-white`}>
                      {index + 1}
                    </span>
                    <p>{concept}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategies */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Learning Strategies</h3>
            <div className="space-y-3">
              {learningTopics[activeTopic].content.strategies.map((strategy, index) => (
                <div key={index} className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-green-50'
                }`}>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <p>{strategy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Examples */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Practice Examples</h3>
            <div className="space-y-6">
              {learningTopics[activeTopic].content.examples.map((example, index) => (
                <div key={index} className={`p-6 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-blue-50'
                }`}>
                  <div className="mb-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      isDarkMode ? 'bg-blue-600' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {example.type}
                    </span>
                  </div>
                  <p className="font-semibold mb-2">{example.question}</p>
                  <p className="mb-2">
                    <strong>Answer:</strong> {example.answer}
                  </p>
                  <p className="text-sm opacity-80">{example.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Progress */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Your Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(learningTopics).map(([key, topic]) => {
                const progress = learningProgress[key] || { completed: 0 };
                return (
                  <div key={key} className={`p-4 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg">{topic.icon}</span>
                      <span className="text-sm font-medium">{progress.completed} completed</span>
                    </div>
                    <div className="text-sm font-medium mb-2">{topic.title}</div>
                    <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isDarkMode ? 'bg-green-500' : 'bg-green-600'
                        }`}
                        style={{ width: `${Math.min((progress.completed / 10) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Learning Tips */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold">Learning Tips</h3>
              <button
                onClick={() => setShowTips(!showTips)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                {showTips ? 'Hide Tips' : 'Show Tips'}
              </button>
            </div>
            {showTips && (
              <div className={`p-6 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-yellow-50'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold">
                    💡 {learningTopics[activeTopic].title} Tips
                  </h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentTipIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentTipIndex === 0}
                      className={`px-3 py-1 rounded ${
                        currentTipIndex === 0
                          ? 'opacity-50 cursor-not-allowed'
                          : isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      ←
                    </button>
                    <span className="px-3 py-1 text-sm">
                      {currentTipIndex + 1} / {learningTips[activeTopic]?.length || 1}
                    </span>
                    <button
                      onClick={() => setCurrentTipIndex(prev => Math.min((learningTips[activeTopic]?.length || 1) - 1, prev + 1))}
                      disabled={currentTipIndex === (learningTips[activeTopic]?.length || 1) - 1}
                      className={`px-3 py-1 rounded ${
                        currentTipIndex === (learningTips[activeTopic]?.length || 1) - 1
                          ? 'opacity-50 cursor-not-allowed'
                          : isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      →
                    </button>
                  </div>
                </div>
                <p className="text-lg">
                  {learningTips[activeTopic]?.[currentTipIndex] || 'Practice regularly to improve your skills!'}
                </p>
              </div>
            )}
          </div>

          {/* Practice Button */}
          <div className="text-center">
            <button
              onClick={startPractice}
              className={`px-8 py-4 rounded-lg text-lg font-semibold ${
                isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-all transform hover:scale-105`}
            >
              🎯 Start Practice Session
            </button>
          </div>
        </div>

        {/* IQ Improvement Tips */}
        <div className={`mt-12 p-8 rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
        }`}>
          <h2 className="text-3xl font-bold mb-6 text-center">🧠 IQ Improvement Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className={`p-6 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-yellow-50'
            }`}>
              <h3 className="text-xl font-semibold mb-3">🧩 Solve Puzzles</h3>
              <p>Regular puzzle solving improves pattern recognition and logical thinking skills.</p>
            </div>
            <div className={`p-6 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-green-50'
            }`}>
              <h3 className="text-xl font-semibold mb-3">📚 Read Widely</h3>
              <p>Reading diverse materials expands vocabulary and improves comprehension abilities.</p>
            </div>
            <div className={`p-6 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-blue-50'
            }`}>
              <h3 className="text-xl font-semibold mb-3">🎯 Practice Regularly</h3>
              <p>Consistent practice with IQ-style questions builds familiarity and improves performance.</p>
            </div>
            <div className={`p-6 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-purple-50'
            }`}>
              <h3 className="text-xl font-semibold mb-3">🧮 Learn Math</h3>
              <p>Mathematical thinking enhances logical reasoning and problem-solving abilities.</p>
            </div>
            <div className={`p-6 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-red-50'
            }`}>
              <h3 className="text-xl font-semibold mb-3">💭 Critical Thinking</h3>
              <p>Question assumptions, analyze arguments, and evaluate evidence systematically.</p>
            </div>
            <div className={`p-6 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'
            }`}>
              <h3 className="text-xl font-semibold mb-3">🎨 Creative Activities</h3>
              <p>Engage in creative pursuits to enhance divergent thinking and problem-solving.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
