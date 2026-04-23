import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 md:p-8 flex flex-col overflow-x-hidden border-8 border-zinc-900 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] relative">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 relative z-10 w-full max-w-[1024px] mx-auto">
        <div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-fuchsia-500">
            NEON SYNTH
          </h1>
          <p className="text-zinc-500 font-mono text-sm tracking-widest mt-2 uppercase">System v2.04 // Audio-Visual Interface</p>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col w-full max-w-[1024px] mx-auto relative z-10 gap-8">
        <div className="flex-1 flex flex-col items-center justify-center w-full">
           <SnakeGame />
        </div>
        
        <div className="w-full">
           <MusicPlayer />
        </div>

        {/* Bottom Info Bar */}
        <div className="w-full mt-auto flex flex-col sm:flex-row items-center justify-between border-t border-zinc-800 pt-4 font-mono text-[10px] text-zinc-600 gap-4">
          <div className="flex gap-4">
            <span>STATUS: ACTIVE</span>
            <span>STREAM: 128KBPS</span>
            <span>SEED: #4829-AI</span>
          </div>
          <div>© 2024 NEON SYNTH INC.</div>
        </div>
      </main>
    </div>
  );
}
