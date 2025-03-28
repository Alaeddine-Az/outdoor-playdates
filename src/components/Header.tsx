import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import HeaderLogo from './header/HeaderLogo';
import DesktopNav from './header/DesktopNav';
import MobileMenu from './header/MobileMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isMobile = useIsMobile();

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [isMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isMenuOpen &&
        !target.closest('[data-mobile-menu]') &&
        !target.closest('[data-menu-toggle]')
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleSignOut = async () => {
    try {
      await signOut();
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

  if (loading) return null;

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-sm border-b bg-white/90 border-muted">
        <div className="container flex h-14 sm:h-16 items-center justify-between">
          <HeaderLogo />
          <DesktopNav user={user} scrollToSection={scrollToSection} />
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

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            aria-hidden="true"
            onClick={() => setIsMenuOpen(false)}
          />
          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                aria-hidden="true"
                onClick={() => setIsMenuOpen(false)}
              />
              <MobileMenu
                isOpen={isMenuOpen}
                user={user}
                scrollToSection={scrollToSection}
                handleSignOut={handleSignOut}
                closeMenu={() => setIsMenuOpen(false)} // optional, for in-menu closing
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default Header;
