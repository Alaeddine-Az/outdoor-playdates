import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut, Calendar, Trophy, UserPlus, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

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
      if (isMenuOpen && !target.closest('[data-mobile-menu]')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
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
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${id}`);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-sm border-b bg-white/90 border-muted">
      <div className="container flex h-14 sm:h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="font-bold text-lg md:text-xl lg:text-2xl text-primary">GoPlayNow</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                Dashboard
              </Link>
              <Link to="/playdates" className="text-sm font-medium transition-colors hover:text-primary">
                Playdates
              </Link>
              <Link to="/challenges" className="text-sm font-medium transition-colors hover:text-primary">
                Challenges
              </Link>
              <Link to="/connections" className="text-sm font-medium transition-colors hover:text-primary">
                Connections
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/parent-profile')}>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/playdates')}>
                    <Calendar className="mr-2 h-4 w-4" /> My Playdates
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/achievements')}>
                    <Trophy className="mr-2 h-4 w-4" /> Achievements
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Testimonials
              </button>
              <Link to="/auth">
                <Button variant="default" className="bg-primary hover:bg-primary/90">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </nav>

        <button
          className="block md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 pt-14 bg-white/95 backdrop-blur-sm" data-mobile-menu>
          <div className="container py-4 h-full overflow-y-auto">
            <div className="flex flex-col h-full pb-safe">
              {user ? (
                <>
                  <div className="flex items-center space-x-3 p-4 mb-2 border-b">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Member</p>
                    </div>
                  </div>
                  <Link 
                    to="/dashboard" 
                    className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted"
                  >
                    <span className="mr-3">Dashboard</span>
                  </Link>
                  <Link 
                    to="/playdates" 
                    className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted"
                  >
                    <Calendar className="w-5 h-5 mr-3" />
                    <span>Playdates</span>
                  </Link>
                  <Link 
                    to="/challenges" 
                    className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted"
                  >
                    <Trophy className="w-5 h-5 mr-3" />
                    <span>Challenges</span>
                  </Link>
                  <Link 
                    to="/connections" 
                    className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted"
                  >
                    <Users className="w-5 h-5 mr-3" />
                    <span>Connections</span>
                  </Link>
                  <Link 
                    to="/parent-profile" 
                    className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted"
                  >
                    <User className="w-5 h-5 mr-3" />
                    <span>Profile</span>
                  </Link>
                  <Link 
                    to="/achievements" 
                    className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted"
                  >
                    <Trophy className="w-5 h-5 mr-3" />
                    <span>Achievements</span>
                  </Link>
                  
                  <div className="mt-auto border-t pt-2">
                    <button
                      className="flex items-center w-full px-4 py-3 text-base font-medium rounded-md text-red-500 hover:bg-red-50"
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => scrollToSection('features')}
                    className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted"
                  >
                    <span>Features</span>
                  </button>
                  <button
                    onClick={() => scrollToSection('how-it-works')}
                    className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted"
                  >
                    <span>How It Works</span>
                  </button>
                  <button
                    onClick={() => scrollToSection('testimonials')}
                    className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-muted"
                  >
                    <span>Testimonials</span>
                  </button>
                  
                  <div className="px-4 mt-4">
                    <Link 
                      to="/auth"
                      className="block w-full"
                    >
                      <Button className="w-full bg-primary hover:bg-primary/90 py-6 text-base">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
