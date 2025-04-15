import React, { useState, useEffect } from "react";
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
  ],
];

function App() {
  const [level, setLevel] = useState(0);
  const [maze, setMaze] = useState(MAZES[0]);
  const [playerPos, setPlayerPos] = useState(START_POS);
  const [status, setStatus] = useState("playing");
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (status === "playing" && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setStatus("lost");
    }
  }, [status, timeLeft]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (status !== "playing") return;

      const move = (dx, dy) => {
        const newX = playerPos.x + dx;
        const newY = playerPos.y + dy;

        if (
          newX >= 0 &&
          newX < GRID_SIZE &&
          newY >= 0 &&
          newY < GRID_SIZE &&
          maze[newY][newX] === 0
        ) {
          setPlayerPos({ x: newX, y: newY });
          new Audio("/move.wav").play();

          if (newX === END_POS.x && newY === END_POS.y) {
            new Audio("/victory_chime.wav").play();
            if (level < MAZES.length - 1) {
              const nextLevel = level + 1;
              setLevel(nextLevel);
              setMaze(MAZES[nextLevel]);
              setPlayerPos(START_POS);
              setTimeLeft(30);
            } else {
              setStatus("won");
            }
          }
        } else {
          new Audio("/wall.wav").play();
        }
      };

      if (e.key === "ArrowUp") move(0, -1);
      else if (e.key === "ArrowDown") move(0, 1);
      else if (e.key === "ArrowLeft") move(-1, 0);
      else if (e.key === "ArrowRight") move(1, 0);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status, playerPos, maze, level]);

  const handleButtonClick = (dx, dy) => {
    if (status !== "playing") return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (
      newX >= 0 &&
      newX < GRID_SIZE &&
      newY >= 0 &&
      newY < GRID_SIZE &&
      maze[newY][newX] === 0
    ) {
      setPlayerPos({ x: newX, y: newY });
      new Audio("/move.wav").play();

      if (newX === END_POS.x && newY === END_POS.y) {
        new Audio("/victory_chime.wav").play();
        if (level < MAZES.length - 1) {
          const nextLevel = level + 1;
          setLevel(nextLevel);
          setMaze(MAZES[nextLevel]);
          setPlayerPos(START_POS);
          setTimeLeft(30);
        } else {
          setStatus("won");
        }
      }
    } else {
      new Audio("/wall.wav").play();
    }
  };

  const restartGame = () => {
    setPlayerPos(START_POS);
    setStatus("playing");
    setTimeLeft(30);
    setLevel(0);
    setMaze(MAZES[0]);
  };

  return (
    <div className="game-container">
      <h1>Mind Maze</h1>
      <div className="status">
        {status === "won"
          ? "You Escaped All Levels! 🎉"
          : status === "lost"
          ? "Time's up! ⏰"
          : `Time Left: ${timeLeft}s`}
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
      {status !== "playing" && <button onClick={restartGame}>Restart</button>}
      <div className="controls">
        <button onClick={() => handleButtonClick(0, -1)}>↑</button>
        <div>
          <button onClick={() => handleButtonClick(-1, 0)}>←</button>
          <button onClick={() => handleButtonClick(1, 0)}>→</button>
        </div>
        <button onClick={() => handleButtonClick(0, 1)}>↓</button>
      </div>
    </div>
  );
}

export default App;