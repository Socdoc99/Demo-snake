import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-black text-[#0ff] font-mono selection:bg-[#f0f] selection:text-[#0ff]">
      <div className="scanlines"></div>
      <div className="static-noise"></div>
      
      <div className="relative z-10 w-full max-w-7xl flex flex-col xl:flex-row items-center justify-center gap-12 p-2 sm:p-8">
        
        {/* Central Game Area */}
        <div className="w-full flex-1 flex flex-col items-center jarring-box p-4 md:p-10 screen-tear">
          <div className="mb-8 text-center uppercase">
            <h1 className="text-3xl md:text-5xl font-sans glitch" data-text="SYS.SNAKE()">
              SYS.SNAKE()
            </h1>
            <p className="text-[#f0f] font-mono text-lg md:text-2xl mt-4 bg-black border-2 border-[#f0f] inline-block px-2">
              RUNTIME_CORRUPTED
            </p>
          </div>
          <SnakeGame />
        </div>

        {/* Music Player Side Panel */}
        <div className="w-full xl:w-[450px] flex-shrink-0 flex items-center justify-center screen-tear" style={{animationDelay: '1s'}}>
          <MusicPlayer />
        </div>

      </div>
    </div>
  );
}
