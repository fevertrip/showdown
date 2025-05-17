export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type Board = CellValue[];

export type GameState = {
  board: Board;
  currentPlayer: Player;
  winner: Player | 'draw' | null;
  gameOver: boolean;
  isProcessing: boolean;
  history: {
    player: Player;
    position: number;
  }[];
};

export const INITIAL_GAME_STATE: GameState = {
  board: Array(9).fill(null),
  currentPlayer: 'X',
  winner: null,
  gameOver: false,
  isProcessing: false,
  history: [],
}; 