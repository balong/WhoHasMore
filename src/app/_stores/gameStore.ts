import { create } from 'zustand';

export type GameState = 'idle' | 'playing' | 'answered' | 'gameOver';

export interface Question {
  id: string;
  category: string;
  question: string;
  optionA: {
    name: string;
    value: number;
    unit: string;
  };
  optionB: {
    name: string;
    value: number;
    unit: string;
  };
  correctAnswer: 'A' | 'B';
  explanation: string;
}

interface GameStore {
  gameState: GameState;
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  score: number;
  totalQuestions: number;
  answeredQuestions: Set<string>;
  selectedAnswer: 'A' | 'B' | null;
  wasAnswerCorrect: boolean | null;
  currentStreak: number;
  bestAccuracy: number;
  showConfetti: boolean;
  showStarburst: boolean;
  startGame: () => void;
  submitAnswer: (answer: 'A' | 'B') => void;
  nextQuestion: () => void;
  resetGame: () => void;
}

let questionPool: Question[] | null = null;

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createBalancedQuestionPool(questions: Question[]): Question[] {
  // Group questions by category
  const categoryGroups: Record<string, Question[]> = {};
  questions.forEach(q => {
    if (!categoryGroups[q.category]) {
      categoryGroups[q.category] = [];
    }
    categoryGroups[q.category].push(q);
  });

  // Filter population questions to avoid wildly different sizes
  if (categoryGroups['Population']) {
    categoryGroups['Population'] = categoryGroups['Population'].filter(q => {
      const valueA = q.optionA.value;
      const valueB = q.optionB.value;
      const ratio = Math.max(valueA, valueB) / Math.min(valueA, valueB);
      // Only include questions where the larger value is at most 3x the smaller value
      return ratio <= 3.0;
    });
  }

  // Prioritize crime-related questions 
  const crimeCategories = [
    'Robbery', 'Motor Vehicle Theft', 'Burglary', 'Murder', 'Vandalism', 'DUI',
    'Arson', 'Liquor Law Violations', 'Disorderly Conduct', 'Shoplifting', 
    'Public Intoxication', 'Gambling'
  ];
  const economicsCategories = [
    'Median Household Income', 'Unemployment Rate', 'Minimum Wage', 'Cost of Living Index'
  ];
  const educationCategories = [
    'High School Graduation Rate', 'College Attainment Rate', 'Average SAT Score', 'Education Spending Per Pupil'
  ];
  const healthCategories = [
    'Life Expectancy', 'Obesity Rate', 'Infant Mortality Rate', 'Healthcare Spending Per Capita'
  ];
  const transportationCategories = [
    'Highway Miles Per Capita', 'Structurally Deficient Bridges', 'EV Charging Stations', 'Public Transit Ridership Per Capita'
  ];
  const governmentCategories = [
    'Voter Turnout', 'State Income Tax Rate', 'Government Employment Rate', 'Property Tax Rate'
  ];
  const agricultureCategories = [
    'Corn Production', 'Farmland Percentage', 'Renewable Energy Percentage', 'Forest Coverage Percentage'
  ];
  const cultureCategories = [
    'Museums Per Capita', 'Restaurants Per Capita', 'Breweries Per Capita', 'Entertainment Venues Per Capita'
  ];
  const isCrimeCategory = (category: string) => crimeCategories.includes(category);
  const isEconomicsCategory = (category: string) => economicsCategories.includes(category);
  const isEducationCategory = (category: string) => educationCategories.includes(category);
  const isHealthCategory = (category: string) => healthCategories.includes(category);
  const isTransportationCategory = (category: string) => transportationCategories.includes(category);
  const isGovernmentCategory = (category: string) => governmentCategories.includes(category);
  const isAgricultureCategory = (category: string) => agricultureCategories.includes(category);
  const isCultureCategory = (category: string) => cultureCategories.includes(category);

  // Shuffle each category and take a balanced sample
  const balancedQuestions: Question[] = [];
  const categories = Object.keys(categoryGroups);
  
  // Give crime categories more questions (up to 25 each), others get fewer
  categories.forEach(category => {
    const categoryQuestions = shuffleInPlace([...categoryGroups[category]]);
    const maxQuestions = (isCrimeCategory(category) || isEconomicsCategory(category) || isEducationCategory(category) || isHealthCategory(category) || isTransportationCategory(category) || isGovernmentCategory(category) || isAgricultureCategory(category) || isCultureCategory(category)) ? 25 : 15; // More questions for all priority categories
    const sampled = categoryQuestions.slice(0, Math.min(maxQuestions, categoryQuestions.length));
    balancedQuestions.push(...sampled);
  });

  // Final shuffle of the balanced pool
  return shuffleInPlace(balancedQuestions);
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: 'idle',
  currentQuestion: null,
  currentQuestionIndex: 0,
  score: 0,
  totalQuestions: 0,
  answeredQuestions: new Set(),
  selectedAnswer: null,
  wasAnswerCorrect: null,
  currentStreak: 0,
  bestAccuracy: 0,
  showConfetti: false,
  showStarburst: false,

  startGame: () => {
    if (typeof window === 'undefined') return;

    async function loadPool(): Promise<Question[] | null> {
      try {
        const res = await fetch('/data/questions/pool.json', { cache: 'no-store' });
        if (!res.ok) return null;
        const q = await res.json();
        return q as Question[];
      } catch {
        return null;
      }
    }

    (async () => {
      if (!questionPool) {
        const loaded = await loadPool();
        const questions = loaded && loaded.length > 0 ? loaded : [];
        questionPool = createBalancedQuestionPool(questions);
      }
      
      set({
        gameState: 'playing',
        currentQuestion: questionPool[0],
        currentQuestionIndex: 0,
        score: 0,
        totalQuestions: questionPool.length,
        answeredQuestions: new Set(),
        selectedAnswer: null,
        wasAnswerCorrect: null,
        currentStreak: 0,
        bestAccuracy: 0,
        showConfetti: false,
        showStarburst: false,
      });
    })();
  },

  submitAnswer: (answer: 'A' | 'B') => {
    const { currentQuestion, answeredQuestions, currentStreak, bestAccuracy } = get();
    if (!currentQuestion) return;

    const isCorrect = answer === currentQuestion.correctAnswer;
    const newScore = isCorrect ? get().score + 1 : get().score;
    const newAnsweredQuestions = new Set(answeredQuestions);
    newAnsweredQuestions.add(currentQuestion.id);
    
    // Calculate new streak
    const newStreak = isCorrect ? currentStreak + 1 : 0;
    
    // Calculate accuracy and check for new best
    const newAccuracy = newAnsweredQuestions.size > 0 ? Math.round((newScore / newAnsweredQuestions.size) * 100) : 0;
    const isNewBest = newAccuracy > bestAccuracy && newAnsweredQuestions.size >= 3; // Only count best after 3+ questions
    
    // Trigger celebrations
    const shouldShowConfetti = newStreak >= 3 && isCorrect;
    const shouldShowStarburst = isNewBest;

    set({
      score: newScore,
      gameState: 'answered',
      answeredQuestions: newAnsweredQuestions,
      selectedAnswer: answer,
      wasAnswerCorrect: isCorrect,
      currentStreak: newStreak,
      bestAccuracy: Math.max(bestAccuracy, newAccuracy),
      showConfetti: shouldShowConfetti,
      showStarburst: shouldShowStarburst,
    });
    
    // Reset celebration flags after a short delay
    if (shouldShowConfetti || shouldShowStarburst) {
      setTimeout(() => {
        set(state => ({
          ...state,
          showConfetti: false,
          showStarburst: false,
        }));
      }, 100);
    }
  },

  nextQuestion: () => {
    const { currentQuestionIndex, totalQuestions } = get();
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= totalQuestions) {
      set({ gameState: 'gameOver' });
      return;
    }

    if (!questionPool) return;
    
    set({
      currentQuestion: questionPool[nextIndex],
      currentQuestionIndex: nextIndex,
      gameState: 'playing',
      selectedAnswer: null,
      wasAnswerCorrect: null,
    });
  },

  resetGame: () => {
    set({
      gameState: 'idle',
      currentQuestion: null,
      currentQuestionIndex: 0,
      score: 0,
      answeredQuestions: new Set(),
      selectedAnswer: null,
      wasAnswerCorrect: null,
      currentStreak: 0,
      bestAccuracy: 0,
      showConfetti: false,
      showStarburst: false,
    });
  },
})); 