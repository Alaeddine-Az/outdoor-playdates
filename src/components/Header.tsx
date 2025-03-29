
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import HeaderLogo from './header/HeaderLogo';
import DesktopNav from './header/DesktopNav';
import MobileMenu from './header/MobileMenu';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuOpenRef = useRef(isMenuOpen);
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isMobile = useIsMobile();

  // Keep ref in sync with menu state
  useEffect(() => {
    menuOpenRef.current = isMenuOpen;
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Handle outside click to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        menuOpenRef.current &&
        !target.closest('[data-mobile-menu]') &&
        !target.closest('[data-menu-toggle]')
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

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
      <header className="sticky top-0 z-50 w-full backdrop-blur-sm border-b bg-white/95 border-muted">
        <div className="container flex h-16 sm:h-18 items-center justify-between">
          <HeaderLogo />
          <DesktopNav user={user} scrollToSection={scrollToSection} />
          <motion.button
            className="block md:hidden p-3 rounded-full bg-muted/30 hover:bg-muted/60 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            data-menu-toggle
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence initial={false} mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5 text-primary" data-menu-toggle />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5" data-menu-toggle />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
              aria-hidden="true"
              onClick={() => setIsMenuOpen(false)}
            />
            <MobileMenu
              isOpen={isMenuOpen}
              user={user}
              scrollToSection={scrollToSection}
              handleSignOut={handleSignOut}
              closeMenu={() => setIsMenuOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
