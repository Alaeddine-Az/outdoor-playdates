
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import UserMenu from './UserMenu';
import { motion } from 'framer-motion';

interface DesktopNavProps {
  user: User | null;
  scrollToSection: (id: string) => void;
}

const DesktopNav = ({
  user,
  scrollToSection
}: DesktopNavProps) => {
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
    <div className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="hidden md:flex items-center justify-between h-16 max-w-screen-xl mx-auto px-4">
        {user ? (
          <>
            <div className="flex items-center space-x-1">
              {['Dashboard', 'Playdates', 'Connections'].map((item, i) => (
                <motion.div key={i} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Link 
                    to={`/${item.toLowerCase()}`} 
                    className="relative px-4 py-2 text-base font-medium transition-colors hover:text-primary rounded-full group"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-play-orange scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full"></span>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <UserMenu />
          </>
        ) : (
          <>
            <div className="flex items-center space-x-1">
              {isHomePage && (
                <>
                  {['how-it-works', 'features'].map((section, i) => (
                    <motion.button 
                      key={i}
                      onClick={() => scrollToSection(section)}
                      className="relative px-4 py-2 text-base font-medium transition-colors hover:text-primary rounded-full group"
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                    >
                      {section.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-play-orange scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full"></span>
                    </motion.button>
                  ))}
                </>
              )}
              
              {['about', 'faq', 'contact'].map((page, i) => (
                <motion.div key={i} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Link 
                    to={`/${page}`} 
                    className="relative px-4 py-2 text-base font-medium transition-colors hover:text-primary rounded-full group"
                  >
                    {page.charAt(0).toUpperCase() + page.slice(1)}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-play-orange scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full"></span>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <div className="flex items-center space-x-3">
              <Link to="/auth">
                <Button variant="outline" className="rounded-full border-2 border-play-orange/30 text-play-orange hover:bg-play-orange/5 hover:border-play-orange">Sign In</Button>
              </Link>
              <Button onClick={handleGetStarted} className="bg-play-orange hover:bg-play-orange/90 rounded-full shadow-md">Get an Invitation</Button>
            </div>
          </>
        )}
      </nav>
    </div>
  );
};

export default DesktopNav;
