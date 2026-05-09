import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: '1',
    title: 'NEON_HORIZON_CORRUPT',
    artist: 'SYS.GENERATIVE',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'CYBERPULSE_OVERRIDE',
    artist: 'MEM.DUMP',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'GRID_RUNNER_FATAL',
    artist: 'AUDIO_LEAK',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      if (dur > 0) {
        setProgress((current / dur) * 100);
        setDuration(dur);
      }
    }
  };

  const handleEnded = () => handleNext();

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const m = Math.floor(timeInSeconds / 60);
    const s = Math.floor(timeInSeconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - bounds.left) / bounds.width;
      audioRef.current.currentTime = percent * audioRef.current.duration;
      setProgress(percent * 100);
    }
  };

  return (
    <div className="w-full p-6 jarring-box bg-black flex flex-col relative font-mono uppercase">
      
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
      />

      {/* Header */}
      <div className="border-b-4 border-[#0ff] pb-2 mb-6 flex justify-between items-end">
        <span className="text-[#0ff] text-xl font-sans glitch" data-text="AUDIO_SYS">AUDIO_SYS</span>
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="bg-black text-[#f0f] border-2 border-[#f0f] px-2 py-1 hover:bg-[#f0f] hover:text-black hover:border-black transition-none cursor-pointer text-sm"
        >
          {isMuted ? '[MUTE:ON]' : '[MUTE:OFF]'}
        </button>
      </div>

      {/* Track Info */}
      <div className="flex flex-col gap-2 mb-8 bg-[#f0f] p-4 border-l-8 border-[#0ff] text-black">
        <div className="flex justify-between items-center">
            <span className="font-bold text-sm">TRK_{currentTrack.id}</span>
            <span className={isPlaying ? "animate-pulse" : ""}>{isPlaying ? 'PLAYING' : 'STOPPED'}</span>
        </div>
        <h3 className="font-sans text-lg md:text-xl break-all uppercase mt-2" style={{lineHeight: 1.2}}>
            {currentTrack.title}
        </h3>
        <p className="text-xs font-bold opacity-80 mt-2">&gt; {currentTrack.artist}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div 
          className="h-6 w-full bg-black border-4 border-[#0ff] cursor-pointer relative overflow-hidden flex items-center"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-[#0ff] relative transition-none"
            style={{ width: `${progress}%` }}
          >
             <div className="absolute right-0 top-0 w-2 h-full bg-[#f0f]"></div>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-[#0ff] font-bold">
          <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : "0:00"}</span>
          <span>{duration ? formatTime(duration) : "0:00"}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-4">
        <button 
          onClick={handlePrev}
          className="p-4 bg-black border-4 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-black font-bold text-center transition-none cursor-pointer"
        >
          &lt;&lt;
        </button>
        
        <button 
          onClick={togglePlay}
          className={`p-4 bg-black border-4 border-[#f0f] text-[#f0f] hover:bg-[#f0f] hover:text-black font-bold text-center transition-none cursor-pointer ${isPlaying ? 'animate-pulse' : ''}`}
        >
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>
        
        <button 
          onClick={handleNext}
          className="p-4 bg-black border-4 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-black font-bold text-center transition-none cursor-pointer"
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  );
}
