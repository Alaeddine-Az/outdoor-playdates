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
      className={`fixed inset-y-0 right-0 z-50 w-[80%] max-w-sm pt-16 bg-white shadow-2xl transition-transform duration-300 ease-in-out transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } md:hidden`}
      data-mobile-menu
      aria-hidden={!isOpen}
    >
      <div className="flex flex-col h-full px-4 py-6 space-y-4 overflow-y-auto">
        {user ? (
          <>
            {/* Profile */}
            <div className="flex items-center gap-3 border-b pb-4 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{user.email}</span>
                <span className="text-sm text-muted-foreground">Logged in</span>
              </div>
            </div>

            {/* Links */}
            <nav className="flex flex-col space-y-2">
              <Link to="/dashboard" onClick={closeMenu} className="menu-link">Dashboard</Link>
              <Link to="/playdates" onClick={closeMenu} className="menu-link flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Playdates
              </Link>
              <Link to="/connections" onClick={closeMenu} className="menu-link flex items-center gap-2">
                <Users className="w-4 h-4" /> Connections
              </Link>
              <Link to="/parent-profile" onClick={closeMenu} className="menu-link flex items-center gap-2">
                <UserIcon className="w-4 h-4" /> Profile
              </Link>
            </nav>

            {/* Sign out */}
            <div className="mt-auto border-t pt-4">
              <button
                onClick={async () => {
                  await handleSignOut();
                  closeMenu();
                }}
                className="w-full flex items-center gap-2 text-destructive hover:bg-destructive/10 px-4 py-3 rounded-md font-medium transition"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Visitor Links */}
            <nav className="flex flex-col space-y-2 text-base">
              <button onClick={() => handleScrollOrNavigate('features')} className="menu-link">Features</button>
              <button onClick={() => handleScrollOrNavigate('how-it-works')} className="menu-link">How It Works</button>
              <Link to="/about" onClick={closeMenu} className="menu-link">About</Link>
              <Link to="/faq" onClick={closeMenu} className="menu-link">FAQ</Link>
              <Link to="/contact" onClick={closeMenu} className="menu-link">Contact</Link>
            </nav>

            {/* Auth Actions */}
            <div className="pt-4 border-t mt-6 space-y-3">
              <Link to="/auth" onClick={closeMenu}>
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Button onClick={handleGetStarted} className="w-full bg-primary hover:bg-primary/90 text-white">
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
