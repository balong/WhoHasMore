# Who Has More? 🎮

A fun and educational game show-style app that tests your knowledge about US states and cities! Players must guess which state or city has more of various interesting metrics.

## Features

- **Game Show Styling**: Professional graphics and animations inspired by popular game shows
- **Educational Content**: Questions cover diverse topics like agriculture, public safety, wildlife, health, and more
- **Smooth Animations**: Built with Framer Motion for engaging user experience
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Score Tracking**: Real-time score display with animated trophy
- **Game Over Modal**: Beautiful end-game screen with performance feedback

## Game Categories

The game includes questions about:
- 🐄 Agriculture (cattle populations)
- 🔫 Public Safety (gun deaths per capita)
- 🐯 Wildlife (pet tigers)
- 👶 Health (infant mortality rates)
- 🏙️ Population (city populations)
- 🎓 Education (college graduation rates)
- 🌧️ Weather (annual rainfall)
- 💰 Economy (minimum wages)
- 🚇 Transportation (subway systems)
- 🏞️ Tourism (national parks)

## Technology Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Zustand** - State management
- **Lucide React** - Beautiful icons

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Play

1. Read the question carefully
2. Compare the two options (A or B)
3. Click on your answer
4. See your score and continue to the next question
5. Try to get the highest score possible!

## Data Sources

The game uses real data from various sources including:
- USDA Agricultural Statistics
- CDC Health Statistics
- US Census Bureau
- State and local government databases

All data is formatted for educational purposes and may be simplified for gameplay.

## Contributing

Feel free to add more questions or improve the game! The data structure is easily extensible in `src/app/_data/gameData.ts`.

## License

MIT License - feel free to use this project for educational purposes!
