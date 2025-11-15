import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";

export default function Training({ user, logout }) {
  const [mode, setMode] = useState("aim"); // aim | reaction | combo
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30); // seconds
  const [target, setTarget] = useState({ x: 0, y: 0 });
  const gameAreaRef = useRef(null);
  const timerRef = useRef(null);

  // Start / reset training
  const startTraining = () => {
    setScore(0);
    setTime(30);
    spawnTarget();
  };

  // Spawn a target at random position
  const spawnTarget = () => {
    const area = gameAreaRef.current;
    if (!area) return;

    const size = 40 + Math.random() * 20;
    const x = Math.random() * (area.clientWidth - size);
    const y = Math.random() * (area.clientHeight - size);
    setTarget({ x, y, size });
  };

  // Handle click on target
  const handleHit = () => {
    setScore((s) => s + 1);
    spawnTarget();
  };

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="relative w-full min-h-screen  text-white overflow-hidden">
      

      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-400 mb-6 neon-text text-center">
          Training Ground
        </h1>

        {/* Mode selection */}
        <div className="flex justify-center gap-6 mb-6">
          {["aim", "reaction", "combo"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                mode === m
                  ? "bg-purple-500 text-white neon-button"
                  : "bg-gray-800 text-gray-300 hover:bg-purple-600 hover:text-white"
              }`}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Score and Timer */}
        <div className="flex justify-between mb-4 text-lg text-gray-200">
          <span>Score: {score}</span>
          <span>Time: {time}s</span>
        </div>

        {/* Game area */}
        <div
          ref={gameAreaRef}
          className="relative w-full h-[400px] md:h-[500px] bg-[rgba(10,7,18,0.3)] border border-purple-700/20 rounded-2xl backdrop-blur-md overflow-hidden"
          onClick={(e) => {
            // If click is on target
            const rect = gameAreaRef.current.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            const { x, y, size } = target;
            if (
              clickX >= x &&
              clickX <= x + size &&
              clickY >= y &&
              clickY <= y + size
            ) {
              handleHit();
            }
          }}
        >
          {/* Target */}
          {time > 0 && (
            <div
              className="absolute bg-purple-400 rounded-full border-2 border-purple-600 animate-ping"
              style={{
                width: `${target.size}px`,
                height: `${target.size}px`,
                top: target.y,
                left: target.x,
              }}
            />
          )}
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={startTraining}
            className="px-6 py-3 rounded-full bg-purple-500 neon-button font-semibold text-white hover:bg-purple-600 transition-colors"
          >
            Start Training
          </button>
        </div>
      </div>
    </div>
  );
}
