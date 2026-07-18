import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Practice() {
  const [bpm, setBpm] = useState(90);
  const [useMetronomeClick, setUseMetronomeClick] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [beatCount, setBeatCount] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const nextClickTimeRef = useRef<number>(0);
  const navigate = useNavigate();

  // Metronome Logic
  useEffect(() => {
    if (isPlaying) {
      if (!audioContextRef.current) {
        audioContextRef.current = new window.AudioContext();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      nextClickTimeRef.current = ctx.currentTime + 0.1;

      const scheduleClicks = () => {
        while (nextClickTimeRef.current < ctx.currentTime + 0.1) {
          if (useMetronomeClick) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            // Short click sound
            osc.frequency.value = 1000;
            gain.gain.setValueAtTime(1, nextClickTimeRef.current);
            gain.gain.exponentialRampToValueAtTime(0.001, nextClickTimeRef.current + 0.05);
            
            osc.start(nextClickTimeRef.current);
            osc.stop(nextClickTimeRef.current + 0.05);
            
            // Schedule visual update synced with audio
            const timeUntilClick = (nextClickTimeRef.current - ctx.currentTime) * 1000;
            window.setTimeout(() => setBeatCount(b => b + 1), Math.max(0, timeUntilClick));

          } else {
            const timeUntilClick = (nextClickTimeRef.current - ctx.currentTime) * 1000;
            window.setTimeout(() => setBeatCount(b => b + 1), Math.max(0, timeUntilClick));
          }
          nextClickTimeRef.current += 60.0 / bpm;
        }
        timerRef.current = window.setTimeout(scheduleClicks, 25);
      };
      
      scheduleClicks();
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, bpm, useMetronomeClick]);

  // Exercise Timer Logic
  useEffect(() => {
    let interval: number;
    if (exerciseStarted && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      setExerciseStarted(false);
    }
    return () => clearInterval(interval);
  }, [exerciseStarted, timeLeft]);

  const togglePlay = () => {
    if (!isPlaying && !exerciseStarted && timeLeft === 60) {
      setExerciseStarted(true);
      setBeatCount(0); // Reset beat count when starting
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col relative pb-32">
      {/* Top Navigation */}
      <header className="flex justify-between items-center w-full px-margin-mobile h-16 pt-4 max-w-[1200px] mx-margin-desktop sticky top-0 z-40 bg-background/90 backdrop-blur">
        <button onClick={() => navigate(-1)} aria-label="Go Back" className="w-10 h-10 flex items-center justify-center rounded-full bg-surface shadow-sm text-on-surface hover:bg-surface-variant transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-headline-md font-headline-md text-primary">🎵 Practice Room</h1>
        <div className="flex items-center gap-xs bg-surface py-2 px-4 rounded-full shadow-sm">
          <span className="text-primary font-bold">Day 5</span>
          <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col px-margin-mobile max-w-[1200px] mx-margin-desktop w-full pt-md gap-lg">
        
        {/* Exercise Tabs */}
        <section>
          <div className="flex overflow-x-auto gap-sm pb-2 hide-scrollbar">
            {['🔥 Warm-up', '🤞 Chord Switches', '🪕 Fingerpicking', '🎼 Scales'].map((tab, idx) => (
              <button key={tab} className={`whitespace-nowrap px-4 py-2 rounded-full font-label-md text-label-md transition-colors ${idx === 1 ? 'bg-primary text-on-primary shadow-md' : 'bg-surface text-on-surface-variant border border-outline-variant hover:bg-surface-variant'}`}>
                {tab}
              </button>
            ))}
          </div>
        </section>

        {/* Main Exercise Card */}
        <section className="bg-surface rounded-2xl p-md shadow-2xl border border-outline-variant/30 flex flex-col gap-md relative overflow-hidden">
          <h2 className="text-headline-md font-headline-md text-on-surface text-center">The 1-Minute Chord Switch: C to G</h2>
          
          <div className="flex justify-center items-center gap-lg">
            {/* Chord Diagram C */}
            <div className={`flex flex-col items-center transition-all duration-300 p-4 rounded-xl ${isPlaying && Math.floor(beatCount / 4) % 2 === 0 ? 'scale-110 bg-primary-container/20 border-2 border-primary shadow-sm' : 'opacity-50 scale-95 border-2 border-transparent'}`}>
              <span className="text-chord-display font-chord-display text-on-surface mb-2">C</span>
              <svg height="100" viewBox="0 0 80 100" width="80" xmlns="http://www.w3.org/2000/svg">
                <line stroke="#161a32" strokeWidth="4" x1="10" x2="70" y1="10" y2="10"></line>
                {[30, 50, 70, 90].map(y => <line key={y} stroke="#88726d" strokeWidth="1" x1="10" x2="70" y1={y} y2={y}></line>)}
                {[10, 30, 50, 70].map(x => <line key={x} stroke="#161a32" strokeWidth="2" x1={x} x2={x} y1="10" y2="90"></line>)}
                <circle fill="#9a442d" cx="70" cy="60" r="6"></circle>
              </svg>
            </div>
            
            {/* Animated Arrow */}
            <div className={`flex flex-col items-center justify-center text-primary transition-all duration-300`}>
              <span className={`text-label-md font-label-md mb-2 bg-surface px-2 rounded-full shadow-sm border border-outline-variant ${isPlaying ? 'animate-bounce text-secondary' : ''}`}>
                {isPlaying ? (4 - (beatCount % 4)) + " beats" : "Switch"}
              </span>
              <span className={`material-symbols-outlined text-4xl ${isPlaying ? 'animate-pulse' : ''}`}>sync_alt</span>
            </div>

            {/* Chord Diagram G */}
            <div className={`flex flex-col items-center transition-all duration-300 p-4 rounded-xl ${isPlaying && Math.floor(beatCount / 4) % 2 === 1 ? 'scale-110 bg-soft-blue/20 border-2 border-soft-blue shadow-sm' : 'opacity-50 scale-95 border-2 border-transparent'}`}>
              <span className="text-chord-display font-chord-display text-on-surface mb-2">G</span>
              <svg height="100" viewBox="0 0 80 100" width="80" xmlns="http://www.w3.org/2000/svg">
                <line stroke="#161a32" strokeWidth="4" x1="10" x2="70" y1="10" y2="10"></line>
                {[30, 50, 70, 90].map(y => <line key={y} stroke="#88726d" strokeWidth="1" x1="10" x2="70" y1={y} y2={y}></line>)}
                {[10, 30, 50, 70].map(x => <line key={x} stroke="#161a32" strokeWidth="2" x1={x} x2={x} y1="10" y2="90"></line>)}
                <circle fill="#4A90E2" cx="30" cy="40" r="6"></circle>
                <circle fill="#4A90E2" cx="70" cy="40" r="6"></circle>
                <circle fill="#9a442d" cx="50" cy="60" r="6"></circle>
              </svg>
            </div>
          </div>

          <p className="text-body-lg font-body-lg text-center text-on-surface-variant px-4">
            Switch between C and G as many times as you can in 60 seconds. Strum each chord clearly!
          </p>
          
          <button 
            onClick={() => {
              setExerciseStarted(true);
              setIsPlaying(true);
            }}
            disabled={exerciseStarted}
            className={`w-full py-4 rounded-full font-headline-md text-body-lg flex justify-center items-center gap-2 transition-transform ${exerciseStarted ? 'bg-surface-variant text-on-surface-variant' : 'bg-primary text-on-primary shadow-[0_0_20px_rgba(224,122,95,0.4)] hover:scale-[1.02]'}`}
          >
            {exerciseStarted ? (
              <span className="text-2xl">{timeLeft}s remaining</span>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                START EXERCISE
              </>
            )}
          </button>

          {/* Tempo Controls */}
          <div className="mt-4 p-4 bg-surface-container-low rounded-xl flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="text-label-md font-label-md text-on-surface">Tempo (BPM)</label>
              <span className="text-body-lg font-body-lg text-primary font-bold bg-surface px-3 py-1 rounded-md shadow-sm border border-outline-variant">{bpm}</span>
            </div>
            <input 
              className="w-full h-2 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-primary" 
              max="160" min="40" type="range" 
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
            />
            <div className="flex justify-between items-center pt-2 border-t border-outline-variant">
              <span className="text-body-md font-body-md text-on-surface-variant">I want a metronome click</span>
              <button 
                onClick={() => setUseMetronomeClick(!useMetronomeClick)}
                className={`w-12 h-6 rounded-full relative transition-colors shadow-inner ${useMetronomeClick ? 'bg-primary' : 'bg-outline-variant'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-surface rounded-full shadow-md transition-all ${useMetronomeClick ? 'right-1' : 'left-1'}`}></span>
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Bottom Toolbar (Sticky) */}
      <div className="fixed bottom-0 left-0 w-full bg-surface-container-highest border-t border-outline-variant/50 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-50 rounded-t-3xl pb-8 md:pb-4 flex justify-between items-center max-w-[1200px] mx-margin-desktop">
        
        {/* Pulsing Metronome */}
        <div className="w-12 h-12 rounded-full bg-surface shadow-sm border border-outline-variant flex items-center justify-center relative">
          {isPlaying && <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20"></div>}
          <span className={`material-symbols-outlined ${isPlaying ? 'text-primary' : 'text-on-surface-variant'}`}>metro</span>
        </div>
        
        {/* Giant PLAY/STOP */}
        <button 
          onClick={togglePlay}
          className={`w-20 h-20 rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform absolute left-1/2 -translate-x-1/2 -top-6 border-4 border-surface ${isPlaying ? 'bg-secondary' : 'bg-primary'}`}
        >
          <span className="material-symbols-outlined text-4xl text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            {isPlaying ? 'stop' : 'play_arrow'}
          </span>
        </button>
        
        {/* Controls */}
        <div className="flex gap-2">
          <button 
            onClick={() => {
              setIsPlaying(false);
              setExerciseStarted(false);
              setTimeLeft(60);
              setBeatCount(0);
            }}
            className="w-12 h-12 rounded-full bg-surface shadow-sm border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">restart_alt</span>
          </button>
          <button className="w-12 h-12 rounded-full bg-surface shadow-sm border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined">skip_next</span>
          </button>
        </div>
      </div>
    </div>
  );
}
