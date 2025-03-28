
import { Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  LogOut,
} from 'lucide-react';
import { SidebarLink } from '@/components/SidebarLink';
import { useAuth } from '@/contexts/AuthContext';

export interface AppLayoutProps {
  children?: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sidebar sign out failed:', err);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block w-64">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center px-4 text-lg font-semibold">
            GoPlayNow
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <SidebarLink to="/dashboard" label="Dashboard" icon={LayoutDashboard} />
              <SidebarLink to="/playdates" label="My Playdates" icon={CalendarCheck} />
              <SidebarLink to="/community" label="Community" icon={Users} />
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {children || <Outlet />}
      </div>
    </div>
  );
}
