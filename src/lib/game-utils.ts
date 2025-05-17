import { Board, Player } from "@/types/game";

// Winning combinations (indices)
const WINNING_COMBINATIONS = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

// Check if a player has won
export function checkWinner(board: Board): Player | null {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as Player;
    }
  }
  return null;
}

// Check if the game is a draw
export function checkDraw(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

// Get an AI move for a player
export async function getAIMove(
  board: Board, 
  player: Player, 
  model: string = "gpt-3.5-turbo"
): Promise<number> {
  try {
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ board, player, model }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`AI move data:`, data);
    return data.move;
  } catch (error) {
    console.error("Error getting AI move:", error);
    // Fallback: Find a random empty spot
    const emptySpots = board
      .map((cell, index) => (cell === null ? index : -1))
      .filter((idx) => idx !== -1);
    const randomIndex = Math.floor(Math.random() * emptySpots.length);
    return emptySpots[randomIndex];
  }
}

// Render the game board as ASCII for debugging
export function renderBoardAsText(board: Board): string {
  let result = '';
  for (let i = 0; i < 9; i += 3) {
    result += ` ${board[i] || ' '} | ${board[i+1] || ' '} | ${board[i+2] || ' '} \n`;
    if (i < 6) {
      result += '---+---+---\n';
    }
  }
  return result;
} 