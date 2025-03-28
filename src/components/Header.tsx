
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import HeaderLogo from './header/HeaderLogo';
import DesktopNav from './header/DesktopNav';
import MobileMenu from './header/MobileMenu';

const Header = () => {
  // Call all hooks at the top level, before any conditional logic
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isMobile = useIsMobile();

  // Effect for closing menu on route changes
  useEffect(() => {
    // Close menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Effect for handling body overflow when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Effect for handling outside clicks to close the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Only close if clicking outside menu and not on the toggle button
      if (isMenuOpen && 
          !target.closest('[data-mobile-menu]') && 
          !target.closest('[data-menu-toggle]')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigation is now handled inside signOut function
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const scrollToSection = (id: string) => {
    if (isHomePage) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${id}`);
    }
    setIsMenuOpen(false);
  };

  // Only return null after all hooks have been called
  if (loading) {
    return null;
  }

  return (
    <>
      <header className="w-full backdrop-blur-sm border-b bg-white/90 border-muted">
        <div className="container flex h-14 sm:h-16 items-center justify-between">
          <HeaderLogo />
          <DesktopNav 
            user={user} 
            scrollToSection={scrollToSection} 
          />
          <button
            className="block md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            data-menu-toggle
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay - rendered conditionally with z-index */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          aria-hidden="true"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile menu container */}
      <MobileMenu
        isOpen={isMenuOpen}
        user={user}
        scrollToSection={scrollToSection}
        handleSignOut={handleSignOut}
      />
    </>
  );
};
  
export default Header;
