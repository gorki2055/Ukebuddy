import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { recordPracticeCompletion } from '../lib/streakLogic';
import { practiceCurriculum } from '../data/practiceLessons';
import type { LessonCategory, PracticeLesson, ChordData } from '../data/practiceLessons';
import confetti from 'canvas-confetti';

function ChordVisualizer({ chord, isPlaying, beatCount, idx, total }: { chord: ChordData, isPlaying: boolean, beatCount: number, idx: number, total: number }) {
  const isActive = isPlaying && Math.floor(beatCount / 4) % total === idx;
  const isSwitching = total > 1;

  return (
    <div 
      className={`flex flex-col items-center transition-all duration-300 p-4 rounded-xl border-2 ${isActive ? 'scale-110 shadow-sm' : isSwitching ? 'opacity-50 scale-95' : ''}`} 
      style={{ 
        borderColor: isActive ? chord.color : 'transparent', 
        backgroundColor: isActive ? `${chord.color}22` : 'transparent' 
      }}
    >
      <span className="text-chord-display font-chord-display text-on-surface mb-2">{chord.name}</span>
      <svg height="100" viewBox="0 0 80 100" width="80" xmlns="http://www.w3.org/2000/svg">
        <line stroke="#161a32" strokeWidth="4" x1="10" x2="70" y1="10" y2="10"></line>
        {[30, 50, 70, 90].map(y => <line key={y} stroke="#88726d" strokeWidth="1" x1="10" x2="70" y1={y} y2={y}></line>)}
        {[10, 30, 50, 70].map(x => <line key={x} stroke="#161a32" strokeWidth="2" x1={x} x2={x} y1="10" y2="90"></line>)}
        {chord.dots.map((dot, i) => (
          <circle key={i} fill={chord.color} cx={10 + (dot.string - 1) * 20} cy={dot.fret * 20} r="6"></circle>
        ))}
      </svg>
    </div>
  );
}

