import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 100;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const directionRef = useRef(direction);
  const snakeRef = useRef(snake);
  const nextDirectionRef = useRef(direction);

  useEffect(() => {
    directionRef.current = direction;
    snakeRef.current = snake;
  }, [snake, direction]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    nextDirectionRef.current = INITIAL_DIRECTION;
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

      if (gameOver) {
        if (e.key === 'Enter' || e.key === ' ') resetGame();
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current.y === 0) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current.y === 0) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current.x === 0) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current.x === 0) nextDirectionRef.current = { x: 1, y: 0 };
          break;
        case 'Escape':
        case 'p':
        case 'P':
        case ' ': // pause with spacebar
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  // Game Loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const currentDir = nextDirectionRef.current;
        setDirection(currentDir);

        const newHead = {
          x: head.x + currentDir.x,
          y: head.y + currentDir.y,
        };

        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          setHighScore((prev) => Math.max(prev, score));
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, score, generateFood]);

  return (
    <div className="flex flex-col items-center justify-center w-full uppercase font-mono">
      {/* Score Board */}
      <div className="flex justify-between w-full max-w-sm mb-6 border-b-4 border-[#f0f] pb-2">
        <div className="flex flex-col text-left">
          <span className="text-sm text-[#0ff]">PTS:</span>
          <span className="text-3xl text-[#fff] font-sans glitch" data-text={score.toString()}>{score}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-sm text-[#f0f]">HI:</span>
          <span className="text-3xl text-[#fff] font-sans glitch" data-text={highScore.toString()}>{highScore}</span>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative p-2 jarring-box border-[#f0f] shadow-[#0ff]">
        <div 
          className="grid gap-0 bg-[#000] border-2 border-[rgba(0,255,255,0.2)]"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(75vw, 400px)',
            height: 'min(75vw, 400px)',
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = snake.some((segment, i) => i !== 0 && segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;

            let cellClass = 'w-full h-full border border-[rgba(255,0,255,0.1)] ';
            
            if (isHead) cellClass += 'bg-[#fff] border-2 border-[#0ff] z-10 scale-110 shadow-[0_0_10px_#0ff]';
            else if (isBody) cellClass += 'bg-[#0ff] border border-[#000]';
            else if (isFood) cellClass += 'bg-[#f0f] animate-pulse rounded-none scale-75 border-2 border-[#fff] shadow-[0_0_15px_#f0f]';

            return <div key={index} className={cellClass} />;
          })}
        </div>

        {/* Overlays */}
        {(gameOver || isPaused) && (
          <div className="absolute inset-2 z-20 flex items-center justify-center bg-black/90 backdrop-blur-sm border-4 border-[#f0f] animate-pulse" style={{animationDuration: '2s'}}>
            <div className="text-center p-6 w-full max-w-[80%] bg-black jarring-box border-4 border-[#0ff]">
              <h2 className="text-2xl md:text-3xl font-sans glitch text-white mb-4" data-text={gameOver ? 'ERR_SYS_DEAD' : 'HALT_EXEC'}>
                {gameOver ? 'ERR_SYS_DEAD' : 'HALT_EXEC'}
              </h2>
              <p className="text-[#0ff] text-lg font-bold mb-8">
                {gameOver ? `FINAL_PTS: ${score}` : 'PRESS_P_CONTINUE'}
              </p>
              {gameOver && (
                <button 
                  onClick={resetGame}
                  className="px-6 py-4 bg-black border-4 border-[#0ff] text-[#0ff] text-xl font-bold transition-none hover:bg-[#0ff] hover:text-black cursor-pointer w-full"
                >
                  [ REBOOT ]
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Controls Hint */}
      <div className="text-center text-[#f0f] text-sm md:text-base mt-6 border-2 border-[#0ff] p-2 bg-black">
        [WASD]=MOVE  [P]=PAUSE
      </div>
    </div>
  );
}
