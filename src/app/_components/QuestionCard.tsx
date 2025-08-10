'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '../_stores/gameStore';
import { cleanLocationName } from '../_utils/stateNames';
import { Check, X, Trophy, Info } from 'lucide-react';
import { useState } from 'react';

const formatQuestion = (category: string): string => {
  // Get emoji for category
  const getEmoji = (cat: string) => {
    const categoryKey = cat.toLowerCase();
    if (categoryKey.includes('population')) return '👥 ';
    if (categoryKey.includes('robbery')) return '🚔 ';
    if (categoryKey.includes('motor vehicle theft') || categoryKey.includes('theft')) return '🚗 ';
    if (categoryKey.includes('burglary')) return '🏠 ';
    if (categoryKey.includes('murder')) return '🚔 ';
    if (categoryKey.includes('vandalism')) return '🚔 ';
    if (categoryKey.includes('dui')) return '🚔 ';
    if (categoryKey.includes('arson')) return '🚔 ';
    if (categoryKey.includes('liquor')) return '🚔 ';
    if (categoryKey.includes('disorderly')) return '🚔 ';
    if (categoryKey.includes('shoplifting')) return '🚔 ';
    if (categoryKey.includes('house price') || categoryKey.includes('housing')) return '🏠 ';
    if (categoryKey.includes('income') || categoryKey.includes('wage') || categoryKey.includes('unemployment') || categoryKey.includes('cost of living')) return '💰 ';
    if (categoryKey.includes('education') || categoryKey.includes('school') || categoryKey.includes('graduation') || categoryKey.includes('college') || categoryKey.includes('sat')) return '📚 ';
    if (categoryKey.includes('health') || categoryKey.includes('life expectancy') || categoryKey.includes('obesity') || categoryKey.includes('mortality') || categoryKey.includes('healthcare')) return '🏥 ';
    if (categoryKey.includes('highway') || categoryKey.includes('bridges') || categoryKey.includes('ev charging') || categoryKey.includes('transit')) return '🚗 ';
    if (categoryKey.includes('voter') || categoryKey.includes('tax') || categoryKey.includes('government')) return '🏛️ ';
    if (categoryKey.includes('corn') || categoryKey.includes('farmland') || categoryKey.includes('renewable') || categoryKey.includes('forest') || categoryKey.includes('air quality')) return '🌾 ';
    if (categoryKey.includes('museums') || categoryKey.includes('restaurants') || categoryKey.includes('breweries') || categoryKey.includes('entertainment') || categoryKey.includes('national park')) return '🎨 ';
    return '📊 ';
  };

  const emoji = getEmoji(category);
  
  // Population questions
  if (category.includes('Population')) {
    return `${emoji}Which location has a higher population?`;
  }
  
  // Crime questions  
  if (category.includes('Robbery')) {
    return `${emoji}Which state has more robberies per capita?`;
  }
  if (category.includes('Motor Vehicle Theft')) {
    return `${emoji}Which state has more motor vehicle thefts per capita?`;
  }
  if (category.includes('Burglary')) {
    return `${emoji}Which state has more burglaries per capita?`;
  }
  if (category.includes('Murder')) {
    return `${emoji}Which state has more murders per capita?`;
  }
  if (category.includes('Vandalism')) {
    return `${emoji}Which state has more vandalism incidents per capita?`;
  }
  if (category.includes('DUI')) {
    return `${emoji}Which state has more DUI arrests per capita?`;
  }
  if (category.includes('Arson')) {
    return `${emoji}Which state has more arson incidents per capita?`;
  }
  if (category.includes('Liquor Law Violations')) {
    return `${emoji}Which state has more liquor law violations per capita?`;
  }
  if (category.includes('Disorderly Conduct')) {
    return `${emoji}Which state has more disorderly conduct arrests per capita?`;
  }
  if (category.includes('Shoplifting')) {
    return `${emoji}Which state has more shoplifting incidents per capita?`;
  }
  
  // Housing and Economics
  if (category.includes('House Price Index')) {
    return `${emoji}Which state has a higher house price index?`;
  }
  if (category.includes('Median Household Income')) {
    return `${emoji}Which state has a higher median household income?`;
  }
  if (category.includes('Unemployment Rate')) {
    return `${emoji}Which state has a higher unemployment rate?`;
  }
  if (category.includes('Minimum Wage')) {
    return `${emoji}Which state has a higher minimum wage?`;
  }
  if (category.includes('Cost of Living')) {
    return `${emoji}Which state has a higher cost of living index?`;
  }
  
  // Education
  if (category.includes('High School Graduation')) {
    return `${emoji}Which state has a higher high school graduation rate?`;
  }
  if (category.includes('College Attainment')) {
    return `${emoji}Which state has a higher college attainment rate?`;
  }
  if (category.includes('Average SAT Score')) {
    return `${emoji}Which state has higher average SAT scores?`;
  }
  if (category.includes('Education Spending')) {
    return `${emoji}Which state spends more on education per pupil?`;
  }
  
  // Health
  if (category.includes('Life Expectancy')) {
    return `${emoji}Which state has higher life expectancy?`;
  }
  if (category.includes('Obesity Rate')) {
    return `${emoji}Which state has a higher obesity rate?`;
  }
  if (category.includes('Infant Mortality')) {
    return `${emoji}Which state has a higher infant mortality rate?`;
  }
  if (category.includes('Healthcare Spending')) {
    return `${emoji}Which state spends more on healthcare per capita?`;
  }
  
  // Transportation and Infrastructure  
  if (category.includes('Highway Miles')) {
    return `${emoji}Which state has more highway miles per capita?`;
  }
  if (category.includes('Structurally Deficient Bridges')) {
    return `${emoji}Which state has a higher percentage of structurally deficient bridges?`;
  }
  if (category.includes('EV Charging Stations')) {
    return `${emoji}Which state has more EV charging stations per capita?`;
  }
  if (category.includes('Public Transit Ridership')) {
    return `${emoji}Which state has higher public transit ridership per capita?`;
  }
  
  // Government and Politics
  if (category.includes('Voter Turnout')) {
    return `${emoji}Which state has higher voter turnout?`;
  }
  if (category.includes('State Income Tax')) {
    return `${emoji}Which state has a higher state income tax rate?`;
  }
  if (category.includes('Government Employment')) {
    return `${emoji}Which state has a higher government employment rate?`;
  }
  if (category.includes('Property Tax')) {
    return `${emoji}Which state has higher property tax rates?`;
  }
  
  // Agriculture and Environment
  if (category.includes('Corn Production')) {
    return `${emoji}Which state produces more corn?`;
  }
  if (category.includes('Farmland Percentage')) {
    return `${emoji}Which state has a higher percentage of farmland?`;
  }
  if (category.includes('Renewable Energy')) {
    return `${emoji}Which state has a higher percentage of renewable energy?`;
  }
  if (category.includes('Forest Coverage')) {
    return `${emoji}Which state has more forest coverage?`;
  }
  if (category.includes('Good air quality days')) {
    return `${emoji}Which state has more good air quality days?`;
  }
  if (category.includes('Unhealthy air quality days')) {
    return `${emoji}Which state has more unhealthy air quality days?`;
  }
  
  // Culture and Lifestyle
  if (category.includes('Museums Per Capita')) {
    return `${emoji}Which state has more museums per capita?`;
  }
  if (category.includes('Restaurants Per Capita')) {
    return `${emoji}Which state has more restaurants per capita?`;
  }
  if (category.includes('Breweries Per Capita')) {
    return `${emoji}Which state has more breweries per capita?`;
  }
  if (category.includes('Entertainment Venues')) {
    return `${emoji}Which state has more entertainment venues per capita?`;
  }
  if (category.includes('National Park visitors')) {
    return `${emoji}Which state has more National Park visitors?`;
  }
  
  // Fallback for any unmatched categories
  return `${emoji}Which location has a higher ${category.toLowerCase()}?`;
};

