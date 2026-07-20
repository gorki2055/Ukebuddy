import { useState } from 'react';

type Chord = {
  name: string;
  level: string;
  levelColor: string;
  categories: string[];
  dots: { string: number, fret: number }[];
};

const beginnerColor = 'bg-secondary-container text-on-secondary-container';
const intermediateColor = 'bg-tertiary-fixed text-on-tertiary-fixed';
const advancedColor = 'bg-error-container text-on-error-container';

const chords: Chord[] = [
  // Majors (Basic)
  { name: 'C', level: 'Beginner', levelColor: beginnerColor, categories: ['Basic Chords'], dots: [{ string: 4, fret: 3 }] },
  { name: 'D', level: 'Beginner', levelColor: beginnerColor, categories: ['Basic Chords'], dots: [{ string: 1, fret: 2 }, { string: 2, fret: 2 }, { string: 3, fret: 2 }] },
  { name: 'E', level: 'Intermediate', levelColor: intermediateColor, categories: ['Basic Chords', 'Barre Chords'], dots: [{ string: 1, fret: 4 }, { string: 2, fret: 4 }, { string: 3, fret: 4 }, { string: 4, fret: 2 }] },
  { name: 'F', level: 'Beginner', levelColor: beginnerColor, categories: ['Basic Chords'], dots: [{ string: 1, fret: 2 }, { string: 3, fret: 1 }] },
  { name: 'G', level: 'Beginner', levelColor: beginnerColor, categories: ['Basic Chords'], dots: [{ string: 2, fret: 2 }, { string: 3, fret: 3 }, { string: 4, fret: 2 }] },
  { name: 'A', level: 'Beginner', levelColor: beginnerColor, categories: ['Basic Chords'], dots: [{ string: 1, fret: 2 }, { string: 2, fret: 1 }] },
  { name: 'B', level: 'Intermediate', levelColor: intermediateColor, categories: ['Basic Chords', 'Barre Chords'], dots: [{ string: 1, fret: 4 }, { string: 2, fret: 3 }, { string: 3, fret: 2 }, { string: 4, fret: 2 }] },

  // Minors
  { name: 'Cm', level: 'Intermediate', levelColor: intermediateColor, categories: ['Minor Chords', 'Barre Chords'], dots: [{ string: 2, fret: 3 }, { string: 3, fret: 3 }, { string: 4, fret: 3 }] },
  { name: 'Dm', level: 'Beginner', levelColor: beginnerColor, categories: ['Minor Chords', 'Basic Chords'], dots: [{ string: 1, fret: 2 }, { string: 2, fret: 2 }, { string: 3, fret: 1 }] },
  { name: 'Em', level: 'Beginner', levelColor: beginnerColor, categories: ['Minor Chords'], dots: [{ string: 2, fret: 4 }, { string: 3, fret: 3 }, { string: 4, fret: 2 }] },
  { name: 'Fm', level: 'Intermediate', levelColor: intermediateColor, categories: ['Minor Chords'], dots: [{ string: 1, fret: 1 }, { string: 3, fret: 1 }, { string: 4, fret: 3 }] },
  { name: 'Gm', level: 'Intermediate', levelColor: intermediateColor, categories: ['Minor Chords'], dots: [{ string: 2, fret: 2 }, { string: 3, fret: 3 }, { string: 4, fret: 1 }] },
  { name: 'Am', level: 'Beginner', levelColor: beginnerColor, categories: ['Minor Chords', 'Basic Chords'], dots: [{ string: 1, fret: 2 }] },
  { name: 'Bm', level: 'Intermediate', levelColor: intermediateColor, categories: ['Minor Chords', 'Barre Chords'], dots: [{ string: 1, fret: 4 }, { string: 2, fret: 2 }, { string: 3, fret: 2 }, { string: 4, fret: 2 }] },

  // 7ths
  { name: 'C7', level: 'Beginner', levelColor: beginnerColor, categories: ['7th Chords', 'Basic Chords'], dots: [{ string: 4, fret: 1 }] },
  { name: 'D7', level: 'Beginner', levelColor: beginnerColor, categories: ['7th Chords'], dots: [{ string: 1, fret: 2 }, { string: 2, fret: 2 }, { string: 3, fret: 2 }, { string: 4, fret: 3 }] },
  { name: 'E7', level: 'Beginner', levelColor: beginnerColor, categories: ['7th Chords'], dots: [{ string: 1, fret: 1 }, { string: 2, fret: 2 }, { string: 4, fret: 2 }] },
  { name: 'F7', level: 'Intermediate', levelColor: intermediateColor, categories: ['7th Chords'], dots: [{ string: 1, fret: 2 }, { string: 2, fret: 3 }, { string: 3, fret: 1 }, { string: 4, fret: 3 }] },
  { name: 'G7', level: 'Beginner', levelColor: beginnerColor, categories: ['7th Chords', 'Basic Chords'], dots: [{ string: 2, fret: 2 }, { string: 3, fret: 1 }, { string: 4, fret: 2 }] },
  { name: 'A7', level: 'Beginner', levelColor: beginnerColor, categories: ['7th Chords'], dots: [{ string: 2, fret: 1 }] },
  { name: 'B7', level: 'Intermediate', levelColor: intermediateColor, categories: ['7th Chords', 'Barre Chords'], dots: [{ string: 1, fret: 2 }, { string: 2, fret: 3 }, { string: 3, fret: 2 }, { string: 4, fret: 2 }] },
  
  // Advanced
  { name: 'Cmaj7', level: 'Intermediate', levelColor: intermediateColor, categories: ['Advanced'], dots: [{ string: 4, fret: 2 }] },
  { name: 'Gmaj7', level: 'Advanced', levelColor: advancedColor, categories: ['Advanced'], dots: [{ string: 2, fret: 2 }, { string: 3, fret: 2 }, { string: 4, fret: 2 }] },
  { name: 'Ddim', level: 'Advanced', levelColor: advancedColor, categories: ['Advanced'], dots: [{ string: 1, fret: 1 }, { string: 2, fret: 2 }, { string: 3, fret: 1 }, { string: 4, fret: 2 }] },
];

