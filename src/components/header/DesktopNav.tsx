
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import UserMenu from './UserMenu';

interface DesktopNavProps {
  user: User | null;
  scrollToSection: (id: string) => void;
  handleSignOut: () => Promise<void>;
}

const DesktopNav = ({ user, scrollToSection, handleSignOut }: DesktopNavProps) => {
  return (
    <nav className="hidden md:flex items-center gap-4 lg:gap-6">
      {user ? (
        <>
          <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
            Dashboard
          </Link>
          <Link to="/playdates" className="text-sm font-medium transition-colors hover:text-primary">
            Playdates
          </Link>
          <Link to="/challenges" className="text-sm font-medium transition-colors hover:text-primary">
            Challenges
          </Link>
          <Link to="/connections" className="text-sm font-medium transition-colors hover:text-primary">
            Connections
          </Link>
          <UserMenu onSignOut={handleSignOut} />
        </>
      ) : (
        <>
          <button 
            onClick={() => scrollToSection('features')}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            How It Works
          </button>
          <button 
            onClick={() => scrollToSection('testimonials')}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Testimonials
          </button>
          <Link to="/auth">
            <Button variant="default" className="bg-primary hover:bg-primary/90">
              Sign In
            </Button>
          </Link>
        </>
      )}
    </nav>
  );
};

export default DesktopNav;