export default function QuestionCard() {
  const { 
    currentQuestion: question, 
    gameState, 
    selectedAnswer, 
    wasAnswerCorrect,
    submitAnswer 
  } = useGameStore();

  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  if (!question) return null;

  const isAnswered = gameState === 'answered';

  const handleAnswerSelect = (option: 'A' | 'B') => {
    if (isAnswered) return;
    submitAnswer(option);
  };

  const getAnswerCardClass = (option: 'A' | 'B') => {
    let classes = 'answer-card';
    
    if (selectedAnswer === option) {
      classes += ' answer-card-selected';
    }
    
    if (isAnswered) {
      const isCorrect = question.correctAnswer === option;
      if (isCorrect) {
        classes += ' answer-card-correct';
      } else {
        // Show incorrect answer as red regardless of whether it was selected
        classes += ' answer-card-incorrect';
      }
    }
    
    return classes;
  };

  const getLetterBadgeClass = (option: 'A' | 'B') => {
    let classes = 'letter-badge';
    
    if (isAnswered) {
      const isCorrect = question.correctAnswer === option;
      if (isCorrect) {
        classes += ' letter-badge-correct';
      } else {
        // Show incorrect answer badge as red regardless of whether it was selected
        classes += ' letter-badge-incorrect';
      }
    }
    
    return classes;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-3 md:py-6 relative z-10">
      {/* Question Header */}
      <div className="text-center mb-4 md:mb-8">
        <h2 className="text-question">
          {formatQuestion(question.category)}
        </h2>
      </div>

      {/* Answer Options */}
      <div className="w-full mx-auto mb-4 md:mb-8" style={{maxWidth: '760px'}}>
        <div className="flex flex-col">
          {(['A', 'B'] as const).map((letter, index) => {
            const option = letter === 'A' ? question.optionA : question.optionB;
            const cleanedOption = cleanLocationName(option.name);
            
            return (
              <motion.div
                key={letter}
                className={`${getAnswerCardClass(letter)} ${letter === 'A' ? 'answer-spacing' : ''}`}
                onClick={() => handleAnswerSelect(letter)}
                onHoverStart={() => setHoveredOption(letter)}
                onHoverEnd={() => setHoveredOption(null)}
                whileHover={!isAnswered ? { scale: 1.01 } : {}}
                whileTap={!isAnswered ? { scale: 0.99 } : {}}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex items-center" style={{gap: '10px'}}>
                  <div className={getLetterBadgeClass(letter)}>
                    {isAnswered && question.correctAnswer === letter ? (
                      <Check className="w-4 h-4" />
                    ) : isAnswered && selectedAnswer === letter && question.correctAnswer !== letter ? (
                      <X className="w-4 h-4" />
                    ) : (
                      letter
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-body-lg font-semibold text-nintendo-primary-text">
                      {cleanedOption}
                    </div>
                    {isAnswered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ delay: 0.3 }}
                        className="mt-2"
                      >
                        <div className="text-small text-nintendo-secondary-text">
                          Value: {option.value?.toLocaleString()} {option.unit}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Explanation Card */}
      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 30 }}
          className="w-full mx-auto explanation-spacing"
          style={{maxWidth: '760px'}}
        >
          <div className="nintendo-card text-left">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-nintendo-blue to-nintendo-purple flex items-center justify-center">
                {wasAnswerCorrect ? (
                  <Trophy className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-white" />
                ) : (
                  <Info className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-white" />
                )}
              </div>
              <div className="flex-1 space-y-1.5 md:space-y-2 lg:space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-heading font-bold text-nintendo-primary-text">
                    {wasAnswerCorrect ? 'Correct!' : 'Not quite!'}
                  </h3>
                  {wasAnswerCorrect && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7, type: "spring", stiffness: 500, damping: 20 }}
                      className="text-nintendo-green"
                    >
                      ✨
                    </motion.div>
                  )}
                </div>
                <p className="text-body text-nintendo-secondary-text leading-relaxed">
                  {question.explanation}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
