'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Check, Trophy, Target, TrendingUp } from 'lucide-react';
import { Question } from '../_stores/gameStore';
import { useGameStore } from '../_stores/gameStore';
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
    if (unit === 'per 100k people') {
      return `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${unit}`;
    }
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M ${unit}`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K ${unit}`;
    return `${value.toLocaleString()} ${unit}`;
  };

  const getButtonClass = (key: 'A' | 'B') => {
    const isSelected = selectedAnswer === key;
    const isCorrect = question.correctAnswer === key;

    let classes = 'answer-button card-elevated relative rounded-3xl px-8 py-10 text-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400/40 disabled:cursor-default group w-full max-w-sm mx-auto block';

    if (isAnswered) {
      if (isCorrect) {
        classes += ' correct';
      } else if (isSelected && !isCorrect) {
        classes += ' incorrect';
      } else {
        classes += ' opacity-50';
      }
    } else {
      classes += ' hover:scale-[1.02] cursor-pointer interactive-glow';
    }

    return classes;
  };

  const handleClick = (k: 'A' | 'B') => {
    if (isAnswered) return;
    onAnswer(k);
  };

  const renderBadge = (key: 'A' | 'B') => {
    if (!isAnswered) return null;
    const isCorrect = question.correctAnswer === key;
    const isSelected = selectedAnswer === key;
    
    if (!isCorrect && !isSelected) return null;

    return (
      <div className={`absolute right-8 top-8 flex items-center gap-3 rounded-full px-5 py-3 text-base font-bold backdrop-blur-sm border ${
        isCorrect 
          ? 'bg-emerald-500/30 border-emerald-400/50 text-emerald-200 status-correct' 
          : 'bg-red-500/30 border-red-400/50 text-red-200 status-incorrect'
      }`}>
        {isCorrect ? (
          <Trophy className="h-5 w-5" />
        ) : (
          <Target className="h-5 w-5" />
        )}
        <span>{isCorrect ? 'Correct' : 'Your Pick'}</span>
      </div>
    );
  };

  const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('crime') || lowerCategory.includes('robbery') || lowerCategory.includes('theft')) {
      return '🚨';
    }
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
    if (lowerCategory.includes('healthcare') || lowerCategory.includes('medical')) return '💊';
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
    <div className="w-full max-w-2xl mx-auto px-12 py-8">
      <div className="space-y-20">
        {/* Category Header */}
        <div className="flex items-center justify-between px-8">
          <div className="glass-button rounded-full px-10 py-6 flex items-center gap-5">
            <span className="text-3xl">{getCategoryIcon(question.category)}</span>
            <div>
              <div className="text-xl font-bold text-primary">
                {question.category}
              </div>
              {question.optionA.unit && (
                <div className="text-base text-muted flex items-center gap-3 mt-2">
                  <TrendingUp className="h-5 w-5" />
                  Measured in {question.optionA.unit}
                </div>
              )}
            </div>
          </div>
          
          {isAnswered && (
            <div className="flex items-center gap-4">
              {wasAnswerCorrect ? (
                <div className="flex items-center gap-4 text-emerald-300 status-correct">
                  <CheckCircle2 className="h-8 w-8" />
                  <span className="font-bold text-2xl">Correct!</span>
                </div>
              ) : (
                <div className="flex items-center gap-4 text-red-300 status-incorrect">
                  <XCircle className="h-8 w-8" />
                  <span className="font-bold text-2xl">Incorrect</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Question */}
        <div className="text-center space-y-10 px-8">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black heading-xl gradient-text-bright leading-tight">
            {formatQuestion(question.category)}
          </h2>
          <div className="w-40 h-2 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto rounded-full"></div>
        </div>

        {/* Answer Options - 1/3 screen width max with more space */}
        <div className="flex flex-col items-center px-8">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl" style={{ maxWidth: 'min(33vw, 28rem)' }}>
            <div className="space-y-5">
              <motion.button 
                onClick={() => handleClick('A')} 
                className={getButtonClass('A')} 
                disabled={isAnswered}
                whileHover={!isAnswered ? { scale: 1.02 } : {}}
                whileTap={!isAnswered ? { scale: 0.98 } : {}}
              >
                {renderBadge('A')}
                <div className="mb-8 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                    A
                  </div>
                  <span className="text-lg font-semibold text-muted uppercase tracking-wider">Option A</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-6 leading-tight px-4">
                  {cleanLocationName(question.optionA.name)}
                </div>
                {isAnswered && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.2 }}
                    className="border-t border-white/20 pt-8 px-4"
                  >
                    <div className="text-xl sm:text-2xl text-secondary font-bold text-mono">
                      {formatValue(question.optionA.value, question.optionA.unit)}
                    </div>
                  </motion.div>
                )}
              </motion.button>

              <motion.button 
                onClick={() => handleClick('B')} 
                className={getButtonClass('B')} 
                disabled={isAnswered}
                whileHover={!isAnswered ? { scale: 1.02 } : {}}
                whileTap={!isAnswered ? { scale: 0.98 } : {}}
              >
                {renderBadge('B')}
                <div className="mb-8 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                    B
                  </div>
                  <span className="text-lg font-semibold text-muted uppercase tracking-wider">Option B</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-6 leading-tight px-4">
                  {cleanLocationName(question.optionB.name)}
                </div>
                {isAnswered && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.2 }}
                    className="border-t border-white/20 pt-8 px-4"
                  >
                    <div className="text-xl sm:text-2xl text-secondary font-bold text-mono">
                      {formatValue(question.optionB.value, question.optionB.unit)}
                    </div>
                  </motion.div>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Explanation */}
        {isAnswered && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center px-8"
          >
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl" style={{ maxWidth: 'min(33vw, 28rem)' }}>
              <div className="card-elevated rounded-3xl p-8 border border-purple-400/30">
                <div className="mb-6 flex items-center gap-4">
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
                  <div className="font-bold text-primary uppercase tracking-wider text-base flex items-center gap-3">
                    <span>📝</span>
                    {question.category.toLowerCase() === 'house price index' ? 'House Price Index' : 'Explanation'}
                  </div>
                </div>
                <div className="px-2">
                  {question.category.toLowerCase() === 'house price index' && (
                    <p className="text-secondary leading-relaxed text-base mb-4 italic">
                      How much home prices have changed over time
                    </p>
                  )}
                  <p className="text-secondary leading-relaxed text-base">{question.explanation}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 