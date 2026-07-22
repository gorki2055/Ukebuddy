import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, getUserCompletedLessons } from '../lib/streakLogic';
import { practiceCurriculum } from '../data/practiceLessons';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<{ lesson_id: string, best_bpm: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (user) {
        const [prof, lessons] = await Promise.all([
          getUserProfile(user.id),
          getUserCompletedLessons(user.id)
        ]);
        setProfile(prof);
        setCompletedLessons(lessons);
      }
      setIsLoading(false);
    }
    loadData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-4 text-center min-h-screen">
        <span className="material-symbols-outlined text-[64px] text-outline-variant mb-4">account_circle</span>
        <h2 className="text-headline-md font-headline-md mb-2 text-on-surface">Sign in to view your dashboard</h2>
        <p className="text-body-lg text-on-surface-variant mb-6">Track your practice time, streaks, and mastered lessons.</p>
        <Link to="/auth" className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-md text-label-md hover:bg-primary/90 transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  // Analytics
  const totalMinutes = profile?.total_practice_minutes || 0;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  const masteredCount = completedLessons.length;
  const totalLessons = practiceCurriculum.length;
  const progressPercentage = Math.round((masteredCount / totalLessons) * 100);

  // Group mastered lessons by category for better display
  const masteredLessonIds = new Set(completedLessons.map(l => l.lesson_id));
  const masteredDetails = practiceCurriculum
    .filter(lesson => masteredLessonIds.has(lesson.id))
    .map(lesson => {
      const dbEntry = completedLessons.find(l => l.lesson_id === lesson.id);
      return { ...lesson, best_bpm: dbEntry?.best_bpm || 0 };
    });

  const categories = ['Warm-up', 'Chord Switches', 'Strumming', 'Fingerpicking', 'Scales'];

  return (
    <div className="flex-grow w-full max-w-[800px] mx-auto px-margin-mobile md:px-0 py-lg pb-32">
      <header className="mb-8">
        <h1 className="text-headline-lg font-headline-lg text-on-surface mb-2">Your Dashboard</h1>
        <p className="text-body-lg text-on-surface-variant">Welcome back, {profile?.display_name || 'Musician'}!</p>
      </header>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Streak */}
        <div className="bg-surface-container rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm border border-outline-variant/50">
          <span className="material-symbols-outlined text-[32px] text-primary mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
          <span className="text-headline-md font-headline-md text-on-surface">{profile?.streak || 0}</span>
          <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">Day Streak</span>
        </div>

        {/* Practice Time */}
        <div className="bg-surface-container rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm border border-outline-variant/50">
          <span className="material-symbols-outlined text-[32px] text-secondary mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
          <span className="text-headline-md font-headline-md text-on-surface">
            {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
          </span>
          <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">Total Practice</span>
        </div>

        {/* Lessons Mastered */}
        <div className="bg-surface-container rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm border border-outline-variant/50 col-span-2">
          <div className="flex items-center gap-4 w-full">
            <div className="w-16 h-16 rounded-full border-4 border-surface-variant flex items-center justify-center relative flex-shrink-0">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="28" cy="28" r="26" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-outline-variant opacity-30" />
                <circle 
                  cx="28" cy="28" r="26" fill="transparent" stroke="currentColor" strokeWidth="4" 
                  className="text-[#386753]"
                  strokeDasharray="163" 
                  strokeDashoffset={163 - (163 * progressPercentage) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-title-medium font-bold text-on-surface">{progressPercentage}%</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-headline-sm font-headline-sm text-on-surface">{masteredCount} <span className="text-body-md text-on-surface-variant">/ {totalLessons}</span></span>
              <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">Drills Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Best BPMs List */}
      <h2 className="text-title-large font-title-large text-on-surface mb-4">Completed Drills</h2>
      
      {masteredCount === 0 ? (
        <div className="bg-surface-container-low rounded-2xl p-8 text-center border border-outline-variant border-dashed">
          <span className="material-symbols-outlined text-[48px] text-outline-variant mb-4">music_note</span>
          <p className="text-body-lg text-on-surface-variant mb-4">You haven't completed any drills yet!</p>
          <Link to="/practice" className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label-md text-label-md hover:scale-105 transition-transform shadow-sm">
            Start Practicing
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {categories.map(category => {
            const categoryLessons = masteredDetails.filter(l => l.category === category);
            if (categoryLessons.length === 0) return null;

            return (
              <div key={category} className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
                <div className="bg-surface-container-low px-4 py-3 border-b border-outline-variant/30">
                  <h3 className="text-title-medium font-title-medium text-on-surface">{category}</h3>
                </div>
                <div className="divide-y divide-outline-variant/30">
                  {categoryLessons.map(lesson => (
                    <div key={lesson.id} className="flex justify-between items-center p-4">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#386753]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        <span className="text-body-lg font-bold text-on-surface">{lesson.title}</span>
                      </div>
                      
                      {lesson.best_bpm > 0 ? (
                        <div className="flex flex-col items-end">
                          <span className="text-title-medium font-bold text-primary">{lesson.best_bpm}</span>
                          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">Best BPM</span>
                        </div>
                      ) : (
                        <span className="text-label-md text-on-surface-variant">Completed</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