const StrumVisualizer = ({ pattern, currentStep, isPlaying }: { pattern: ('D'|'U'|'-')[], currentStep: number, isPlaying: boolean }) => {
  return (
    <div 
      className="mx-auto bg-surface-container-low rounded-2xl p-md border border-outline-variant mt-2 mb-4"
      style={{ width: '100%', maxWidth: '600px' }}
    >
      <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-4 text-center">Strumming Guide</h3>
      <div className="flex flex-row justify-center items-center gap-2 sm:gap-4 flex-wrap w-full">
        {pattern.map((stroke, i) => {
          const isActive = isPlaying && ((currentStep % 8) === i);
          
          if (stroke === '-') {
            return (
              <div key={i} className="flex flex-col items-center justify-center h-16 w-6 opacity-30">
                <div className={`w-2 h-2 rounded-full transition-all duration-100 ${isActive ? 'bg-primary scale-150' : 'bg-outline-variant'}`}></div>
              </div>
            );
          }

          return (
            <div key={i} className="flex flex-col items-center gap-1 w-10">
              <span 
                className={`material-symbols-outlined transition-all duration-100 ${isActive ? 'text-primary -translate-y-1 scale-125 drop-shadow-md' : 'text-outline-variant'}`} 
                style={{ fontSize: '36px', fontVariationSettings: "'wght' 800" }}
              >
                {stroke === 'D' ? 'arrow_downward' : 'arrow_upward'}
              </span>
              <span className={`font-label-md text-[10px] ${isActive ? 'text-primary font-bold' : 'text-outline'}`}>
                {stroke === 'D' ? 'DOWN' : 'UP'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function Practice() {
  const categories: LessonCategory[] = ['Warm-up', 'Chord Switches', 'Strumming', 'Fingerpicking', 'Scales'];
  const [activeCategory, setActiveCategory] = useState<LessonCategory>('Warm-up');
  
  const categoryLessons = practiceCurriculum.filter(l => l.category === activeCategory);
  const [activeLesson, setActiveLesson] = useState<PracticeLesson>(categoryLessons[0]);

  const [bpm, setBpm] = useState(activeLesson.defaultBpm);
  const [useMetronomeClick, setUseMetronomeClick] = useState(true);
  const [playChordSound, setPlayChordSound] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(activeLesson.durationSeconds);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [beatCount, setBeatCount] = useState(0);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [newStreakData, setNewStreakData] = useState<number | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const nextClickTimeRef = useRef<number>(0);
  const scheduledBeatCountRef = useRef<number>(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Reset exercise when lesson changes
  useEffect(() => {
    setIsPlaying(false);
    setExerciseStarted(false);
    setBpm(activeLesson.defaultBpm);
    setTimeLeft(activeLesson.durationSeconds);
    setBeatCount(0);
    scheduledBeatCountRef.current = 0;
  }, [activeLesson]);

  // When category changes, default to first lesson
  useEffect(() => {
    const lessons = practiceCurriculum.filter(l => l.category === activeCategory);
    setActiveLesson(lessons[0]);
  }, [activeCategory]);

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
        const isStrumming = activeLesson.type === 'strum' && activeLesson.strumPattern;
        const stepDuration = isStrumming ? (30.0 / bpm) : (60.0 / bpm);
        const stepsPerMeasure = isStrumming ? 8 : 4;

        while (nextClickTimeRef.current < ctx.currentTime + 0.1) {
          const currentStep = scheduledBeatCountRef.current;
          
          const totalChords = activeLesson.chords ? activeLesson.chords.length : 1;
          const activeChordIndex = Math.floor(currentStep / stepsPerMeasure) % totalChords;
          const activeChord = activeLesson.chords?.[activeChordIndex];

          const isDownbeat = isStrumming ? (currentStep % 2 === 0) : true;
          const measureBeat = isStrumming ? Math.floor((currentStep % 8) / 2) : (currentStep % 4);

          let shouldPlayChord = false;
          if (playChordSound && activeChord) {
            if (isStrumming) {
              shouldPlayChord = activeLesson.strumPattern![currentStep % 8] !== '-';
            } else {
              shouldPlayChord = true;
            }
          }

          if (shouldPlayChord) {
            // Play chord root note sound
            const osc = ctx.createOscillator();
            osc.type = 'triangle';
            let freq = 261.63; // C by default
            const chordName = activeChord!.name;
            if (chordName.startsWith('C')) freq = 261.63;
            if (chordName.startsWith('D')) freq = 293.66;
            if (chordName.startsWith('E')) freq = 329.63;
            if (chordName.startsWith('F')) freq = 349.23;
            if (chordName.startsWith('G')) freq = 392.00;
            if (chordName.startsWith('A')) freq = 440.00;
            if (chordName.startsWith('B')) freq = 493.88;

            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(freq, nextClickTimeRef.current);
            gain.gain.setValueAtTime(0.5, nextClickTimeRef.current);
            gain.gain.exponentialRampToValueAtTime(0.001, nextClickTimeRef.current + 1.0);
            osc.start(nextClickTimeRef.current);
            osc.stop(nextClickTimeRef.current + 1.0);
          } 
          
          if (useMetronomeClick && isDownbeat) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            // Short click sound, higher pitch on downbeat
            osc.frequency.value = (measureBeat === 0) ? 1200 : 800;
            gain.gain.setValueAtTime(1, nextClickTimeRef.current);
            gain.gain.exponentialRampToValueAtTime(0.001, nextClickTimeRef.current + 0.05);
            
            osc.start(nextClickTimeRef.current);
            osc.stop(nextClickTimeRef.current + 0.05);
          }

          // Schedule visual update synced with audio
          const timeUntilClick = (nextClickTimeRef.current - ctx.currentTime) * 1000;
          window.setTimeout(() => setBeatCount(currentStep + 1), Math.max(0, timeUntilClick));

          scheduledBeatCountRef.current++;
          nextClickTimeRef.current += stepDuration;
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
  }, [isPlaying, bpm, useMetronomeClick, playChordSound]);

  // Exercise Timer Logic
  useEffect(() => {
    let interval: number;
    if (exerciseStarted && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (exerciseStarted && timeLeft === 0) {
      setIsPlaying(false);
      setExerciseStarted(false);
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#9a442d', '#4A90E2', '#386753', '#e07a5f', '#ffdeab']
      });
      
      setShowStreakModal(true);
      
      // TRIGGER DATABASE UPDATE
      if (user) {
        recordPracticeCompletion(user.id).then(res => {
          if (res.success && res.newStreak) {
            console.log('Practice recorded! New streak:', res.newStreak);
            setNewStreakData(res.newStreak);
          }
        });
      }
    }
    return () => clearInterval(interval);
  }, [exerciseStarted, timeLeft, user]);

  const togglePlay = () => {
    if (!isPlaying && !exerciseStarted && timeLeft === activeLesson.durationSeconds) {
      setExerciseStarted(true);
      setBeatCount(0);
      scheduledBeatCountRef.current = 0;
    }
    setIsPlaying(!isPlaying);
  };

  const skipNextLesson = () => {
    const currentIndex = categoryLessons.findIndex(l => l.id === activeLesson.id);
    if (currentIndex < categoryLessons.length - 1) {
      setActiveLesson(categoryLessons[currentIndex + 1]);
    } else {
      // Loop back to start or maybe do nothing
      setActiveLesson(categoryLessons[0]);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col relative pb-40">
      {/* Top Navigation */}
      <header className="flex justify-between items-center w-full px-margin-mobile h-16 pt-4 max-w-[1200px] mx-margin-desktop sticky top-0 z-40 bg-background/90 backdrop-blur">
        <button onClick={() => navigate(-1)} aria-label="Go Back" className="w-10 h-10 flex items-center justify-center rounded-full bg-surface shadow-sm text-on-surface hover:bg-surface-variant transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-headline-md font-headline-md text-primary">🎵 Practice Room</h1>
        <div className="flex items-center gap-xs bg-surface py-2 px-4 rounded-full shadow-sm">
          <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col px-margin-mobile max-w-[1200px] mx-margin-desktop w-full pt-md gap-md">
        
        {/* Exercise Tabs */}
        <section>
          <div className="flex overflow-x-auto gap-sm pb-2 hide-scrollbar">
            {categories.map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveCategory(tab)}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-label-md text-label-md transition-colors ${tab === activeCategory ? 'bg-primary text-on-primary shadow-md' : 'bg-surface text-on-surface-variant border border-outline-variant hover:bg-surface-variant'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        {/* Lesson List */}
        <section className="mb-4">
          {categoryLessons.length > 10 ? (
            <div className="flex justify-between items-center bg-surface p-2 rounded-full border border-outline-variant shadow-sm mx-auto max-w-sm">
              <button 
                onClick={() => {
                  const idx = categoryLessons.findIndex(l => l.id === activeLesson.id);
                  if (idx > 0) setActiveLesson(categoryLessons[idx - 1]);
                }}
                disabled={activeLesson.id === categoryLessons[0].id}
                className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors disabled:opacity-30"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              
              <div className="flex flex-col items-center justify-center">
                <span className="font-bold text-label-md text-on-surface">{activeLesson.title}</span>
                <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                  {categoryLessons.findIndex(l => l.id === activeLesson.id) + 1} of {categoryLessons.length}
                </span>
              </div>

              <button 
                onClick={() => {
                  const idx = categoryLessons.findIndex(l => l.id === activeLesson.id);
                  if (idx < categoryLessons.length - 1) setActiveLesson(categoryLessons[idx + 1]);
                }}
                disabled={activeLesson.id === categoryLessons[categoryLessons.length - 1].id}
                className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors disabled:opacity-30"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          ) : (
            <div className="flex overflow-x-auto gap-sm pb-2 hide-scrollbar">
              {categoryLessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setActiveLesson(lesson);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex-shrink-0 px-4 py-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    activeLesson.id === lesson.id 
                      ? 'bg-secondary-container border-secondary text-on-secondary-container shadow-sm' 
                      : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-variant'
                  }`}
                  style={{ width: '220px' }}
                >
                  <span className="font-label-md text-sm opacity-80">{Math.floor(lesson.durationSeconds / 60)}:{(lesson.durationSeconds % 60).toString().padStart(2, '0')}</span>
                  <span className="font-bold text-body-md truncate">{lesson.title}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Main Exercise Card */}
        <section className="bg-surface rounded-2xl p-md shadow-2xl border border-outline-variant/30 flex flex-col gap-md relative overflow-hidden flex-grow mb-6">
          <h2 className="text-headline-md font-headline-md text-on-surface text-center">{activeLesson.title}</h2>
          
          <div className="flex justify-center items-center gap-lg flex-wrap min-h-[160px]">
            {activeLesson.chords && activeLesson.chords.length > 0 ? (
              activeLesson.chords.map((chord, idx) => (
                <div key={chord.name} className="flex items-center gap-lg">
                  <ChordVisualizer 
                    chord={chord} 
                    isPlaying={isPlaying} 
                    beatCount={beatCount} 
                    idx={idx} 
                    total={activeLesson.chords!.length} 
                  />
                  {/* Show Animated Arrow if it's a switch and not the last chord */}
                  {activeLesson.type === 'switch' && idx < activeLesson.chords!.length - 1 && (
                    <div className={`flex flex-col items-center justify-center text-primary transition-all duration-300 w-20`}>
                      <span className={`text-label-md font-label-md mb-2 bg-surface rounded-full shadow-sm border border-outline-variant w-[70px] text-center py-1 ${isPlaying ? 'animate-bounce text-secondary' : ''}`}>
                        {isPlaying ? (4 - (beatCount % 4)) + " beats" : "Switch"}
                      </span>
                      <span className={`material-symbols-outlined text-4xl ${isPlaying ? 'animate-pulse' : ''}`}>sync_alt</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              // Visual for single/strum/pluck without specific chords
              <div className="flex flex-col items-center justify-center text-primary transition-all duration-300">
                <span className={`material-symbols-outlined text-[80px] ${isPlaying ? 'animate-pulse text-secondary' : 'text-outline-variant'}`}>
                  {activeLesson.type === 'strum' ? 'pan_tool' : 'music_note'}
                </span>
                <span className="text-label-md mt-4 text-on-surface-variant uppercase tracking-widest">{activeLesson.category}</span>
              </div>
            )}
          </div>
          
          {activeLesson.type === 'strum' && activeLesson.strumPattern && (
            <StrumVisualizer pattern={activeLesson.strumPattern} currentStep={beatCount === 0 ? -1 : beatCount - 1} isPlaying={isPlaying} />
          )}

          <p className="text-body-lg font-body-lg text-center text-on-surface-variant px-4 mb-4">
            {activeLesson.description}
          </p>
          
          <div className="mt-auto">
            <button 
              onClick={() => {
                setExerciseStarted(true);
                setIsPlaying(true);
              }}
              disabled={exerciseStarted}
              className={`w-full py-4 rounded-full font-headline-md text-body-lg flex justify-center items-center gap-2 transition-transform ${exerciseStarted ? 'bg-surface-variant text-on-surface-variant' : 'bg-primary text-on-primary shadow-[0_0_20px_rgba(224,122,95,0.4)] hover:scale-[1.02]'}`}
            >
              {exerciseStarted ? (
                <span className="text-2xl">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} remaining</span>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  START EXERCISE
                </>
              )}
            </button>
          </div>

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
                className={`w-12 h-6 rounded-full relative transition-colors shadow-inner flex-shrink-0 ${useMetronomeClick ? 'bg-primary' : 'bg-outline-variant'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-surface rounded-full shadow-md transition-all ${useMetronomeClick ? 'right-1' : 'left-1'}`}></span>
              </button>
            </div>

            {activeLesson.chords && activeLesson.chords.length > 0 && (
              <div className="flex justify-between items-center pt-2 border-t border-outline-variant">
                <span className="text-body-md font-body-md text-on-surface-variant">Play chord sound</span>
                <button 
                  onClick={() => setPlayChordSound(!playChordSound)}
                  className={`w-12 h-6 rounded-full relative transition-colors shadow-inner flex-shrink-0 ${playChordSound ? 'bg-primary' : 'bg-outline-variant'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-surface rounded-full shadow-md transition-all ${playChordSound ? 'right-1' : 'left-1'}`}></span>
                </button>
              </div>
            )}
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
              setTimeLeft(activeLesson.durationSeconds);
              setBeatCount(0);
              scheduledBeatCountRef.current = 0;
            }}
            className="w-12 h-12 rounded-full bg-surface shadow-sm border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">restart_alt</span>
          </button>
          <button 
            onClick={skipNextLesson}
            className="w-12 h-12 rounded-full bg-surface shadow-sm border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">skip_next</span>
          </button>
        </div>
      </div>
      
      {showStreakModal && (
        <div className="fixed inset-0 bg-[#161a32]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center mb-6 shadow-inner">
              <span className="material-symbols-outlined text-[40px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            </div>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-2">Drill Complete!</h2>
            {newStreakData ? (
              <p className="text-body-lg font-body-lg text-on-surface-variant mb-8">
                Awesome work! You've extended your daily practice streak to <strong className="text-primary">{newStreakData} days</strong>!
              </p>
            ) : (
              <p className="text-body-lg font-body-lg text-on-surface-variant mb-8">
                Great job completing your practice drill today!
              </p>
            )}
            
            <button 
              onClick={() => {
                setShowStreakModal(false);
                skipNextLesson();
              }}
              className="w-full py-4 bg-primary text-on-primary rounded-full font-label-md text-label-md transition-transform hover:scale-105 shadow-md flex justify-center items-center gap-2"
            >
              Continue Practicing
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button
              onClick={() => setShowStreakModal(false)}
              className="mt-4 text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
