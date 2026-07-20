import * as Tone from 'tone';

class AudioEngine {
  private isInitialized = false;
  private sampler: Tone.Sampler | null = null;
  private synth: Tone.PolySynth | null = null;
  private clickHigh: Tone.MembraneSynth | null = null;
  private clickLow: Tone.MembraneSynth | null = null;
  public useRealSound = true;
  private loaded = false;

  async init() {
    if (this.isInitialized) return;
    
    await Tone.start();

    // Metronome Click Synths
    this.clickHigh = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 4,
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.01 }
    }).toDestination();
    this.clickHigh.volume.value = -5;

    this.clickLow = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 4,
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.01 }
    }).toDestination();
    this.clickLow.volume.value = -10;

    // Generated Synth
    this.synth = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 3,
      modulationIndex: 10,
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 1.5 },
      modulation: { type: "square" },
      modulationEnvelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.5 }
    }).toDestination();
    this.synth.volume.value = -8;

    // Real Sampler (Using Nylon Guitar soundfont as a stand-in for Ukulele)
    this.sampler = new Tone.Sampler({
      urls: {
        "A2": "A2.mp3",
        "C3": "C3.mp3",
        "E3": "E3.mp3",
        "G3": "G3.mp3",
        "C4": "C4.mp3",
        "E4": "E4.mp3",
        "G4": "G4.mp3",
        "A4": "A4.mp3"
      },
      baseUrl: "https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/acoustic_guitar_nylon-mp3/",
      onload: () => {
        this.loaded = true;
      }
    }).toDestination();
    this.sampler.volume.value = 2; // Boost volume slightly

    this.isInitialized = true;
  }

  playClick(isDownbeat: boolean, time: number) {
    if (isDownbeat && this.clickHigh) {
      this.clickHigh.triggerAttackRelease("G5", "32n", time);
    } else if (this.clickLow) {
      this.clickLow.triggerAttackRelease("C5", "32n", time);
    }
  }

  getVoicing(chordName: string): string[] {
    // Basic Ukulele Voicings (GCEA tuning)
    const voicings: Record<string, string[]> = {
      // Majors
      'C': ['G4', 'C4', 'E4', 'C5'],
      'D': ['A4', 'D4', 'F#4', 'A4'],
      'E': ['G#4', 'E4', 'G#4', 'B4'],
      'F': ['A4', 'C4', 'F4', 'A4'],
      'G': ['G4', 'D4', 'G4', 'B4'],
      'A': ['A4', 'C#4', 'E4', 'A4'],
      'B': ['B4', 'D#4', 'F#4', 'B4'],
      
      // Minors
      'Cm': ['G4', 'C4', 'D#4', 'C5'],
      'Dm': ['A4', 'D4', 'F4', 'A4'],
      'Em': ['G4', 'E4', 'G4', 'B4'],
      'Fm': ['G#4', 'C4', 'F4', 'G#4'],
      'Gm': ['G4', 'D4', 'G4', 'A#4'],
      'Am': ['A4', 'C4', 'E4', 'A4'],
      'Bm': ['B4', 'D4', 'F#4', 'B4'],
      
      // 7ths
      'C7': ['G4', 'C4', 'E4', 'A#4'],
      'D7': ['A4', 'D4', 'F#4', 'C5'],
      'E7': ['G#4', 'D4', 'E4', 'B4'],
      'F7': ['A4', 'D#4', 'F4', 'C5'],
      'G7': ['G4', 'D4', 'F4', 'B4'],
      'A7': ['G4', 'C#4', 'E4', 'A4'],
      'B7': ['A4', 'D#4', 'F#4', 'B4'],
      
      // Advanced
      'Cmaj7': ['G4', 'C4', 'E4', 'B4'],
      'Gmaj7': ['G4', 'D4', 'F#4', 'B4'],
      'Ddim': ['G#4', 'D4', 'F4', 'B4'],
    };
    return voicings[chordName] || ['C4', 'E4', 'G4', 'C5']; // Fallback to C
  }

  playChord(chordName: string, time: number) {
    const voicing = this.getVoicing(chordName);
    
    // Simulate strum (micro delay between strings)
    const strumDuration = 0.05; // 50ms for a full strum
    const delayPerString = strumDuration / voicing.length;

    voicing.forEach((note, index) => {
      const noteTime = time + (index * delayPerString);
      
      if (this.useRealSound && this.sampler && this.loaded) {
        this.sampler.triggerAttackRelease(note, "2n", noteTime);
      } else if (this.synth) {
        this.synth.triggerAttackRelease(note, "2n", noteTime);
      }
    });
  }

  stop() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }
}

export const audioEngine = new AudioEngine();
