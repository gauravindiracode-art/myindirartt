import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

export default function AppLayout() {
  return (
    <div className="flex flex-col h-full w-full max-w-lg mx-auto bg-white sm:shadow-xl sm:my-0 sm:rounded-none">
      <Header />
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
