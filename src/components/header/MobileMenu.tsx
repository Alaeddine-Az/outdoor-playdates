
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { 
  Calendar, User as UserIcon, LogOut, Users, Home, 
  HelpCircle, Mail, Info, Sparkles, Heart, MapPin, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

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
  
  // For staggered animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 }
  };

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

  // Create bubbles effect
  const [bubbles] = useState(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 30 + 10,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDuration: Math.random() * 10 + 10
    }))
  );

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
      className="fixed inset-y-0 right-0 z-50 w-[85%] max-w-sm pt-16 bg-gradient-to-br from-white to-blue-50 backdrop-blur-lg shadow-2xl md:hidden rounded-l-3xl border-l border-primary/10 overflow-hidden"
      data-mobile-menu
      aria-hidden={!isOpen}
    >
      {/* Background bubbles for playful look */}
      {bubbles.map(bubble => (
        <div 
          key={bubble.id}
          className="absolute rounded-full bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            animation: `float ${bubble.animationDuration}s infinite ease-in-out`,
          }}
        />
      ))}
      
      <div className="flex flex-col h-full px-5 py-6 space-y-5 overflow-y-auto relative z-10">
        {user ? (
          <>
            {/* Profile - Updated with more vibrant look */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-4 border-b border-primary/10 pb-5 mb-2"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white font-bold flex items-center justify-center shadow-md">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-foreground text-lg">{user.email}</span>
                <div className="text-sm text-muted-foreground flex items-center">
                  <Sparkles className="h-3.5 w-3.5 mr-1.5 text-yellow-500" />
                  Ready for adventures!
                </div>
              </div>
            </motion.div>

            {/* Links - Updated with vibrant icons and animations */}
            <motion.nav 
              className="flex flex-col space-y-2"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={item}>
                <Link 
                  to="/dashboard" 
                  onClick={closeMenu} 
                  className="menu-item group flex items-center gap-3 px-5 py-4 rounded-xl hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <Home className="w-5 h-5 text-primary group-hover:text-primary/80 transition-colors" />
                  </div>
                  <span className="font-medium">Dashboard</span>
                </Link>
              </motion.div>
              
              <motion.div variants={item}>
                <Link 
                  to="/playdates" 
                  onClick={closeMenu} 
                  className="menu-item group flex items-center gap-3 px-5 py-4 rounded-xl hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                    <Calendar className="w-5 h-5 text-play-orange group-hover:text-play-orange/80 transition-colors" />
                  </div>
                  <span className="font-medium">Playdates</span>
                </Link>
              </motion.div>
              
              <motion.div variants={item}>
                <Link 
                  to="/connections" 
                  onClick={closeMenu} 
                  className="menu-item group flex items-center gap-3 px-5 py-4 rounded-xl hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                    <Users className="w-5 h-5 text-play-purple group-hover:text-play-purple/80 transition-colors" />
                  </div>
                  <span className="font-medium">Connections</span>
                </Link>
              </motion.div>
              
              <motion.div variants={item}>
                <Link 
                  to="/parent-profile" 
                  onClick={closeMenu} 
                  className="menu-item group flex items-center gap-3 px-5 py-4 rounded-xl hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-50 transition-colors">
                    <UserIcon className="w-5 h-5 text-play-green group-hover:text-play-green/80 transition-colors" />
                  </div>
                  <span className="font-medium">Profile</span>
                </Link>
              </motion.div>
            </motion.nav>

            {/* Sign out - Updated with better styling */}
            <div className="mt-auto pt-5 border-t border-primary/10">
              <button
                onClick={async () => {
                  await handleSignOut();
                  closeMenu();
                }}
                className="w-full flex items-center gap-3 bg-white hover:bg-red-50 px-5 py-4 rounded-xl font-medium transition-all duration-200 shadow-sm text-red-500 hover:text-red-600"
              >
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <LogOut className="w-5 h-5" />
                </div>
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Visitor Links - Updated with vibrant icons and better styling */}
            <motion.nav 
              className="flex flex-col space-y-2 mt-2"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={item}>
                <button 
                  onClick={() => handleScrollOrNavigate('features')} 
                  className="menu-item group flex items-center gap-3 px-5 py-4 rounded-xl hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md w-full"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <Zap className="w-5 h-5 text-play-blue group-hover:text-play-blue/80 transition-colors" />
                  </div>
                  <span className="font-medium">Features</span>
                </button>
              </motion.div>
              
              <motion.div variants={item}>
                <button 
                  onClick={() => handleScrollOrNavigate('how-it-works')} 
                  className="menu-item group flex items-center gap-3 px-5 py-4 rounded-xl hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md w-full"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-50 transition-colors">
                    <HelpCircle className="w-5 h-5 text-play-green group-hover:text-play-green/80 transition-colors" />
                  </div>
                  <span className="font-medium">How It Works</span>
                </button>
              </motion.div>
              
              <motion.div variants={item}>
                <Link 
                  to="/about" 
                  onClick={closeMenu} 
                  className="menu-item group flex items-center gap-3 px-5 py-4 rounded-xl hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                    <Info className="w-5 h-5 text-play-purple group-hover:text-play-purple/80 transition-colors" />
                  </div>
                  <span className="font-medium">About</span>
                </Link>
              </motion.div>
              
              <motion.div variants={item}>
                <Link 
                  to="/faq" 
                  onClick={closeMenu} 
                  className="menu-item group flex items-center gap-3 px-5 py-4 rounded-xl hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                    <HelpCircle className="w-5 h-5 text-play-orange group-hover:text-play-orange/80 transition-colors" />
                  </div>
                  <span className="font-medium">FAQ</span>
                </Link>
              </motion.div>
              
              <motion.div variants={item}>
                <Link 
                  to="/contact" 
                  onClick={closeMenu} 
                  className="menu-item group flex items-center gap-3 px-5 py-4 rounded-xl hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <Mail className="w-5 h-5 text-play-blue group-hover:text-play-blue/80 transition-colors" />
                  </div>
                  <span className="font-medium">Contact</span>
                </Link>
              </motion.div>
            </motion.nav>

            {/* Auth Actions - Updated with better styling and animations */}
            <motion.div 
              className="pt-5 border-t border-primary/10 mt-6 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <Link to="/auth" onClick={closeMenu} className="block">
                <Button variant="outline" className="w-full rounded-xl h-12 shadow-sm hover:shadow-md border-2 border-primary/20 hover:border-primary/40">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Sign In
                </Button>
              </Link>
              
              <Button 
                onClick={handleGetStarted} 
                className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white transition-all duration-300 shadow-md hover:shadow-lg animate-pulse"
                style={{animationDuration: '3s'}}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Get an Invitation
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default MobileMenu;
