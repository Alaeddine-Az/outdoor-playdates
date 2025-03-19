
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-8 transition-all duration-300 ease-in-out",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-soft" : "bg-transparent"
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">GP</span>
            </div>
            <span className={cn(
              "font-bold text-xl",
              isScrolled ? "text-foreground" : "text-foreground" 
            )}>
              GoPlayNow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="#features" isScrolled={isScrolled}>Features</NavLink>
            <NavLink href="#how-it-works" isScrolled={isScrolled}>How It Works</NavLink>
            <NavLink href="#testimonials" isScrolled={isScrolled}>Testimonials</NavLink>
            <NavLink href="#faq" isScrolled={isScrolled}>FAQ</NavLink>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="outline"
              className={cn(
                "transition-all",
                isScrolled ? "border-primary text-primary hover:bg-primary/10" : "border-white text-white hover:bg-white/10"
              )}
              onClick={() => document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Log In
            </Button>
            <Button
              className="button-glow bg-primary hover:bg-primary/90 text-white"
              onClick={() => document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden absolute left-0 right-0 top-full bg-white shadow-soft transition-all duration-300 ease-in-out overflow-hidden",
        isMenuOpen ? "max-h-screen py-4" : "max-h-0"
      )}>
        <div className="container mx-auto px-6 space-y-4">
          <MobileNavLink href="#features" onClick={() => setIsMenuOpen(false)}>Features</MobileNavLink>
          <MobileNavLink href="#how-it-works" onClick={() => setIsMenuOpen(false)}>How It Works</MobileNavLink>
          <MobileNavLink href="#testimonials" onClick={() => setIsMenuOpen(false)}>Testimonials</MobileNavLink>
          <MobileNavLink href="#faq" onClick={() => setIsMenuOpen(false)}>FAQ</MobileNavLink>
          
          <div className="flex flex-col space-y-3 pt-3">
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsMenuOpen(false);
                document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Log In
            </Button>
            <Button
              className="w-full button-glow"
              onClick={() => {
                setIsMenuOpen(false);
                document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isScrolled: boolean;
}

const NavLink = ({ href, children, isScrolled }: NavLinkProps) => (
  <a 
    href={href}
    className={cn(
      "relative font-medium transition-colors hover:text-primary",
      isScrolled ? "text-foreground" : "text-foreground",
      "after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
    )}
  >
    {children}
  </a>
);

interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}

const MobileNavLink = ({ href, children, onClick }: MobileNavLinkProps) => (
  <a 
    href={href}
    className="block py-2 text-foreground font-medium hover:text-primary transition-colors"
    onClick={onClick}
  >
    {children}
  </a>
);

export default Header;
