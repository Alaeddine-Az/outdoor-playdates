import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileBarChart2,
  LogOut,
  UserPlus,
  Calendar
} from 'lucide-react';
import { SidebarLink } from '@/components/SidebarLink';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Admin sidebar sign out failed:', err);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden border-r bg-muted/40 md:block w-64">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4">
            <h2 className="text-lg font-semibold text-primary">Admin Portal</h2>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <SidebarLink to="/admin" label="Dashboard" icon={LayoutDashboard} />
              <SidebarLink to="/admin/users" label="Manage Users" icon={Users} />
              <SidebarLink to="/admin/events" label="Manage Events" icon={Calendar} />
              <SidebarLink to="/admin/signups" label="Early Signups" icon={ClipboardList} />
              <SidebarLink to="/admin/logs" label="System Logs" icon={FileBarChart2} />
              <SidebarLink to="/admin/create-admin" label="Create Admin" icon={UserPlus} />
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 mt-4"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 pt-6">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
