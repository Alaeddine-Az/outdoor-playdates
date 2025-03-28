
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

interface SidebarLinkProps {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({ 
  to, 
  label, 
  icon: Icon 
}) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  
  return (
    <Link 
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
};
