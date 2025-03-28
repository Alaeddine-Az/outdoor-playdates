
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import UserMenu from './UserMenu';

interface DesktopNavProps {
  user: User | null;
  scrollToSection: (id: string) => void;
}

const DesktopNav = ({ user, scrollToSection }: DesktopNavProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  const handleGetStarted = () => {
    if (isHomePage) {
      // If on home page, scroll to the section
      scrollToSection('onboarding');
    } else {
      // If not on home page, navigate to home page with the section hash
      window.location.href = '/#onboarding';
    }
  };
  
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
            <Link to="/connections" className="text-sm font-medium transition-colors hover:text-primary">
              Connections
            </Link>
          </div>
          
          <UserMenu />
        </>
      ) : (
        <>
          <div className="flex items-center space-x-5">
            {isHomePage && (
              <>
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
              </>
            )}
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
          
          <div className="flex items-center space-x-3">
            <Link to="/auth">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Button 
              onClick={handleGetStarted}
              className="bg-primary hover:bg-primary/90"
            >
              Get Started
            </Button>
          </div>
        </>
      )}
    </nav>
  );
};

export default DesktopNav;
