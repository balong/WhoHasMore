import { Question } from '../_stores/gameStore';

export const gameData = {
  questions: [
    {
      id: '1',
      category: 'Agriculture',
      question: 'Which state has more cows?',
      optionA: {
        name: 'Texas',
        value: 13000000,
        unit: 'cows'
      },
      optionB: {
        name: 'California',
        value: 5200000,
        unit: 'cows'
      },
      correctAnswer: 'A',
      explanation: 'Texas leads the nation with over 13 million cattle, while California has about 5.2 million.'
    },
    {
      id: '2',
      category: 'Public Safety',
      question: 'Which state has more gun deaths per capita?',
      optionA: {
        name: 'Mississippi',
        value: 28.6,
        unit: 'deaths per 100k'
      },
      optionB: {
        name: 'Louisiana',
        value: 26.3,
        unit: 'deaths per 100k'
      },
      correctAnswer: 'A',
      explanation: 'Mississippi has the highest gun death rate at 28.6 per 100,000 people, compared to Louisiana\'s 26.3.'
    },
    {
      id: '3',
      category: 'Wildlife',
      question: 'Which state has more pet tigers?',
      optionA: {
        name: 'Texas',
        value: 47,
        unit: 'tigers'
      },
      optionB: {
        name: 'Florida',
        value: 139,
        unit: 'tigers'
      },
      correctAnswer: 'B',
      explanation: 'Florida has the most pet tigers in the US with 139, while Texas has 47.'
    },
    {
      id: '4',
      category: 'Health',
      question: 'Which state has a higher infant mortality rate?',
      optionA: {
        name: 'Mississippi',
        value: 8.12,
        unit: 'deaths per 1k births'
      },
      optionB: {
        name: 'Alabama',
        value: 7.59,
        unit: 'deaths per 1k births'
      },
      correctAnswer: 'A',
      explanation: 'Mississippi has the highest infant mortality rate at 8.12 deaths per 1,000 births.'
    },
    {
      id: '5',
      category: 'Population',
      question: 'Which city has more people?',
      optionA: {
        name: 'New York City',
        value: 8336000,
        unit: 'people'
      },
      optionB: {
        name: 'Los Angeles',
        value: 3976000,
        unit: 'people'
      },
      correctAnswer: 'A',
      explanation: 'New York City is the most populous city in the US with 8.3 million people.'
    },
    {
      id: '6',
      category: 'Education',
      question: 'Which state has more college graduates?',
      optionA: {
        name: 'Massachusetts',
        value: 45.3,
        unit: '% of population'
      },
      optionB: {
        name: 'Colorado',
        value: 42.7,
        unit: '% of population'
      },
      correctAnswer: 'A',
      explanation: 'Massachusetts has the highest percentage of college graduates at 45.3%.'
    },
    {
      id: '7',
      category: 'Weather',
      question: 'Which state gets more annual rainfall?',
      optionA: {
        name: 'Hawaii',
        value: 63.7,
        unit: 'inches'
      },
      optionB: {
        name: 'Louisiana',
        value: 60.1,
        unit: 'inches'
      },
      correctAnswer: 'A',
      explanation: 'Hawaii receives the most rainfall annually at 63.7 inches.'
    },
    {
      id: '8',
      category: 'Economy',
      question: 'Which state has a higher minimum wage?',
      optionA: {
        name: 'Washington',
        value: 15.74,
        unit: 'dollars'
      },
      optionB: {
        name: 'California',
        value: 15.50,
        unit: 'dollars'
      },
      correctAnswer: 'A',
      explanation: 'Washington has the highest minimum wage at $15.74 per hour.'
    },
    {
      id: '9',
      category: 'Transportation',
      question: 'Which city has more miles of subway track?',
      optionA: {
        name: 'New York City',
        value: 665,
        unit: 'miles'
      },
      optionB: {
        name: 'Washington DC',
        value: 117,
        unit: 'miles'
      },
      correctAnswer: 'A',
      explanation: 'New York City has the largest subway system with 665 miles of track.'
    },
    {
      id: '10',
      category: 'Tourism',
      question: 'Which state has more national parks?',
      optionA: {
        name: 'California',
        value: 9,
        unit: 'parks'
      },
      optionB: {
        name: 'Alaska',
        value: 8,
        unit: 'parks'
      },
      correctAnswer: 'A',
      explanation: 'California has the most national parks with 9, while Alaska has 8.'
    }
  ] as Question[]
}; 