
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  Trophy, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-muted transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-muted flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">GP</span>
              </div>
              <span className="font-bold text-lg">GoPlayNow</span>
            </Link>
            <button
              className="lg:hidden"
              onClick={toggleSidebar}
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
          
          <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            <SidebarLink 
              to="/dashboard" 
              icon={<Home className="h-5 w-5" />} 
              label="Dashboard" 
              active={location.pathname === '/dashboard'} 
            />
            <SidebarLink 
              to="/playdates" 
              icon={<Calendar className="h-5 w-5" />} 
              label="Playdates" 
              active={location.pathname.includes('/playdates')} 
            />
            <SidebarLink 
              to="/connections" 
              icon={<Users className="h-5 w-5" />} 
              label="Connections" 
              active={location.pathname.includes('/connections')} 
            />
            <SidebarLink 
              to="/challenges" 
              icon={<Trophy className="h-5 w-5" />} 
              label="Challenges" 
              active={location.pathname.includes('/challenges')} 
            />
            <SidebarLink 
              to="/notifications" 
              icon={<Bell className="h-5 w-5" />} 
              label="Notifications" 
              active={location.pathname.includes('/notifications')} 
              badge="3"
            />
            
            <div className="pt-6 mt-6 border-t border-muted">
              <SidebarLink 
                to="/settings" 
                icon={<Settings className="h-5 w-5" />} 
                label="Settings" 
                active={location.pathname.includes('/settings')} 
              />
              <SidebarLink 
                to="/" 
                icon={<LogOut className="h-5 w-5" />} 
                label="Log Out" 
                active={false} 
              />
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navigation */}
        <header className="h-16 bg-white border-b border-muted flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center">
            <button
              className="mr-4 lg:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6 text-muted-foreground" />
            </button>
            
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input 
                type="search"
                placeholder="Search..."
                className="pl-9 pr-4 py-1.5 rounded-lg bg-muted/50 border border-transparent focus:border-input focus:bg-white focus:ring-1 focus:ring-primary/30 focus:outline-none w-64"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-secondary"></span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                JP
              </div>
              <span className="text-sm font-medium hidden md:inline-block">Jane P.</span>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  badge?: string;
}

const SidebarLink = ({ to, icon, label, active, badge }: SidebarLinkProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
      active 
        ? "bg-primary text-primary-foreground" 
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    )}
  >
    {icon}
    <span>{label}</span>
    {badge && (
      <span className={cn(
        "ml-auto rounded-full px-2 py-0.5 text-xs font-medium",
        active ? "bg-white/20 text-white" : "bg-secondary/10 text-secondary"
      )}>
        {badge}
      </span>
    )}
  </Link>
);

export default AppLayout;
