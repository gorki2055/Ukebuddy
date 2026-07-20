import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function TopBar() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const getLinkClass = (path: string) => {
    return location.pathname === path
      ? "text-primary flex flex-col items-center justify-center hover:opacity-80 transition-opacity translate-y-0.5 transition-transform duration-150"
      : "text-on-surface-variant flex flex-col items-center justify-center hover:opacity-80 transition-opacity";
  };

  return (
    <header className="hidden md:flex bg-surface flex justify-between items-center w-full px-margin-mobile h-16 fixed top-0 z-50 shadow-sm border-b border-outline-variant/30">
      <Link to="/" className="flex items-center gap-sm hover:opacity-80 transition-opacity">
        <span className="material-symbols-outlined text-headline-md" style={{ fontVariationSettings: "'FILL' 1" }}>music_note</span>
        <span className="text-headline-md font-headline-md font-extrabold text-primary">UkeBuddy</span>
      </Link>
      <nav className="flex gap-md mr-4">
        <Link to="/" className={getLinkClass('/')}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/' ? "'FILL' 1" : "'FILL' 0" }}>home</span>
          <span className="text-label-md font-label-md mt-1">Home</span>
        </Link>
        <Link to="/tuner" className={getLinkClass('/tuner')}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/tuner' ? "'FILL' 1" : "'FILL' 0" }}>tune</span>
          <span className="text-label-md font-label-md mt-1">Tuner</span>
        </Link>
        <Link to="/chords" className={getLinkClass('/chords')}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/chords' ? "'FILL' 1" : "'FILL' 0" }}>library_music</span>
          <span className="text-label-md font-label-md mt-1">Chords</span>
        </Link>
        <Link to="/practice" className={getLinkClass('/practice')}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/practice' ? "'FILL' 1" : "'FILL' 0" }}>metro</span>
          <span className="text-label-md font-label-md mt-1">Practice</span>
        </Link>
        
        {/* Auth Link */}
        {user ? (
          <button onClick={() => signOut()} className="text-on-surface-variant flex flex-col items-center justify-center hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-label-md font-label-md mt-1">Sign Out</span>
          </button>
        ) : (
          <Link to="/auth" className={getLinkClass('/auth')}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/auth' ? "'FILL' 1" : "'FILL' 0" }}>account_circle</span>
            <span className="text-label-md font-label-md mt-1">Sign In</span>
          </Link>
        )}
      </nav>
    </header>
  );
}
