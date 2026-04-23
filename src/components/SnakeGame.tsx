import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE: [number, number][] = [[10, 10], [10, 11], [10, 12]];
const INITIAL_DIRECTION: [number, number] = [0, -1]; // moving up

type Point = [number, number];

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>([5, 5]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const directionRef = useRef(direction);
  // Keep track of last moved direction to prevent reversing into itself on quick double key presses
  const lastMovedDirectionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = [
        Math.floor(Math.random() * GRID_SIZE),
        Math.floor(Math.random() * GRID_SIZE),
      ];
      // Check if food is on snake
      if (!currentSnake.some(segment => segment[0] === newFood[0] && segment[1] === newFood[1])) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    lastMovedDirectionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        setIsPaused(p => !p);
        return;
      }

      if (gameOver || isPaused) return;

      const [lastDx, lastDy] = lastMovedDirectionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (lastDy !== 1) directionRef.current = [0, -1];
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (lastDy !== -1) directionRef.current = [0, 1];
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (lastDx !== 1) directionRef.current = [-1, 0];
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (lastDx !== -1) directionRef.current = [1, 0];
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prev => {
        const head = prev[0];
        const currentDir = directionRef.current;
        lastMovedDirectionRef.current = currentDir;
        
        const newHead: Point = [
          head[0] + currentDir[0],
          head[1] + currentDir[1]
        ];

        // Check bounds
        if (
          newHead[0] < 0 || newHead[0] >= GRID_SIZE ||
          newHead[1] < 0 || newHead[1] >= GRID_SIZE
        ) {
          setGameOver(true);
          return prev;
        }

        // Check self collision checking all segments
        if (prev.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])) {
           setGameOver(true);
           return prev;
        }

        const newSnake = [newHead, ...prev];

        // Check food
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
           setScore(s => s + 10);
           setFood(generateFood(newSnake));
        } else {
           newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, 150 - (Math.floor(score / 50) * 10));
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [gameOver, isPaused, food, score, generateFood]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[600px] mx-auto">
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-4">
          <button 
            onClick={() => setIsPaused(p => !p)}
            className="px-6 py-2 bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-white rounded font-mono transition-colors uppercase text-xs tracking-widest font-bold shadow-md"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button 
            onClick={resetGame}
            className="px-6 py-2 bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-white rounded font-mono transition-colors uppercase text-xs tracking-widest font-bold shadow-md"
          >
            Reset
          </button>
        </div>
        <div className="text-right">
          <div className="text-5xl font-mono text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)] leading-none">{score.toString().padStart(5, '0')}</div>
          <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Current Score</div>
        </div>
      </div>

      <div className="relative w-full aspect-square bg-zinc-900 rounded-xl border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center p-3 md:p-6 mx-auto">
        {/* Draw Grid Background Overlay Lines */}
        <div 
          className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-10 pointer-events-none" 
        >
            {Array.from({ length: 400 }).map((_, i) => (
                <div key={i} className="border-r border-b border-zinc-500"></div>
            ))}
        </div>

        {/* Game State overlay elements */}
        <div className="absolute bottom-4 left-0 right-0 text-center z-0 pointer-events-none">
          <span className="text-[10px] text-zinc-600 font-mono tracking-[0.3em] uppercase">Use Arrow Keys to Navigate</span>
        </div>

        {/* Game Area Grid */}
        <div 
          className="relative w-full h-full grid z-10 gap-[1px]" 
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            
            const isFood = food[0] === x && food[1] === y;
            const snakeSegmentIndex = snake.findIndex(segment => segment[0] === x && segment[1] === y);
            const isSnake = snakeSegmentIndex !== -1;
            const isHead = snakeSegmentIndex === 0;

            return (
              <div 
                key={i} 
                className={`
                  w-full h-full relative
                  ${isFood ? 'bg-fuchsia-500 rounded-full scale-[0.8] animate-pulse shadow-[0_0_10px_#d946ef]' : ''}
                  ${isSnake && isHead ? 'bg-green-400 rounded-sm scale-95 z-20 shadow-[0_0_10px_#4ade80]' : ''}
                  ${isSnake && !isHead ? 'bg-green-400 scale-95 rounded-sm shadow-[0_0_10px_#4ade80] opacity-90' : ''}
                `}
              />
            );
          })}
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-zinc-950/90 flex items-center justify-center backdrop-blur-sm z-30">
            <div className="text-center flex flex-col items-center p-8 bg-zinc-900 border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-xl relative overflow-hidden">
              <h2 className="text-4xl md:text-5xl font-black text-fuchsia-500 tracking-tighter uppercase mb-6 drop-shadow-[0_0_10px_var(--tw-shadow-color)] shadow-fuchsia-500/50 relative z-10">System Offline</h2>
              <div className="text-right flex flex-col items-end mb-8 relative z-10">
                <div className="text-5xl font-mono text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)] leading-none -mb-1">{score.toString().padStart(5, '0')}</div>
                <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-2 border-t border-zinc-800 pt-2 w-full">Final Score</div>
              </div>
              <button 
                onClick={resetGame}
                className="px-8 py-4 bg-white text-black rounded-lg font-bold font-mono tracking-widest hover:scale-105 transition-transform flex items-center justify-center uppercase w-full shadow-[0_0_20px_rgba(255,255,255,0.4)] relative z-10"
              >
                Reboot
              </button>
            </div>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-zinc-950/80 flex items-center justify-center backdrop-blur-md z-30">
            <h2 className="text-5xl font-black text-cyan-400 tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">Paused</h2>
          </div>
        )}
      </div>
    </div>
  );
}
