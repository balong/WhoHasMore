'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Trophy, Target, TrendingUp } from 'lucide-react';
import { useGameStore } from '../_stores/gameStore';
import { Question } from '../_stores/gameStore';
import { cleanLocationName } from '../_utils/stateNames';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: 'A' | 'B') => void;
}

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const { gameState, selectedAnswer, wasAnswerCorrect } = useGameStore();
  const isAnswered = gameState === 'answered';

  const formatQuestion = (category: string) => {
    switch (category.toLowerCase()) {
      case 'population':
        return 'Which city has a higher population?';
      case 'robbery':
        return 'Which state has more robberies per capita?';
      case 'motor vehicle theft':
        return 'Which state has more instances of motor vehicle theft per capita?';
      case 'burglary':
        return 'Which state has more burglaries per capita?';
      case 'murder':
        return 'Which state has more murders per capita?';
      case 'vandalism':
        return 'Which state has more vandalism incidents per capita?';
      case 'dui':
        return 'Which state has more DUI arrests per capita?';
      case 'arson':
        return 'Which state has more arson incidents per capita?';
      case 'liquor law violations':
        return 'Which state has more liquor law violations per capita?';
      case 'disorderly conduct':
        return 'Which state has more disorderly conduct arrests per capita?';
      case 'shoplifting':
        return 'Which state has more shoplifting incidents per capita?';
      case 'public intoxication':
        return 'Which state has more public intoxication arrests per capita?';
      case 'gambling':
        return 'Which state has more gambling violations per capita?';
      case 'median household income':
        return 'Which state has a higher median household income?';
      case 'unemployment rate':
        return 'Which state has a higher unemployment rate?';
      case 'minimum wage':
        return 'Which state has a higher minimum wage?';
      case 'cost of living index':
        return 'Which state has a higher cost of living?';
      case 'high school graduation rate':
        return 'Which state has a higher high school graduation rate?';
      case 'college attainment rate':
        return 'Which state has a higher college attainment rate?';
      case 'average sat score':
        return 'Which state has higher average SAT scores?';
      case 'education spending per pupil':
        return 'Which state spends more on education per student?';
      case 'life expectancy':
        return 'Which state has higher life expectancy?';
      case 'obesity rate':
        return 'Which state has a higher obesity rate?';
      case 'infant mortality rate':
        return 'Which state has a higher infant mortality rate?';
      case 'healthcare spending per capita':
        return 'Which state spends more on healthcare per person?';
      case 'highway miles per capita':
        return 'Which state has more highway miles per person?';
      case 'structurally deficient bridges':
        return 'Which state has a higher percentage of structurally deficient bridges?';
      case 'ev charging stations':
        return 'Which state has more EV charging stations?';
      case 'public transit ridership per capita':
        return 'Which state has higher public transit ridership per person?';
      case 'voter turnout':
        return 'Which state has higher voter turnout?';
      case 'state income tax rate':
        return 'Which state has a higher state income tax rate?';
      case 'government employment rate':
        return 'Which state has a higher government employment rate?';
      case 'property tax rate':
        return 'Which state has higher property tax rates?';
      case 'corn production':
        return 'Which state produces more corn?';
      case 'farmland percentage':
        return 'Which state has a higher percentage of farmland?';
      case 'renewable energy percentage':
        return 'Which state has a higher percentage of renewable energy?';
      case 'forest coverage percentage':
        return 'Which state has more forest coverage?';
      case 'museums per capita':
        return 'Which state has more museums per capita?';
      case 'restaurants per capita':
        return 'Which state has more restaurants per capita?';
      case 'breweries per capita':
        return 'Which state has more breweries per capita?';
      case 'entertainment venues per capita':
        return 'Which state has more entertainment venues per capita?';
      case 'house price index':
        return 'Which state has a higher house price index?';
      default:
        return question.question;
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit.includes('%') || unit.includes('percent')) {
      return `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${unit}`;
    }
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M ${unit}`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K ${unit}`;
    return `${value.toLocaleString()} ${unit}`;
  };

  const getButtonClass = (option: 'A' | 'B') => {
    let classes = 'answer-option group transition-all duration-300 ease-in-out';
    
    if (isAnswered) {
      if (selectedAnswer === option) {
        classes += wasAnswerCorrect ? ' answer-correct' : ' answer-incorrect';
      } else if (question.correctAnswer === option) {
        classes += ' answer-correct';
      } else {
        classes += ' answer-disabled';
      }
    }
    
    return classes;
  };

  const handleClick = (option: 'A' | 'B') => {
    if (isAnswered) return;
    onAnswer(option);
  };

  const renderBadge = (option: 'A' | 'B') => {
    if (!isAnswered) return null;
    
    const isCorrect = question.correctAnswer === option;
    const isSelected = selectedAnswer === option;
    
    if (!isCorrect && !isSelected) return null;
    
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="absolute top-3 right-3"
      >
        {isCorrect ? (
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
            <XCircle className="h-5 w-5 text-white" />
          </div>
        )}
      </motion.div>
    );
  };

  const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('crime') || lowerCategory.includes('robbery') || lowerCategory.includes('theft')) return '🚨';
    if (lowerCategory.includes('burglary')) return '🏠💥';
    if (lowerCategory.includes('murder') || lowerCategory.includes('homicide')) return '⚠️';
    if (lowerCategory.includes('vandalism')) return '🎨💥';
    if (lowerCategory.includes('dui') || lowerCategory.includes('intoxication')) return '🍺🚗';
    if (lowerCategory.includes('arson')) return '🔥';
    if (lowerCategory.includes('liquor') || lowerCategory.includes('alcohol')) return '🍻⚖️';
    if (lowerCategory.includes('disorderly')) return '👥⚠️';
    if (lowerCategory.includes('shoplifting')) return '🛒💰';
    if (lowerCategory.includes('gambling')) return '🎰';
    if (lowerCategory.includes('income') || lowerCategory.includes('wage')) return '💰';
    if (lowerCategory.includes('unemployment')) return '📉';
    if (lowerCategory.includes('cost of living')) return '🏠💸';
    if (lowerCategory.includes('graduation') || lowerCategory.includes('education') || lowerCategory.includes('school')) return '🎓';
    if (lowerCategory.includes('college') || lowerCategory.includes('attainment')) return '🏫';
    if (lowerCategory.includes('sat score') || lowerCategory.includes('test')) return '📝';
    if (lowerCategory.includes('life expectancy') || lowerCategory.includes('mortality')) return '⚰️';
    if (lowerCategory.includes('obesity') || lowerCategory.includes('health')) return '🏥';
    if (lowerCategory.includes('healthcare') || lowerCategory.includes('medical')) return '��';
    if (lowerCategory.includes('highway') || lowerCategory.includes('road')) return '🛣️';
    if (lowerCategory.includes('bridge') || lowerCategory.includes('deficient')) return '🌉';
    if (lowerCategory.includes('ev') || lowerCategory.includes('charging')) return '⚡';
    if (lowerCategory.includes('transit') || lowerCategory.includes('ridership')) return '🚌';
    if (lowerCategory.includes('voter') || lowerCategory.includes('turnout')) return '🗳️';
    if (lowerCategory.includes('tax') || lowerCategory.includes('income tax')) return '💸';
    if (lowerCategory.includes('government') || lowerCategory.includes('employment')) return '🏛️';
    if (lowerCategory.includes('corn') || lowerCategory.includes('crop')) return '🌽';
    if (lowerCategory.includes('farmland') || lowerCategory.includes('farm')) return '🚜';
    if (lowerCategory.includes('renewable') || lowerCategory.includes('energy')) return '🔋';
    if (lowerCategory.includes('forest') || lowerCategory.includes('coverage')) return '🌲';
    if (lowerCategory.includes('museum')) return '🏛️';
    if (lowerCategory.includes('restaurant') || lowerCategory.includes('food')) return '🍽️';
    if (lowerCategory.includes('breweries') || lowerCategory.includes('brewery')) return '🍺';
    if (lowerCategory.includes('entertainment') || lowerCategory.includes('venue')) return '🎭';
    if (lowerCategory.includes('population')) return '👥';
    return '📊';
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="space-y-6">
        
        {/* Question */}
        <div className="text-center space-y-3">
          <h2 className="text-heading-lg text-primary font-bold leading-tight max-w-4xl mx-auto">
            {formatQuestion(question.category)}
          </h2>
        </div>

        {/* Answer Options - Much narrower width for testing */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xs">
            
            {/* Option A */}
            <motion.button
              onClick={() => !isAnswered && onAnswer('A')}
              className={`answer-option group ${
                isAnswered 
                  ? selectedAnswer === 'A' 
                    ? wasAnswerCorrect ? 'answer-correct' : 'answer-incorrect'
                    : question.correctAnswer === 'A' ? 'answer-correct' : 'answer-disabled'
                  : ''
              }`}
              disabled={isAnswered}
              whileHover={!isAnswered ? { y: -2 } : {}}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center gap-3">
                <div className={`letter-badge ${
                  isAnswered && selectedAnswer === 'A' 
                    ? wasAnswerCorrect ? 'correct' : 'incorrect'
                    : isAnswered && question.correctAnswer === 'A' ? 'correct' : ''
                }`}>
                  A
                </div>
                <div className="flex-1 text-left">
                  <div className="text-heading text-primary font-semibold">
                    {cleanLocationName(question.optionA.name)}
                  </div>
                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ delay: 0.3 }}
                      className="mt-2 text-body text-secondary"
                    >
                      <span className="text-mono font-medium text-accent">
                        {question.optionA.value.toLocaleString()}
                      </span>
                      <span className="text-muted ml-1">{question.optionA.unit}</span>
                    </motion.div>
                  )}
                </div>
                {isAnswered && selectedAnswer === 'A' && (
                  <div className="flex-shrink-0">
                    {wasAnswerCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <XCircle className="h-5 w-5 text-error" />
                    )}
                  </div>
                )}
                {isAnswered && question.correctAnswer === 'A' && selectedAnswer !== 'A' && (
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                )}
              </div>
            </motion.button>

            {/* Option B */}
            <motion.button
              onClick={() => !isAnswered && onAnswer('B')}
              className={`answer-option group ${
                isAnswered 
                  ? selectedAnswer === 'B' 
                    ? wasAnswerCorrect ? 'answer-correct' : 'answer-incorrect'
                    : question.correctAnswer === 'B' ? 'answer-correct' : 'answer-disabled'
                  : ''
              }`}
              disabled={isAnswered}
              whileHover={!isAnswered ? { y: -2 } : {}}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center gap-3">
                <div className={`letter-badge ${
                  isAnswered && selectedAnswer === 'B' 
                    ? wasAnswerCorrect ? 'correct' : 'incorrect'
                    : isAnswered && question.correctAnswer === 'B' ? 'correct' : ''
                }`}>
                  B
                </div>
                <div className="flex-1 text-left">
                  <div className="text-heading text-primary font-semibold">
                    {cleanLocationName(question.optionB.name)}
                  </div>
                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ delay: 0.3 }}
                      className="mt-2 text-body text-secondary"
                    >
                      <span className="text-mono font-medium text-accent">
                        {question.optionB.value.toLocaleString()}
                      </span>
                      <span className="text-muted ml-1">{question.optionB.unit}</span>
                    </motion.div>
                  )}
                </div>
                {isAnswered && selectedAnswer === 'B' && (
                  <div className="flex-shrink-0">
                    {wasAnswerCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <XCircle className="h-5 w-5 text-error" />
                    )}
                  </div>
                )}
                {isAnswered && question.correctAnswer === 'B' && selectedAnswer !== 'B' && (
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                )}
              </div>
            </motion.button>

          </div>
        </div>

        {/* Explanation Card - With added spacing */}
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto mt-8"
          >
            <div className="card p-5">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-accent" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-body-lg text-primary font-semibold">
                      {wasAnswerCorrect ? 'Correct!' : 'Not quite!'}
                    </h3>
                  </div>
                  <p className="text-body text-secondary leading-relaxed">
                    {question.category === 'House Price Index' 
                      ? `${question.explanation} The house price index measures how much home prices have changed over time relative to a base year.`
                      : question.explanation
                    }
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
