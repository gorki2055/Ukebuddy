import { useState, useEffect, useRef } from 'react';

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function noteFromPitch(frequency: number) {
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  return Math.round(noteNum) + 69;
}

function centsOffFromPitch(frequency: number, note: number) {
  return Math.floor(1200 * Math.log(frequency / frequencyFromNoteNumber(note)) / Math.log(2));
}

function frequencyFromNoteNumber(note: number) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

function autoCorrelate(buf: Float32Array, sampleRate: number) {
  let SIZE = buf.length;
  let rms = 0;
  for (let i = 0; i < SIZE; i++) {
    const val = buf[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return -1;

  let r1 = 0, r2 = SIZE - 1, thres = 0.2;
  for (let i = 0; i < SIZE / 2; i++)
    if (Math.abs(buf[i]) < thres) { r1 = i; break; }
  for (let i = 1; i < SIZE / 2; i++)
    if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }

  buf = buf.slice(r1, r2);
  SIZE = buf.length;

  const c = new Array(SIZE).fill(0);
  for (let i = 0; i < SIZE; i++)
    for (let j = 0; j < SIZE - i; j++)
      c[i] = c[i] + buf[j] * buf[j + i];

  let d = 0;
  while (c[d] > c[d + 1]) d++;
  let maxval = -1, maxpos = -1;
  for (let i = d; i < SIZE; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  let T0 = maxpos;
  const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}

export default function Tuner() {
  const [note, setNote] = useState<string>("--");
  const [cents, setCents] = useState<number>(0);
  const [isListening, setIsListening] = useState(false);
  const [activeString, setActiveString] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioContext = new window.AudioContext();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      setIsListening(true);
      updatePitch();
    } catch (err) {
      console.error("Error accessing mic", err);
    }
  };

  const stopListening = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsListening(false);
    setNote("--");
    setCents(0);
  };

  const updatePitch = () => {
    if (!analyserRef.current || !audioContextRef.current) return;
    const buf = new Float32Array(2048);
    analyserRef.current.getFloatTimeDomainData(buf);
    const ac = autoCorrelate(buf, audioContextRef.current.sampleRate);
    
    if (ac !== -1) {
      const noteNum = noteFromPitch(ac);
      const noteName = notes[noteNum % 12];
      const centDiff = centsOffFromPitch(ac, noteNum);
      
      setNote(noteName);
      setCents(centDiff);
    }
    
    rafIdRef.current = requestAnimationFrame(updatePitch);
  };

  useEffect(() => {
    return () => stopListening();
  }, []);

  const playReferencePitch = (freq: number, strName: string) => {
    setActiveString(strName);
    const ctx = new window.AudioContext();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 2);
    setTimeout(() => {
      setActiveString(null);
    }, 2000);
  };

  // Limit rotation visual
  const rotation = Math.max(-45, Math.min(45, cents));
  const isPerfect = Math.abs(cents) < 5 && note !== "--";
  
  let statusText = "Start tuning";
  if (isListening && note !== "--") {
    if (isPerfect) statusText = "In Tune!";
    else if (cents < 0) statusText = "Too Flat";
    else statusText = "Too Sharp";
  }

  const strings = [
    { name: "G", freq: 392.00, octave: 4 },
    { name: "C", freq: 261.63, octave: 3 },
    { name: "E", freq: 329.63, octave: 4 },
    { name: "A", freq: 440.00, octave: 4 }
  ];

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-margin-mobile py-lg pb-24 md:pb-lg w-full max-w-[1200px] margin-desktop">
      <div className="bg-surface-container-lowest rounded-xl p-md md:p-xl shadow-[0_8px_20px_rgba(85,66,62,0.08)] border border-surface-dim w-full max-w-[672px] flex flex-col items-center relative overflow-hidden">
        
        {/* Atmospheric Background Element */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-secondary-fixed rounded-full mix-blend-multiply filter blur-[80px] opacity-40"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-primary-fixed rounded-full mix-blend-multiply filter blur-[80px] opacity-30"></div>
        
        <div className="relative z-10 w-full flex flex-col items-center">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2 text-center">Ukulele Tuner</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl text-center">Standard Tuning (G-C-E-A)</p>
          
          {/* Tuner Display Area */}
          <div className="relative w-full aspect-[2/1] max-w-[448px] mx-auto mb-12 flex justify-center items-end border-b-2 border-outline-variant pb-4">
            
            {/* Frequency / Note Display */}
            <div className="absolute top-0 w-full text-center">
              <div className={`font-chord-display text-chord-display ${isPerfect ? 'text-secondary' : 'text-primary'}`}>
                {note}
              </div>
              <div className="font-label-md text-label-md text-outline tracking-widest mt-2 uppercase">
                {note !== "--" && isListening ? `${cents > 0 ? '+' : ''}${cents} CENTS` : "--- CENTS"}
              </div>
            </div>
            
            {/* Tuner Arc (SVG Background) */}
            <svg className="absolute bottom-0 w-full h-full text-surface-variant z-0" preserveAspectRatio="xMidYMax meet" viewBox="0 0 200 100">
              <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4"></path>
              <line stroke="currentColor" strokeWidth="2" x1="10" x2="20" y1="100" y2="100"></line>
              <line stroke="currentColor" strokeWidth="2" x1="28" x2="36" y1="65" y2="70"></line>
              <line stroke="currentColor" strokeWidth="2" x1="60" x2="65" y1="30" y2="38"></line>
              <line stroke="currentColor" strokeWidth="4" x1="100" x2="100" y1="10" y2="20"></line>
              <line stroke="currentColor" strokeWidth="2" x1="140" x2="135" y1="30" y2="38"></line>
              <line stroke="currentColor" strokeWidth="2" x1="172" x2="164" y1="65" y2="70"></line>
              <line stroke="currentColor" strokeWidth="2" x1="190" x2="180" y1="100" y2="100"></line>
            </svg>
            
            {/* Tuner Needle */}
            <div 
              className={`w-1 h-3/4 absolute bottom-4 rounded-full z-10 origin-bottom transition-transform duration-100 ease-out ${isPerfect ? 'bg-secondary' : 'bg-primary'}`}
              style={{ transform: `rotate(${isListening ? rotation : 0}deg)` }}
            ></div>
            
            {/* Needle Pivot */}
            <div className={`w-4 h-4 rounded-full absolute bottom-2 z-20 shadow-sm border-2 border-surface-container-lowest ${isPerfect ? 'bg-secondary' : 'bg-primary'}`}></div>
          </div>
          
          {/* Tuning Status */}
          <div className="flex items-center gap-xs mb-xl bg-surface-container-high px-4 py-2 rounded-full">
            <span className={`w-3 h-3 rounded-full ${isPerfect ? 'bg-secondary' : isListening ? 'bg-error' : 'bg-outline'}`}></span>
            <span className="font-label-md text-label-md text-on-surface">{statusText}</span>
          </div>
          
          {/* Reference Pitch Buttons */}
          <div className="flex gap-4 md:gap-8 justify-center w-full">
            {strings.map((str) => {
              const isActive = activeString === str.name;
              return (
                <button 
                  key={str.name} 
                  className="flex flex-col items-center gap-2 group focus:outline-none" 
                  onClick={() => playReferencePitch(str.freq, str.name)}
                >
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full border-2 flex items-center justify-center font-headline-md text-headline-md transition-all active:scale-95 ${isActive ? 'bg-surface-container-low border-secondary text-secondary shadow-[0_0_0_4px] shadow-secondary-fixed' : 'border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-primary hover:text-primary'}`}>
                    {str.name}
                  </div>
                  <span className="font-label-md text-label-md text-outline">{str.octave}</span>
                </button>
              );
            })}
          </div>
          
          {/* Mic Toggle */}
          <div className="mt-xl">
            <button 
              onClick={isListening ? stopListening : startListening}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-colors shadow-sm active:translate-y-0.5 ${isListening ? 'bg-error text-on-error hover:bg-error/90' : 'bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed'}`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
              <span className="font-label-md text-label-md">{isListening ? 'Stop Listening' : 'Start Listening'}</span>
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
