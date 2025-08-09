'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Trophy, Target, TrendingUp, Info } from 'lucide-react';
import { useGameStore } from '../_stores/gameStore';
import { Question } from '../_stores/gameStore';
import { cleanLocationName } from '../_utils/stateNames';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: 'A' | 'B') => void;
}

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const gameState = useGameStore(state => state.gameState);
  const selectedAnswer = useGameStore(state => state.selectedAnswer);
  const wasAnswerCorrect = useGameStore(state => state.wasAnswerCorrect);
  
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
        return `Which place has a higher ${category.toLowerCase()}?`;
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
    switch (category) {
      case 'Population': return '👥';
      case 'Robbery':
      case 'Motor vehicle theft':
      case 'Burglary':
      case 'Larceny-theft':
      case 'Violent crime':
        return '🚨';
      case 'House Price Index': return '🏠';
      case 'Median Household Income':
      case 'Per Capita Income':
      case 'Civilian Labor Force':
      case 'Unemployment Rate':
        return '💰';
      case 'High School Graduate or Higher':
      case 'Bachelor\'s Degree or Higher':
        return '🎓';
      case 'Health Insurance Coverage':
      case 'Life Expectancy':
        return '🏥';
      case 'Mean Commute Time':
      case 'Means of Transportation to Work: Drove Alone':
        return '🚗';
      case 'Voter Turnout':
        return '🏛️';
      case 'Corn Production':
      case 'Soybean Production':
      case 'Wheat Production':
      case 'Cotton Production':
        return '🌾';
      default: return '❓';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="space-y-10">
        <div className="text-center space-y-4">
          <p className="text-heading font-bold text-primary">
            {formatQuestion(question.category)}
          </p>
          <p className="text-body text-secondary">
            {question.category}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option A */}
          <motion.button
            onClick={() => !isAnswered && onAnswer('A')}
            className={`answer-option group ${
              isAnswered
                ? selectedAnswer === 'A'
                  ? wasAnswerCorrect ? 'answer-correct' : 'answer-incorrect'
                  : question.correctAnswer === 'A' ? 'answer-correct' : ''
                : ''
            }`}
            disabled={isAnswered}
            whileHover={!isAnswered ? { y: -4, scale: 1.02 } : {}}
            whileTap={!isAnswered ? { scale: 0.98 } : {}}
          >
            <div className="flex items-center gap-4">
              <div className={`letter-badge ${isAnswered && (question.correctAnswer === 'A' || selectedAnswer === 'A') ? (wasAnswerCorrect && selectedAnswer === 'A' ? 'letter-badge-correct' : 'letter-badge-incorrect') : ''}`}>
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
                    transition={{ delay: 0.2 }}
                    className="mt-2 text-body text-secondary"
                  >
                    <span className="text-mono font-medium text-accent">
                      {question.optionA.value.toLocaleString()}
                    </span>
                    <span className="text-muted ml-1">{question.optionA.unit}</span>
                  </motion.div>
                )}
              </div>
              {isAnswered && (
                <div className="flex-shrink-0">
                  {selectedAnswer === 'A' && (wasAnswerCorrect ? <CheckCircle2 className="h-6 w-6 text-success" /> : <XCircle className="h-6 w-6 text-error" />)}
                  {question.correctAnswer === 'A' && selectedAnswer !== 'A' && <CheckCircle2 className="h-6 w-6 text-success" />}
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
                  : question.correctAnswer === 'B' ? 'answer-correct' : ''
                : ''
            }`}
            disabled={isAnswered}
            whileHover={!isAnswered ? { y: -4, scale: 1.02 } : {}}
            whileTap={!isAnswered ? { scale: 0.98 } : {}}
          >
            <div className="flex items-center gap-4">
            <div className={`letter-badge ${isAnswered && (question.correctAnswer === 'B' || selectedAnswer === 'B') ? (wasAnswerCorrect && selectedAnswer === 'B' ? 'letter-badge-correct' : 'letter-badge-incorrect') : ''}`}>
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
                    transition={{ delay: 0.2 }}
                    className="mt-2 text-body text-secondary"
                  >
                    <span className="text-mono font-medium text-accent">
                      {question.optionB.value.toLocaleString()}
                    </span>
                    <span className="text-muted ml-1">{question.optionB.unit}</span>
                  </motion.div>
                )}
              </div>
              {isAnswered && (
                <div className="flex-shrink-0">
                  {selectedAnswer === 'B' && (wasAnswerCorrect ? <CheckCircle2 className="h-6 w-6 text-success" /> : <XCircle className="h-6 w-6 text-error" />)}
                  {question.correctAnswer === 'B' && selectedAnswer !== 'B' && <CheckCircle2 className="h-6 w-6 text-success" />}
                </div>
              )}
            </div>
          </motion.button>
        </div>

        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-2xl mx-auto"
          >
            <div className="arcade-card text-left">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${wasAnswerCorrect ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    {wasAnswerCorrect ? <Trophy className="h-5 w-5 text-green-400" /> : <Info className="h-5 w-5 text-red-400" />}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-body-lg text-primary font-semibold">
                    {wasAnswerCorrect ? 'Correct!' : 'Not quite!'}
                  </h3>
                  <p className="text-body text-secondary leading-relaxed">
                    {question.explanation}
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
