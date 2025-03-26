
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
  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-[80%] max-w-sm pt-16 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } md:hidden`}
      data-mobile-menu
      aria-hidden={!isOpen}
    >
      <div className="container py-4 h-full overflow-y-auto">
        <div className="flex flex-col h-full pb-safe">
          {user ? (
            // User menu items
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
                className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted transition-colors"
              >
                <span className="mr-3">Dashboard</span>
              </Link>
              <Link 
                to="/playdates" 
                className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted transition-colors"
              >
                <Calendar className="w-5 h-5 mr-3" />
                <span>Playdates</span>
              </Link>
              <Link 
                to="/challenges" 
                className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted transition-colors"
              >
                <Trophy className="w-5 h-5 mr-3" />
                <span>Challenges</span>
              </Link>
              <Link 
                to="/connections" 
                className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted transition-colors"
              >
                <Users className="w-5 h-5 mr-3" />
                <span>Connections</span>
              </Link>
              <Link 
                to="/parent-profile" 
                className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted transition-colors"
              >
                <UserIcon className="w-5 h-5 mr-3" />
                <span>Profile</span>
              </Link>
              <Link 
                to="/achievements" 
                className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted transition-colors"
              >
                <Trophy className="w-5 h-5 mr-3" />
                <span>Achievements</span>
              </Link>
              
              <div className="mt-auto border-t pt-2">
                <button
                  className="flex items-center w-full px-4 py-3 text-base font-medium rounded-md text-red-500 hover:bg-red-50 transition-colors"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            // Non-authenticated menu items
            <>
              <button
                onClick={() => scrollToSection('features')}
                className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted transition-colors"
              >
                <span>Features</span>
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted transition-colors"
              >
                <span>How It Works</span>
              </button>
              <Link to="/about" className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted transition-colors">
                <span>About</span>
              </Link>
              <Link to="/faq" className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted transition-colors">
                <span>FAQ</span>
              </Link>
              <Link to="/contact" className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted transition-colors">
                <span>Contact</span>
              </Link>
              
              <div className="px-4 mt-4 space-y-3">
                <Link to="/auth" className="w-full">
                  <Button variant="outline" className="w-full transition-colors">Sign In</Button>
                </Link>
                <Button 
                  onClick={() => scrollToSection('onboarding')}
                  className="w-full bg-primary hover:bg-primary/90 py-6 text-base transition-colors"
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
