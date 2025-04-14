import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./App.css";

const GRID_SIZE = 5;
const START_POS = { x: 0, y: 0 };
const END_POS = { x: 4, y: 4 };

const MAZES = [
  [
    [0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 1, 0],
    [1, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 1, 1, 0, 0],
  ],
  [
    [0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 1, 0, 0],
    [0, 0, 1, 0, 1],
    [0, 1, 1, 0, 0],
  ],
  [
    [0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 1, 1, 0],
  ],
  [
    [0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
  ]
];

function App() {
  const [level, setLevel] = useState(0);
  const [maze, setMaze] = useState(MAZES[level]);
  const [playerPos, setPlayerPos] = useState(START_POS);
  const [status, setStatus] = useState("playing");
  const [timeLeft, setTimeLeft] = useState(30);

  // Memoizing the sound objects
  const moveSound = useMemo(() => new Audio("/move.wav"), []);
  const wallSound = useMemo(() => new Audio("/wall.wav"), []);
  const winSound = useMemo(() => new Audio("/victory_chime.wav"), []);

  useEffect(() => {
    if (status === "playing" && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setStatus("lost");
    }
  }, [status, timeLeft]);

  const movePlayer = useCallback((dx, dy) => {
    if (status !== "playing") return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE && maze[newY][newX] === 0) {
      setPlayerPos({ x: newX, y: newY });
      moveSound.play();
      if (newX === END_POS.x && newY === END_POS.y) {
        winSound.play();
        if (level < MAZES.length - 1) {
          setLevel(level + 1);
          setMaze(MAZES[level + 1]);
          setPlayerPos(START_POS);
        } else {
          setStatus("won");
        }
      }
    } else {
      wallSound.play();
    }
  }, [status, playerPos, maze, level, moveSound, wallSound, winSound]); // No need to re-create sound objects on each render

  const restartGame = () => {
    setPlayerPos(START_POS);
    setStatus("playing");
    setTimeLeft(30);
    setLevel(0);
    setMaze(MAZES[0]);
  };

  const handleKeyDown = useCallback((e) => {
    if (status !== "playing") return;
    if (e.key === "ArrowUp") movePlayer(0, -1);
    else if (e.key === "ArrowDown") movePlayer(0, 1);
    else if (e.key === "ArrowLeft") movePlayer(-1, 0);
    else if (e.key === "ArrowRight") movePlayer(1, 0);
  }, [status, movePlayer]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="game-container">
      <h1>Mind Maze</h1>
      <div className="status">
        {status === "won" ? "You Escaped All Levels! 🎉" : status === "lost" ? `Time's up! ⏰` : `Time Left: ${timeLeft}s`}
      </div>
      <div className="grid">
        {maze.map((row, y) =>
          row.map((cell, x) => {
            let className = "cell";
            if (cell === 1) className += " wall";
            if (playerPos.x === x && playerPos.y === y) className += " player";
            if (END_POS.x === x && END_POS.y === y) className += " goal";
            return <div key={`${x}-${y}`} className={className}></div>;
          })
        )}
      </div>
      {status !== "playing" && (
        <button onClick={restartGame}>Restart</button>
      )}
      <div className="controls">
        <button onClick={() => movePlayer(0, -1)}>↑</button>
        <div>
          <button onClick={() => movePlayer(-1, 0)}>←</button>
          <button onClick={() => movePlayer(1, 0)}>→</button>
        </div>
        <button onClick={() => movePlayer(0, 1)}>↓</button>
      </div>
    </div>
  );
}

export default App;