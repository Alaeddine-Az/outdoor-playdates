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
  const { signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sidebar sign out failed:', err);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-full w-64 border-r bg-muted/40">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-14 items-center px-4 text-lg font-semibold">
            GoPlayNow
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <SidebarLink to="/dashboard" label="Dashboard" icon={LayoutDashboard} />
              <SidebarLink to="/playdates" label="My Playdates" icon={CalendarCheck} />
              <SidebarLink to="/connections" label="Connections" icon={Users} />

              {isAdmin && (
                <>
                  <SidebarLink to="/admin/users" label="Admin Users" icon={Users} />
                  <SidebarLink to="/admin/signups" label="Signups" icon={Users} />
                  <SidebarLink to="/admin/logs" label="Logs" icon={LayoutDashboard} />
                </>
              )}

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
      <div className="ml-0 md:ml-64 flex-1 flex flex-col overflow-y-auto px-6 pt-6">
        {children || <Outlet />}
      </div>
    </div>
  );
}
