import { Outlet, useLocation } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

export default function Layout() {
  const location = useLocation();
  // Practice room has its own custom header, so we might want to hide TopBar there, 
  // but for now we'll stick to the standard design or hide it based on route if needed.
  const isPracticeRoom = location.pathname === '/practice';

  return (
    <div className="text-on-surface pb-[80px] md:pb-0 md:pt-[64px] min-h-screen flex flex-col font-body-md bg-background">
      {!isPracticeRoom && <TopBar />}
      <div className="flex-grow flex flex-col relative w-full">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