function ChordDiagram({ dots }: { dots: { string: number, fret: number }[] }) {
  // String 1 is G (x=10), String 2 is C (x=30), String 3 is E (x=50), String 4 is A (x=70)
  // Fret 1 is y=20, Fret 2 is y=40, Fret 3 is y=60, Fret 4 is y=80
  return (
    <svg className="mb-2" height="100" viewBox="0 0 80 100" width="80" xmlns="http://www.w3.org/2000/svg">
      {/* Nut */}
      <line stroke="#161a32" strokeWidth="4" x1="10" x2="70" y1="10" y2="10"></line>
      {/* Frets */}
      {[30, 50, 70, 90].map(y => (
        <line key={y} stroke="#88726d" strokeWidth="1" x1="10" x2="70" y1={y} y2={y}></line>
      ))}
      {/* Strings */}
      {[10, 30, 50, 70].map(x => (
        <line key={x} stroke="#161a32" strokeWidth="2" x1={x} x2={x} y1="10" y2="90"></line>
      ))}
      {/* Finger Dots */}
      {dots.map((dot, idx) => (
        <circle key={idx} fill="#9a442d" cx={10 + (dot.string - 1) * 20} cy={dot.fret * 20} r="6"></circle>
      ))}
    </svg>
  );
}

export default function ChordLibrary() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredChords = chords.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || c.categories.includes(filter);
    return matchesSearch && matchesFilter;
  });

  const playChord = (chordName: string) => {
    // In a real app we would use Tone.js to play the full chord
    // Here we'll just simulate playing the root note for prototype
    const ctx = new window.AudioContext();
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    let freq = 261.63; // C by default
    if (chordName.startsWith('C')) freq = 261.63;
    if (chordName.startsWith('D')) freq = 293.66;
    if (chordName.startsWith('E')) freq = 329.63;
    if (chordName.startsWith('F')) freq = 349.23;
    if (chordName.startsWith('G')) freq = 392.00;
    if (chordName.startsWith('A')) freq = 440.00;
    if (chordName.startsWith('B')) freq = 493.88;
    
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.5);
  };

  return (
    <main className="flex-grow w-full max-w-max-width-content mx-margin-desktop px-margin-mobile md:px-0 py-lg pb-32 md:pb-lg">
      {/* Header & Search Section */}
      <div className="flex flex-col gap-md mb-lg text-center md:text-left">
        <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface">Chord Library</h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant max-w-[672px] mx-auto md:mx-0">Find the perfect chord for your next song. Explore our library of easy-to-read ukulele chords.</p>
        <div className="relative w-full max-w-[448px] mx-auto md:mx-0 mt-sm">
          <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline">search</span>
          </div>
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-xl pr-sm py-sm bg-surface-container-low border-2 border-transparent focus:border-secondary rounded-lg text-body-md font-body-md text-on-surface outline-none transition-colors" 
            placeholder="Search chords (e.g., C major, G7)..." 
            type="text" 
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-sm mb-lg pb-xs hide-scrollbar">
        {['All', 'Basic Chords', 'Minor Chords', '7th Chords', 'Barre Chords', 'Advanced'].map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`whitespace-nowrap px-md py-sm rounded-full text-label-md font-label-md transition-colors ${filter === cat ? 'bg-primary-container text-on-primary-container shadow-sm' : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant border border-outline-variant'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Chord Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-gutter md:gap-md">
        {filteredChords.map(chord => (
          <div key={chord.name} className="bg-surface-container-lowest rounded-xl p-md flex flex-col items-center gap-sm card-shadow border border-outline-variant/30 hover:-translate-y-1 transition-transform duration-200">
            <h3 className="text-headline-md font-headline-md text-on-surface">{chord.name}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-label-md mb-2 ${chord.levelColor}`}>{chord.level}</span>
            
            <ChordDiagram dots={chord.dots} />

            <button 
              onClick={() => playChord(chord.name)}
              className="w-full flex items-center justify-center gap-xs py-2 border-2 border-secondary text-secondary hover:bg-secondary-container hover:border-secondary-container rounded-full text-label-md font-label-md transition-colors active:translate-y-[2px]"
            >
              <span className="material-symbols-outlined text-[18px]">volume_up</span> Listen
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
