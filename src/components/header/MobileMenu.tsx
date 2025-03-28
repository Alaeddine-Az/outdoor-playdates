
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Calendar, User as UserIcon, LogOut, Users, Home, HelpCircle, Mail, Info } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  user: User | null;
  scrollToSection: (id: string) => void;
  handleSignOut: () => Promise<void>;
  closeMenu: () => void;
}

const MobileMenu = ({ isOpen, user, scrollToSection, handleSignOut, closeMenu }: MobileMenuProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleScrollOrNavigate = (id: string) => {
    closeMenu();
    if (isHomePage) {
      scrollToSection(id);
    } else {
      window.location.href = `/#${id}`;
    }
  };

  const handleGetStarted = () => {
    closeMenu();
    if (isHomePage) {
      scrollToSection('onboarding');
    } else {
      window.location.href = '/#onboarding';
    }
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-[85%] max-w-sm pt-16 bg-gradient-to-br from-white to-muted/30 backdrop-blur-lg shadow-2xl transition-all duration-300 ease-out transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } md:hidden rounded-l-2xl border-l border-primary/10`}
      data-mobile-menu
      aria-hidden={!isOpen}
    >
      <div className="flex flex-col h-full px-5 py-6 space-y-5 overflow-y-auto">
        {user ? (
          <>
            {/* Profile */}
            <div className="flex items-center gap-4 border-b border-primary/10 pb-5 mb-2">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shadow-md">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-foreground text-lg">{user.email}</span>
                <span className="text-sm text-muted-foreground">Logged in</span>
              </div>
            </div>

            {/* Links */}
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/dashboard" 
                onClick={closeMenu} 
                className="menu-item group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 transition-all duration-200"
              >
                <Home className="w-5 h-5 text-primary group-hover:text-primary/80 transition-colors" /> 
                <span className="font-medium">Dashboard</span>
              </Link>
              
              <Link 
                to="/playdates" 
                onClick={closeMenu} 
                className="menu-item group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 transition-all duration-200"
              >
                <Calendar className="w-5 h-5 text-play-orange group-hover:text-play-orange/80 transition-colors" /> 
                <span className="font-medium">Playdates</span>
              </Link>
              
              <Link 
                to="/connections" 
                onClick={closeMenu} 
                className="menu-item group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 transition-all duration-200"
              >
                <Users className="w-5 h-5 text-play-purple group-hover:text-play-purple/80 transition-colors" /> 
                <span className="font-medium">Connections</span>
              </Link>
              
              <Link 
                to="/parent-profile" 
                onClick={closeMenu} 
                className="menu-item group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 transition-all duration-200"
              >
                <UserIcon className="w-5 h-5 text-play-green group-hover:text-play-green/80 transition-colors" /> 
                <span className="font-medium">Profile</span>
              </Link>
            </nav>

            {/* Sign out */}
            <div className="mt-auto pt-5 border-t border-primary/10">
              <button
                onClick={async () => {
                  await handleSignOut();
                  closeMenu();
                }}
                className="w-full flex items-center gap-3 text-destructive hover:bg-destructive/10 px-4 py-3 rounded-xl font-medium transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Visitor Links */}
            <nav className="flex flex-col space-y-3 mt-2">
              <button 
                onClick={() => handleScrollOrNavigate('features')} 
                className="menu-item group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 transition-all duration-200"
              >
                <Info className="w-5 h-5 text-play-blue group-hover:text-play-blue/80 transition-colors" />
                <span className="font-medium">Features</span>
              </button>
              
              <button 
                onClick={() => handleScrollOrNavigate('how-it-works')} 
                className="menu-item group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 transition-all duration-200"
              >
                <HelpCircle className="w-5 h-5 text-play-green group-hover:text-play-green/80 transition-colors" />
                <span className="font-medium">How It Works</span>
              </button>
              
              <Link 
                to="/about" 
                onClick={closeMenu} 
                className="menu-item group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 transition-all duration-200"
              >
                <Info className="w-5 h-5 text-play-purple group-hover:text-play-purple/80 transition-colors" />
                <span className="font-medium">About</span>
              </Link>
              
              <Link 
                to="/faq" 
                onClick={closeMenu} 
                className="menu-item group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 transition-all duration-200"
              >
                <HelpCircle className="w-5 h-5 text-play-orange group-hover:text-play-orange/80 transition-colors" />
                <span className="font-medium">FAQ</span>
              </Link>
              
              <Link 
                to="/contact" 
                onClick={closeMenu} 
                className="menu-item group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 transition-all duration-200"
              >
                <Mail className="w-5 h-5 text-play-blue group-hover:text-play-blue/80 transition-colors" />
                <span className="font-medium">Contact</span>
              </Link>
            </nav>

            {/* Auth Actions */}
            <div className="pt-5 border-t border-primary/10 mt-6 space-y-3">
              <Link to="/auth" onClick={closeMenu} className="block">
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Button 
                onClick={handleGetStarted} 
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white transition-all duration-300 animate-pulse"
              >
                Get Started
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
