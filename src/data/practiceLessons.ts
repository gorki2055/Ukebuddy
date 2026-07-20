export type LessonCategory = 'Warm-up' | 'Chord Switches' | 'Strumming' | 'Fingerpicking' | 'Scales';

export interface ChordData {
  name: string;
  dots: { string: number; fret: number }[];
  color: string;
}

export interface PracticeLesson {
  id: string;
  category: LessonCategory;
  title: string;
  description: string;
  defaultBpm: number;
  durationSeconds: number;
  type: 'switch' | 'strum' | 'single' | 'pluck';
  chords?: ChordData[];
  strumPattern?: ('D' | 'U' | '-')[];
  level?: number;
}

// Reusable chord shapes to avoid duplication
const CHORDS = {
  C: { name: 'C', color: '#9a442d', dots: [{ string: 4, fret: 3 }] },
  G: { name: 'G', color: '#4A90E2', dots: [{ string: 2, fret: 2 }, { string: 3, fret: 3 }, { string: 4, fret: 2 }] },
  F: { name: 'F', color: '#386753', dots: [{ string: 1, fret: 2 }, { string: 3, fret: 1 }] },
  Am: { name: 'Am', color: '#765a28', dots: [{ string: 1, fret: 2 }] },
  Dm: { name: 'Dm', color: '#ba1a1a', dots: [{ string: 1, fret: 2 }, { string: 2, fret: 2 }, { string: 3, fret: 1 }] },
  C7: { name: 'C7', color: '#d97706', dots: [{ string: 4, fret: 1 }] },
  G7: { name: 'G7', color: '#0284c7', dots: [{ string: 2, fret: 2 }, { string: 3, fret: 1 }, { string: 4, fret: 2 }] },
};

