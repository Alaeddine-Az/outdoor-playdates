
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
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isMobile = useIsMobile();

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

  useEffect(() => {
    // Close menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
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

  return (
  <>
    <header className="sticky top-0 z-40 w-full backdrop-blur-sm border-b bg-white/90 border-muted">
      <div className="container flex h-14 sm:h-16 items-center justify-between">
        <HeaderLogo />
        <DesktopNav ... />
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

    {/* ✅ Must be here (outside header!) */}
    <MobileMenu
      isOpen={isMenuOpen}
      user={user}
      scrollToSection={scrollToSection}
      handleSignOut={handleSignOut}
    />
  </>
);
  
export default Header;
