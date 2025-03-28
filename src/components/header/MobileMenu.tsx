import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Calendar, User as UserIcon, LogOut, Users } from 'lucide-react';

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
      className={`fixed inset-y-0 right-0 z-50 w-[80%] max-w-sm pt-16 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } md:hidden`}
      data-mobile-menu
      aria-hidden={!isOpen}
    >
      <div className="container py-4 h-full overflow-y-auto">
        <div className="flex flex-col h-full pb-safe">
          {user ? (
            <>
              {/* User Info */}
              <div className="flex items-center space-x-3 p-4 mb-2 border-b">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-xs text-muted-foreground">Member</p>
                </div>
              </div>

              {/* Links */}
              <Link to="/dashboard" className="menu-link" onClick={closeMenu}>
                Dashboard
              </Link>
              <Link to="/playdates" className="menu-link" onClick={closeMenu}>
                <Calendar className="w-5 h-5 mr-3" />
                Playdates
              </Link>
              <Link to="/connections" className="menu-link" onClick={closeMenu}>
                <Users className="w-5 h-5 mr-3" />
                Connections
              </Link>
              <Link to="/parent-profile" className="menu-link" onClick={closeMenu}>
                <UserIcon className="w-5 h-5 mr-3" />
                Profile
              </Link>

              {/* Sign Out */}
              <div className="mt-auto border-t pt-2">
                <button
                  onClick={async () => {
                    await handleSignOut();
                    closeMenu();
                  }}
                  className="flex items-center w-full px-4 py-3 text-base font-medium rounded-md text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Visitor Links */}
              <button onClick={() => handleScrollOrNavigate('features')} className="menu-link">
                Features
              </button>
              <button onClick={() => handleScrollOrNavigate('how-it-works')} className="menu-link">
                How It Works
              </button>
              <Link to="/about" className="menu-link" onClick={closeMenu}>
                About
              </Link>
              <Link to="/faq" className="menu-link" onClick={closeMenu}>
                FAQ
              </Link>
              <Link to="/contact" className="menu-link" onClick={closeMenu}>
                Contact
              </Link>

              {/* Auth Buttons */}
              <div className="px-4 mt-4 space-y-3">
                <Link to="/auth" onClick={closeMenu}>
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Button onClick={handleGetStarted} className="w-full bg-primary hover:bg-primary/90 py-6 text-base">
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