export const practiceCurriculum: PracticeLesson[] = [
  // WARM-UPS
  {
    id: 'warmup-spider',
    category: 'Warm-up',
    title: 'The Spider Walk',
    description: 'Walk your fingers up and down the neck, one string at a time. Play 1st fret (index), 2nd (middle), 3rd (ring), 4th (pinky), then move to the next string.',
    defaultBpm: 60,
    durationSeconds: 60,
    type: 'single',
  },
  {
    id: 'warmup-single-plucks',
    category: 'Warm-up',
    title: 'Single String Plucking',
    description: 'Pluck each string individually (G - C - E - A) to the beat. Focus on making each note ring out clearly without buzzing.',
    defaultBpm: 80,
    durationSeconds: 60,
    type: 'single',
  },

  // CHORD SWITCHES
  {
    id: 'switch-c-f-g',
    category: 'Chord Switches',
    title: 'The Big Three: C - F - G',
    description: 'Switch between C, F, and G. This sequence allows you to play hundreds of songs!',
    defaultBpm: 60,
    durationSeconds: 90,
    type: 'switch',
    chords: [CHORDS.C, CHORDS.F, CHORDS.C, CHORDS.G],
  },
  {
    id: 'switch-c7-g7',
    category: 'Chord Switches',
    title: 'Blues Basics: C7 to G7',
    description: 'Switch between C7 and G7. This is a very common change in blues progressions.',
    defaultBpm: 65,
    durationSeconds: 60,
    type: 'switch',
    chords: [CHORDS.C7, CHORDS.G7],
  },
  {
    id: 'switch-c-am',
    category: 'Chord Switches',
    title: 'The 1-Finger Switch: C to Am',
    description: 'Switch between C and Am. Notice how you only need to move one finger from the A string to the G string!',
    defaultBpm: 70,
    durationSeconds: 60,
    type: 'switch',
    chords: [CHORDS.C, CHORDS.Am],
  },
  {
    id: 'switch-c-f',
    category: 'Chord Switches',
    title: 'The 2-Finger Switch: C to F',
    description: 'Switch between C and F. This adds a second finger to the mix. Keep your hand relaxed during the transition.',
    defaultBpm: 70,
    durationSeconds: 60,
    type: 'switch',
    chords: [CHORDS.C, CHORDS.F],
  },
  {
    id: 'switch-c-g',
    category: 'Chord Switches',
    title: 'The Boss Level: C to G',
    description: 'Switch between C and G as many times as you can in 60 seconds. Strum each chord clearly on the click!',
    defaultBpm: 60,
    durationSeconds: 60,
    type: 'switch',
    chords: [CHORDS.C, CHORDS.G],
  },
  {
    id: 'switch-am-dm',
    category: 'Chord Switches',
    title: 'Minor Melancholy: Am to Dm',
    description: 'Switch from Am to Dm. Pro tip: Keep your middle finger anchored on the G string (2nd fret) during the switch!',
    defaultBpm: 70,
    durationSeconds: 60,
    type: 'switch',
    chords: [CHORDS.Am, CHORDS.Dm],
  },

  // STRUMMING
  // LEVEL 1: The Basics
  { id: 'strum-1', category: 'Strumming', level: 1, title: 'Pattern 1', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['D', '-', 'D', '-', 'D', '-', 'D', '-'] },
  { id: 'strum-2', category: 'Strumming', level: 1, title: 'Pattern 2', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['D', '-', 'D', '-', 'D', '-', 'D', 'U'] },
  { id: 'strum-3', category: 'Strumming', level: 1, title: 'Pattern 3', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['D', 'U', 'D', 'U', 'D', 'U', 'D', 'U'] },
  { id: 'strum-4', category: 'Strumming', level: 1, title: 'Pattern 4', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['D', '-', 'D', 'U', 'D', '-', 'D', 'U'] },
  { id: 'strum-5', category: 'Strumming', level: 1, title: 'Pattern 5', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['D', 'U', 'D', '-', 'D', 'U', 'D', '-'] },
  { id: 'strum-6', category: 'Strumming', level: 1, title: 'Pattern 6', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['D', '-', 'D', 'U', '-', 'U', 'D', '-'] },
  { id: 'strum-7', category: 'Strumming', level: 1, title: 'Pattern 7', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['D', 'U', '-', 'U', 'D', 'U', '-', 'U'] },
  { id: 'strum-8', category: 'Strumming', level: 1, title: 'Pattern 8', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['D', '-', 'D', '-', 'D', 'U', 'D', 'U'] },
  // LEVEL 2: Syncopation
  { id: 'strum-9', category: 'Strumming', level: 2, title: 'Pattern 9', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['D', '-', 'D', 'U', 'D', 'U', 'D', 'U'] },
  { id: 'strum-10', category: 'Strumming', level: 2, title: 'Pattern 10', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['D', 'U', '-', 'U', '-', 'U', '-', 'U'] },
  { id: 'strum-11', category: 'Strumming', level: 2, title: 'Pattern 11', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['D', 'U', '-', 'U', '-', 'U', 'D', 'U'] },
  { id: 'strum-12', category: 'Strumming', level: 2, title: 'Pattern 12', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['-', 'U', 'D', 'U', 'D', 'U', '-', 'U'] },
  { id: 'strum-13', category: 'Strumming', level: 2, title: 'Pattern 13', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['D', '-', 'D', 'U', 'D', '-', 'D', '-'] },
  { id: 'strum-14', category: 'Strumming', level: 2, title: 'Pattern 14', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['-', 'U', '-', 'U', '-', 'U', '-', 'U'] },
  { id: 'strum-15', category: 'Strumming', level: 2, title: 'Pattern 15', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['-', 'U', '-', 'U', '-', 'U', 'D', 'U'] },
  { id: 'strum-16', category: 'Strumming', level: 2, title: 'Pattern 16', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['-', 'U', 'D', 'U', '-', 'U', 'D', 'U'] },
  // LEVEL 3: Rests and Space
  { id: 'strum-17', category: 'Strumming', level: 3, title: 'Pattern 17', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['D', '-', '-', '-', 'D', '-', '-', '-'] },
  { id: 'strum-18', category: 'Strumming', level: 3, title: 'Pattern 18', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['-', '-', 'D', '-', '-', '-', 'D', '-'] },
  { id: 'strum-19', category: 'Strumming', level: 3, title: 'Pattern 19', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['D', 'U', 'D', '-', 'D', '-', 'D', '-'] },
  { id: 'strum-20', category: 'Strumming', level: 3, title: 'Pattern 20', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['D', 'U', '-', 'U', 'D', '-', 'D', 'U'] },
  { id: 'strum-21', category: 'Strumming', level: 3, title: 'Pattern 21', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['D', '-', '-', '-', '-', 'U', 'D', 'U'] },
  { id: 'strum-22', category: 'Strumming', level: 3, title: 'Pattern 22', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['D', '-', '-', 'U', 'D', '-', 'D', '-'] },
  { id: 'strum-23', category: 'Strumming', level: 3, title: 'Pattern 23', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['D', 'U', 'D', 'U', 'D', '-', 'D', '-'] },
  { id: 'strum-24', category: 'Strumming', level: 3, title: 'Pattern 24', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['-', 'U', 'D', '-', 'D', '-', 'D', '-'] },
  // LEVEL 4: Advanced Rhythms
  { id: 'strum-25', category: 'Strumming', level: 4, title: 'Pattern 25', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['D', 'U', 'D', 'U', 'D', '-', '-', 'U'] },
  { id: 'strum-26', category: 'Strumming', level: 4, title: 'Pattern 26', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['D', 'U', '-', '-', 'D', 'U', '-', '-'] },
  { id: 'strum-27', category: 'Strumming', level: 4, title: 'Pattern 27', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['-', 'U', 'D', 'U', 'D', 'U', 'D', 'U'] },
  { id: 'strum-28', category: 'Strumming', level: 4, title: 'Pattern 28', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['-', 'U', 'D', '-', 'D', '-', 'D', 'U'] },
  { id: 'strum-29', category: 'Strumming', level: 4, title: 'Pattern 29', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['D', 'U', 'D', 'U', '-', 'U', 'D', 'U'] },
  { id: 'strum-30', category: 'Strumming', level: 4, title: 'Pattern 30', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['D', '-', 'D', '-', '-', 'U', 'D', 'U'] },
  { id: 'strum-31', category: 'Strumming', level: 4, title: 'Pattern 31', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['D', 'U', 'D', 'U', 'D', 'U', 'D', '-'] },
  { id: 'strum-32', category: 'Strumming', level: 4, title: 'Pattern 32', description: 'Keep a steady rhythm and focus on timing.', defaultBpm: 70, durationSeconds: 60, type: 'strum', chords: [CHORDS.C], strumPattern: ['-', 'U', 'D', 'U', '-', 'U', 'D', '-'] },

  // FINGERPICKING
  {
    id: 'pluck-pima',
    category: 'Fingerpicking',
    title: 'P-I-M-A Arpeggios',
    description: 'Hold a C chord. Pluck strings 4-3-2-1 in order using your Thumb (P), Index (I), Middle (M), and Ring (A) fingers.',
    defaultBpm: 90,
    durationSeconds: 90,
    type: 'pluck',
    chords: [CHORDS.C],
  },
  {
    id: 'pluck-outside-in',
    category: 'Fingerpicking',
    title: 'Outside-Inside Picking',
    description: 'Pluck the G & A strings simultaneously, then the C & E strings simultaneously. Alternating back and forth.',
    defaultBpm: 80,
    durationSeconds: 90,
    type: 'pluck',
    chords: [CHORDS.Am],
  },

  // SCALES
  {
    id: 'scale-c-major',
    category: 'Scales',
    title: 'C Major Scale (Open)',
    description: 'Play Do-Re-Mi-Fa-Sol-La-Ti-Do starting from the open C string, moving up to the 3rd fret of the A string.',
    defaultBpm: 75,
    durationSeconds: 90,
    type: 'single',
  },
  {
    id: 'scale-a-minor-pentatonic',
    category: 'Scales',
    title: 'A Minor Pentatonic Blues',
    description: 'The classic blues scale. Practice playing it up and down the neck to build finger independence.',
    defaultBpm: 70,
    durationSeconds: 90,
    type: 'single',
  },
];
