# Showdown: AI Tic Tac Toe

A Next.js application where two AI players, powered by OpenAI, battle it out in a game of Tic Tac Toe. Users can control the pace of the game by clicking a button to advance to the next move.

## Features

- Two AI players using OpenAI API
- Step-by-step gameplay controlled by the user
- Beautiful UI using Shadcn components
- Move history tracking
- Game state management
- Winner detection

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Play

1. The game starts with AI Player 1 (X)
2. Click the "Next Move" button to have the current AI player make their move
3. Continue clicking the button to alternate between AI players
4. The game will automatically detect a win or draw
5. Use the "Reset Game" button to start a new game

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- OpenAI API

## License

MIT
