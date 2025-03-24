
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, User as UserIcon, LogOut, Users } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  user: User | null;
  scrollToSection: (id: string) => void;
  handleSignOut: () => Promise<void>;
}

const MobileMenu = ({ isOpen, user, scrollToSection, handleSignOut }: MobileMenuProps) => {
  // Return null when closed to fix the issue
  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50 pt-14 bg-white/95 backdrop-blur-sm" data-mobile-menu>
      <div className="container py-4 h-full overflow-y-auto">
        <div className="flex flex-col h-full pb-safe">
          {user ? (
            <>
              <div className="flex items-center space-x-3 p-4 mb-2 border-b">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-xs text-muted-foreground">Member</p>
                </div>
              </div>
              <Link 
                to="/dashboard" 
                className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted"
              >
                <span className="mr-3">Dashboard</span>
              </Link>
              <Link 
                to="/playdates" 
                className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted"
              >
                <Calendar className="w-5 h-5 mr-3" />
                <span>Playdates</span>
              </Link>
              <Link 
                to="/challenges" 
                className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted"
              >
                <Trophy className="w-5 h-5 mr-3" />
                <span>Challenges</span>
              </Link>
              <Link 
                to="/connections" 
                className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted"
              >
                <Users className="w-5 h-5 mr-3" />
                <span>Connections</span>
              </Link>
              <Link 
                to="/parent-profile" 
                className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted"
              >
                <UserIcon className="w-5 h-5 mr-3" />
                <span>Profile</span>
              </Link>
              <Link 
                to="/achievements" 
                className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted"
              >
                <Trophy className="w-5 h-5 mr-3" />
                <span>Achievements</span>
              </Link>
              
              <div className="mt-auto border-t pt-2">
                <button
                  className="flex items-center w-full px-4 py-3 text-base font-medium rounded-md text-red-500 hover:bg-red-50"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => scrollToSection('features')}
                className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted"
              >
                <span>Features</span>
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted"
              >
                <span>How It Works</span>
              </button>
              <Link to="/about" className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted">
                <span>About</span>
              </Link>
              <Link to="/faq" className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted">
                <span>FAQ</span>
              </Link>
              <Link to="/contact" className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted">
                <span>Contact</span>
              </Link>
              
              <div className="px-4 mt-4">
                <Button 
                  onClick={() => scrollToSection('onboarding')}
                  className="w-full bg-primary hover:bg-primary/90 py-6 text-base"
                >
                  Get Started
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
