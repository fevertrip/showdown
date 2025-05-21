"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GameState, INITIAL_GAME_STATE, Player } from "@/types/game";
import { checkWinner, checkDraw, getAIMove } from "@/lib/game-utils";

// Available OpenAI models
const AI_MODELS = [
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "gpt-4", label: "GPT-4" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
];

export default function TicTacToe() {
  const [gameState, setGameState] = useState<GameState>({ ...INITIAL_GAME_STATE });
  const [aiPlayerNames, setAiPlayerNames] = useState({
    X: "AI Player 1",
    O: "AI Player 2",
  });
  const [aiPlayerModels, setAiPlayerModels] = useState({
    X: "gpt-3.5-turbo",
    O: "gpt-3.5-turbo",
  });
  const [lastMove, setLastMove] = useState<number | null>(null);

  // Handle model change
  const handleModelChange = (player: Player, model: string) => {
    setAiPlayerModels((prev) => ({
      ...prev,
      [player]: model,
    }));
  };

  // Handle next move function
  const handleNextMove = async () => {
    if (gameState.gameOver || gameState.isProcessing) return;

    setGameState((prev) => ({ ...prev, isProcessing: true }));

    try {
      // Get AI move
      const position = await getAIMove(
        gameState.board, 
        gameState.currentPlayer, 
        aiPlayerModels[gameState.currentPlayer]
      );
      console.log(`AI ${gameState.currentPlayer} chose position: ${position}`);

      // Create new board with the move
      const newBoard = [...gameState.board];
      newBoard[position] = gameState.currentPlayer;
      setLastMove(position);

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
    setLastMove(null);
  };

  // Render cell with player marker
  const renderCell = (index: number) => {
    const value = gameState.board[index];
    
    // Check if this cell is part of the winning combination
    const isWinningCell = gameState.winner && 
      typeof gameState.winner === 'string' && 
      gameState.winner !== 'draw' && 
      isPartOfWinningCombination(gameState.board, index, gameState.winner);
    
    // Check if this is the last move
    const isLastMove = index === lastMove;
    
    return (
      <div
        className={`relative flex items-center justify-center h-20 md:h-24 lg:h-28 w-20 md:w-24 lg:w-28 text-3xl md:text-4xl lg:text-5xl font-bold rounded-xl 
          shadow-md transition-all duration-300 
          ${value === "X" ? "text-blue-500" : value === "O" ? "text-purple-500" : "text-transparent"}
          ${isWinningCell ? "bg-green-100 dark:bg-green-900" : "bg-white dark:bg-slate-800"}
          ${isLastMove ? "ring-2 ring-offset-2 ring-offset-slate-100 dark:ring-offset-slate-800" : ""}
          ${value === "X" && isLastMove ? "ring-blue-400" : value === "O" && isLastMove ? "ring-purple-400" : ""}`}
      >
        {value ? (
          <span className={`transform ${isLastMove ? "animate-pop-in" : ""}`}>
            {value}
          </span>
        ) : (
          <span className="opacity-0">&nbsp;</span>
        )}
        
        {/* Cell highlight effect */}
        {isWinningCell && (
          <div className="absolute inset-0 rounded-xl bg-green-400 opacity-20 animate-pulse"></div>
        )}
      </div>
    );
  };

  // Helper function to check if a cell is part of the winning combination
  const isPartOfWinningCombination = (board: (string | null)[], cellIndex: number, winner: string) => {
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
    
    // Check if the cell is part of a winning combination
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (
        board[a] === winner && 
        board[b] === winner && 
        board[c] === winner &&
        (cellIndex === a || cellIndex === b || cellIndex === c)
      ) {
        return true;
      }
    }
    
    return false;
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
      const isLastMove = index === gameState.history.length - 1;
      
      return (
        <div 
          key={index} 
          className={`text-sm py-1.5 px-2 -mx-2 border-b border-slate-100 dark:border-slate-800 last:border-0 rounded-md transition-colors
            ${isLastMove ? "bg-slate-50 dark:bg-slate-800/80" : ""}`}
        >
          <span className="font-medium text-slate-700 dark:text-slate-300">{index + 1}.</span>{" "}
          <span className={`font-medium ${move.player === "X" ? "text-blue-500" : "text-purple-500"}`}>
            {playerName} ({move.player})
          </span>{" "}
          placed at position {move.position}
        </div>
      );
    });
  };

  // Get the status bar class
  const getStatusBarClass = () => {
    if (gameState.winner === "X") return "bg-blue-500";
    if (gameState.winner === "O") return "bg-purple-500";
    if (gameState.winner === "draw") return "bg-amber-500";
    if (gameState.isProcessing) return "bg-slate-500 animate-pulse";
    return gameState.currentPlayer === "X" ? "bg-blue-500" : "bg-purple-500";
  };

  // PlayIcon component
  const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  );

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-6">
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="h-2 bg-blue-500"></div>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-3 text-blue-500 flex items-center gap-2">
              <span className="inline-block w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">X</span>
              {aiPlayerNames.X}
            </h2>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">AI Model:</label>
              <Select
                value={aiPlayerModels.X}
                onValueChange={(value) => handleModelChange("X", value)}
                disabled={gameState.isProcessing}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {AI_MODELS.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
        
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="h-2 bg-purple-500"></div>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-3 text-purple-500 flex items-center gap-2">
              <span className="inline-block w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm">O</span>
              {aiPlayerNames.O}
            </h2>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">AI Model:</label>
              <Select
                value={aiPlayerModels.O}
                onValueChange={(value) => handleModelChange("O", value)}
                disabled={gameState.isProcessing}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {AI_MODELS.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>
      
      <Card className="mb-6 border-0 shadow-lg overflow-hidden w-full">
        <div className={`h-2 transition-colors duration-300 ${getStatusBarClass()}`}></div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <div className="text-xl font-semibold mb-3 sm:mb-0">{getStatusText()}</div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleNextMove}
                disabled={gameState.gameOver || gameState.isProcessing}
                className="w-[200px] flex justify-center items-center py-4 h-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md transition-all duration-300 hover:scale-105"
              >
                {gameState.isProcessing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <PlayIcon />
                    Next Move
                  </span>
                )}
              </Button>
              
              <Button 
                onClick={resetGame} 
                variant="outline" 
                className="px-4 py-2 h-auto shadow border-slate-300 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Reset
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="grid grid-cols-3 gap-2 md:gap-3 p-4 md:p-5 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-xl shadow-lg">
              {Array(9).fill(null).map((_, index) => (
                <div key={index} className="p-1">{renderCell(index)}</div>
              ))}
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 w-full border-0 shadow-lg">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8v4l3 3"></path>
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
          Move History
        </h2>
        <div className="max-h-48 overflow-y-auto pr-2">
          {gameState.history.length === 0 ? (
            <div className="text-sm text-slate-500 py-3 text-center">No moves yet</div>
          ) : (
            getMoveHistory()
          )}
        </div>
      </Card>
    </div>
  );
} 