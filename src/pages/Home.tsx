import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="flex-grow max-w-[1200px] w-full mx-auto px-margin-mobile md:px-lg pt-lg md:pt-xl pb-xl">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-lg mb-xl relative">
        <div className="flex-1 text-center md:text-left z-10">
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface mb-sm">
            Your Ukulele Journey Starts Here
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant mb-md max-w-[448px] mx-auto md:mx-0">
            Learn chords, master strumming, and play your favorite songs with our interactive practice tools.
          </p>
          <Link to="/practice" className="inline-block bg-primary-container text-on-error font-label-md text-label-md py-3 px-6 rounded-full hover:bg-surface-tint transition-colors card-shadow">
            Get Started
          </Link>
        </div>
        <div className="flex-1 w-full max-w-[384px] md:max-w-[448px] relative animate-float">
          {/* Abstract decorative element mimicking an instrument */}
          <div className="w-full aspect-square rounded-[40px] bg-tertiary-fixed flex items-center justify-center relative overflow-hidden card-shadow">
            <div className="absolute w-3/4 h-3/4 bg-primary rounded-full opacity-20 blur-2xl top-0 left-0"></div>
            <div className="absolute w-1/2 h-1/2 bg-secondary rounded-full opacity-20 blur-2xl bottom-0 right-0"></div>
            <span className="material-symbols-outlined text-[120px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>music_note</span>
            {/* Fretboard abstraction */}
            <div className="absolute right-[10%] top-[20%] w-[20%] h-[60%] border-4 border-on-surface rounded-md flex flex-col justify-around bg-surface-container opacity-80">
              <div className="w-full h-1 bg-on-surface"></div>
              <div className="w-full h-1 bg-on-surface"></div>
              <div className="w-full h-1 bg-on-surface"></div>
              <div className="w-full h-1 bg-on-surface"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Core Tools (Bento Grid Style) */}
      <section className="mb-xl">
        <h2 className="text-headline-md font-headline-md text-on-surface mb-md">Quick Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {/* Tuner Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md card-shadow flex flex-col justify-between items-start h-full">
            <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-sm">
              <span className="material-symbols-outlined text-headline-md">tune</span>
            </div>
            <div className="mb-md w-full">
              <h3 className="text-body-lg font-bold text-on-surface mb-xs">Tune Your Uke</h3>
              <p className="text-body-md font-body-md text-on-surface-variant">Ensure you sound perfect before every session.</p>
            </div>
            <Link to="/tuner" className="w-full py-2 px-4 rounded-full border-2 border-sage text-sage font-label-md text-label-md hover:bg-secondary-fixed transition-colors text-center block">
              Open Tuner
            </Link>
          </div>
          {/* Chords Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md card-shadow flex flex-col justify-between items-start h-full">
            <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center mb-sm">
              <span className="material-symbols-outlined text-headline-md">grid_on</span>
            </div>
            <div className="mb-md w-full">
              <h3 className="text-body-lg font-bold text-on-surface mb-xs">Learn Chords</h3>
              <p className="text-body-md font-body-md text-on-surface-variant">Explore the interactive chord library.</p>
            </div>
            <Link to="/chords" className="w-full py-2 px-4 rounded-full border-2 border-sage text-sage font-label-md text-label-md hover:bg-secondary-fixed transition-colors text-center block">
              Browse Chords
            </Link>
          </div>
          {/* Practice Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md card-shadow flex flex-col justify-between items-start h-full">
            <div className="w-12 h-12 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center mb-sm">
              <span className="material-symbols-outlined text-headline-md">metro</span>
            </div>
            <div className="mb-md w-full">
              <h3 className="text-body-lg font-bold text-on-surface mb-xs">Practice Rhythms</h3>
              <p className="text-body-md font-body-md text-on-surface-variant">Master your strumming patterns with a beat.</p>
            </div>
            <Link to="/practice" className="w-full py-2 px-4 rounded-full border-2 border-sage text-sage font-label-md text-label-md hover:bg-secondary-fixed transition-colors text-center block">
              Start Practice
            </Link>
          </div>
        </div>
      </section>

      {/* Daily Challenge */}
      <section>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md md:p-lg card-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-fixed rounded-bl-[100px] opacity-30 -z-10 translate-x-1/4 -translate-y-1/4"></div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-md relative z-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-md font-label-md mb-sm">
                <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                Today's Challenge
              </div>
              <h3 className="text-headline-md font-headline-md text-on-surface mb-xs">C - G - Am - F</h3>
              <p className="text-body-md font-body-md text-on-surface-variant max-w-[512px] mb-sm md:mb-0">
                Practice switching between these chords for 2 minutes. Focus on clean transitions and maintaining a steady rhythm.
              </p>
            </div>
            <div className="w-full md:w-auto shrink-0 flex flex-col items-center md:items-end gap-sm">
              <div className="w-full md:w-48 h-3 bg-surface-variant rounded-full overflow-hidden">
                <div className="h-full bg-sage w-0 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <Link to="/practice" className="w-full md:w-auto bg-primary-container text-on-error font-label-md text-label-md py-3 px-8 rounded-full hover:bg-surface-tint transition-colors card-shadow flex items-center justify-center gap-2">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                Start Challenge
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
