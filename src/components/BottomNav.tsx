import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function BottomNav() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const getLinkClass = (path: string) => {
    return location.pathname === path
      ? "flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 transition-transform scale-95 duration-200"
      : "flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:bg-surface-variant rounded-full transition-colors";
  };

  return (
    <nav className="md:hidden bg-surface text-primary rounded-t-xl shadow-[0_-4px_20px_0_rgba(0,0,0,0.08)] shadow-lg fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3">
      <Link to="/" className={getLinkClass('/')}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/' ? "'FILL' 1" : "'FILL' 0" }}>home</span>
        <span className="text-[12px] font-label-md mt-1">Home</span>
      </Link>
      <Link to="/tuner" className={getLinkClass('/tuner')}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/tuner' ? "'FILL' 1" : "'FILL' 0" }}>tune</span>
        <span className="text-[12px] font-label-md mt-1">Tuner</span>
      </Link>
      <Link to="/chords" className={getLinkClass('/chords')}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/chords' ? "'FILL' 1" : "'FILL' 0" }}>library_music</span>
        <span className="text-[12px] font-label-md mt-1">Chords</span>
      </Link>
      <Link to="/practice" className={getLinkClass('/practice')}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/practice' ? "'FILL' 1" : "'FILL' 0" }}>metro</span>
        <span className="text-[12px] font-label-md mt-1">Practice</span>
      </Link>
      <Link to="/dashboard" className={getLinkClass('/dashboard')}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/dashboard' ? "'FILL' 1" : "'FILL' 0" }}>insert_chart</span>
        <span className="text-[12px] font-label-md mt-1">Dashboard</span>
      </Link>
      {/* Auth Link */}
      {user ? (
        <button onClick={() => signOut()} className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:bg-surface-variant rounded-full transition-colors">
          <span className="material-symbols-outlined">logout</span>
          <span className="text-[12px] font-label-md mt-1">Sign Out</span>
        </button>
      ) : (
        <Link to="/auth" className={getLinkClass('/auth')}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/auth' ? "'FILL' 1" : "'FILL' 0" }}>account_circle</span>
          <span className="text-[12px] font-label-md mt-1">Sign In</span>
        </Link>
      )}
    </nav>
  );
}
