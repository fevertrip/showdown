import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client with environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { board, player, model = "gpt-3.5-turbo" } = await request.json();

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: `You are playing tic-tac-toe as player "${player}" (${player === 'X' ? 'X' : 'O'}). 
          The board is represented as an array of 9 elements (0-8), where null means empty, "X" means X has played there, and "O" means O has played there.
          The indices are arranged as follows:
          0 | 1 | 2
          ---------
          3 | 4 | 5
          ---------
          6 | 7 | 8
          
          Analyze the current board and return ONLY the index (0-8) of your next move. Choose the best strategic move.`
        },
        {
          role: "user",
          content: `Current board state: ${JSON.stringify(board)}. What's your next move?`
        }
      ],
      temperature: 0.3,
      max_tokens: 10,
    });

    // Extract the AI's move
    const moveText = response.choices[0]?.message?.content?.trim() || '';
    const move = parseInt(moveText);

    if (isNaN(move) || move < 0 || move > 8 || board[move] !== null) {
      // If AI returns invalid move, find a random empty spot
      const emptySpots = board.map((spot: string | null, index: number) => 
        spot === null ? index : -1
      ).filter((idx: number) => idx !== -1);
      
      if (emptySpots.length === 0) {
        return NextResponse.json({ error: 'No valid moves available' }, { status: 400 });
      }
      
      const randomIndex = Math.floor(Math.random() * emptySpots.length);
      return NextResponse.json({ move: emptySpots[randomIndex] });
    }

    return NextResponse.json({ move });
  } catch (error) {
    console.error('Error processing AI move:', error);
    return NextResponse.json({ error: 'Failed to process AI move' }, { status: 500 });
  }
} 