
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import UserMenu from './UserMenu';

interface DesktopNavProps {
  user: User | null;
  scrollToSection: (id: string) => void;
  handleSignOut: () => Promise<void>;
}

const DesktopNav = ({ user, scrollToSection, handleSignOut }: DesktopNavProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <nav className="hidden md:flex items-center space-x-6">
      {user ? (
        <>
          <div className="flex items-center space-x-5">
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
          </div>
          
          <UserMenu onSignOut={handleSignOut} />
        </>
      ) : (
        <>
          <div className="flex items-center space-x-5">
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              How It Works
            </button>            
            <button 
              onClick={() => scrollToSection('features')}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Features
            </button>
            <Link to="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link to="/faq" className="text-sm font-medium transition-colors hover:text-primary">
              FAQ
            </Link>
            <Link to="/contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </div>
          
          <Button 
            onClick={() => scrollToSection('onboarding')}
            className="bg-primary hover:bg-primary/90"
          >
            Get Started
          </Button>
        </>
      )}
    </nav>
  );
};

export default DesktopNav;
