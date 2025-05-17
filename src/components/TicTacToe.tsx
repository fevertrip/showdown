"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GameState, INITIAL_GAME_STATE, Player } from "@/types/game";
import { checkWinner, checkDraw, getAIMove } from "@/lib/game-utils";

export default function TicTacToe() {
  const [gameState, setGameState] = useState<GameState>({ ...INITIAL_GAME_STATE });
  const [aiPlayerNames, setAiPlayerNames] = useState({
    X: "AI Player 1",
    O: "AI Player 2",
  });

  // Handle next move function
  const handleNextMove = async () => {
    if (gameState.gameOver || gameState.isProcessing) return;

    setGameState((prev) => ({ ...prev, isProcessing: true }));

    try {
      // Get AI move
      const position = await getAIMove(gameState.board, gameState.currentPlayer);
      console.log(`AI ${gameState.currentPlayer} chose position: ${position}`);

      // Create new board with the move
      const newBoard = [...gameState.board];
      newBoard[position] = gameState.currentPlayer;

      // Update history
      const newHistory = [
        ...gameState.history,
        { player: gameState.currentPlayer, position },
      ];

      // Check for winner or draw
      const winner = checkWinner(newBoard);
      const isDraw = !winner && checkDraw(newBoard);

      setGameState((prev) => ({
        ...prev,
        board: newBoard,
        currentPlayer: prev.currentPlayer === "X" ? "O" : "X",
        winner: winner || (isDraw ? "draw" : null),
        gameOver: !!winner || isDraw,
        isProcessing: false,
        history: newHistory,
      }));
    } catch (error) {
      console.error("Error during AI move:", error);
      setGameState((prev) => ({ ...prev, isProcessing: false }));
    }
  };

  // Reset game
  const resetGame = () => {
    setGameState({ ...INITIAL_GAME_STATE });
  };

  // Render cell with player marker
  const renderCell = (index: number) => {
    const value = gameState.board[index];
    return (
      <div
        className={`flex items-center justify-center h-24 w-24 text-4xl font-bold border-2 border-gray-300 ${
          value === "X" ? "text-blue-500" : "text-red-500"
        }`}
      >
        {value}
      </div>
    );
  };

  // Get game status text
  const getStatusText = () => {
    if (gameState.winner === "draw") {
      return "Game ended in a draw!";
    } else if (gameState.winner) {
      const winnerName = gameState.winner === "X" ? aiPlayerNames.X : aiPlayerNames.O;
      return `${winnerName} (${gameState.winner}) wins!`;
    } else {
      const currentName = gameState.currentPlayer === "X" ? aiPlayerNames.X : aiPlayerNames.O;
      return `Current player: ${currentName} (${gameState.currentPlayer})`;
    }
  };

  // Get move history text
  const getMoveHistory = () => {
    return gameState.history.map((move, index) => {
      const playerName = move.player === "X" ? aiPlayerNames.X : aiPlayerNames.O;
      return (
        <div key={index} className="text-sm">
          {index + 1}. {playerName} ({move.player}) placed at position {move.position}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">AI Tic Tac Toe Showdown</h1>
      
      <Card className="p-6 mb-6">
        <div className="text-xl font-semibold mb-4">{getStatusText()}</div>
        
        <div className="grid grid-cols-3 gap-1 mb-6">
          {Array(9).fill(null).map((_, index) => (
            <div key={index}>{renderCell(index)}</div>
          ))}
        </div>
        
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleNextMove}
            disabled={gameState.gameOver || gameState.isProcessing}
            className="px-6"
          >
            {gameState.isProcessing ? "Processing..." : "Next Move"}
          </Button>
          
          <Button onClick={resetGame} variant="outline" className="px-6">
            Reset Game
          </Button>
        </div>
      </Card>
      
      <Card className="p-4 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Move History</h2>
        <div className="max-h-48 overflow-y-auto">
          {gameState.history.length === 0 ? (
            <div className="text-sm text-gray-500">No moves yet</div>
          ) : (
            getMoveHistory()
          )}
        </div>
      </Card>
    </div>
  );
} 