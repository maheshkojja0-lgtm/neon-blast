import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'Neon Nightride (AI Synthwave)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Cybernetic Dreams (AI Pulse)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Grid Runner (AI Overdrive)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Playback prevented', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setProgress(value);
    }
  };

  const handleTrackEnded = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex-1 mx-auto flex flex-col lg:flex-row items-stretch lg:items-center gap-6 p-6 bg-zinc-900 rounded-xl border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
      
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
        onLoadedMetadata={handleTimeUpdate}
      />

      {/* Track Info (Left Area equivalent) */}
      <div className="flex-1 w-full flex items-center min-w-0 bg-zinc-950/50 p-4 rounded-lg border-l-4 border-green-400">
        <div className="w-12 h-12 rounded bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-800 mr-4">
           {isPlaying ? (
              <div className="flex items-end gap-[2px] h-4">
                  <div className="w-1 bg-green-400 animate-[bounce_1s_infinite] shadow-[0_0_5px_#4ade80]"></div>
                  <div className="w-1 bg-green-400 animate-[bounce_1s_infinite_100ms] shadow-[0_0_5px_#4ade80]"></div>
                  <div className="w-1 bg-green-400 animate-[bounce_1s_infinite_200ms] shadow-[0_0_5px_#4ade80]"></div>
              </div>
           ) : (
               <Music className="w-5 h-5 text-zinc-500" />
           )}
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest font-mono mb-1 drop-shadow-[0_0_5px_rgba(74,222,128,0.2)]">
            {`0${currentTrackIndex + 1} // NOW PLAYING`}
          </span>
          <span className="font-bold text-zinc-100 truncate text-base md:text-lg">
            {currentTrack.title.split(' (')[0]}
          </span>
          <span className="text-xs text-zinc-500 italic mt-0.5 font-serif truncate">
            {currentTrack.title.includes('(') ? currentTrack.title.split('(')[1].replace(')', '') : 'AI Generated Rhythm'}
          </span>
        </div>
      </div>

      {/* Controls & Progress (Center/Right Area equivalent) */}
      <div className="flex flex-col items-center flex-[2] w-full gap-4">
        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={handlePrev}
            className="text-zinc-500 hover:text-white transition-colors outline-none focus:text-white"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)] outline-none"
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 ml-1 fill-current" />}
          </button>
          <button 
            onClick={handleNext}
            className="text-zinc-500 hover:text-white transition-colors outline-none focus:text-white"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>
        
        <div className="flex flex-col w-full space-y-1.5 px-2 md:px-6">
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono tracking-widest">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="relative w-full h-1.5 bg-zinc-800 rounded-full group cursor-pointer">
            <input 
              type="range" 
              min={0}
              max={duration || 100}
              value={progress}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {/* Fill bar */}
            <div 
              className="absolute top-0 left-0 h-full bg-green-400 rounded-full pointer-events-none shadow-[0_0_8px_#4ade80]"
              style={{ width: `${(progress / (duration || 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center justify-end gap-3 flex-1 w-full shrink-0">
          <button onClick={() => setIsMuted(!isMuted)} className="text-zinc-500 hover:text-white transition-colors outline-none">
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5"/> : <Volume2 className="w-5 h-5"/>}
          </button>
          <div className="relative w-24 md:w-32 h-1.5 bg-zinc-800 rounded-full group cursor-pointer">
            <input 
              type="range" 
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if(parseFloat(e.target.value) > 0) setIsMuted(false);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className="absolute top-0 left-0 h-full bg-zinc-400 rounded-full pointer-events-none"
              style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
            ></div>
          </div>
      </div>

    </div>
  );
}
