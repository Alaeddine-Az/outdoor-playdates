
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-sm border-b bg-white/90 border-muted">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="font-bold text-xl md:text-2xl text-primary">GoPlayNow</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
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
              <Link to="/#features" className="text-sm font-medium transition-colors hover:text-primary">
                Features
              </Link>
              <Link to="/#how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
                How It Works
              </Link>
              <Link to="/#testimonials" className="text-sm font-medium transition-colors hover:text-primary">
                Testimonials
              </Link>
              <Link to="/auth">
                <Button variant="default" className="bg-primary hover:bg-primary/90">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Navigation Trigger */}
        <button
          className="block md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-muted">
          <div className="container py-4 space-y-4">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block px-4 py-2 text-sm font-medium rounded-md hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/playdates" 
                  className="block px-4 py-2 text-sm font-medium rounded-md hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Playdates
                </Link>
                <Link 
                  to="/challenges" 
                  className="block px-4 py-2 text-sm font-medium rounded-md hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Challenges
                </Link>
                <Link 
                  to="/connections" 
                  className="block px-4 py-2 text-sm font-medium rounded-md hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connections
                </Link>
                <Link 
                  to="/parent-profile" 
                  className="block px-4 py-2 text-sm font-medium rounded-md hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="inline mr-2 h-4 w-4" /> Profile
                </Link>
                <Link 
                  to="/achievements" 
                  className="block px-4 py-2 text-sm font-medium rounded-md hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Trophy className="inline mr-2 h-4 w-4" /> Achievements
                </Link>
                <button
                  className="w-full text-left px-4 py-2 text-sm font-medium rounded-md text-red-500 hover:bg-red-50"
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="inline mr-2 h-4 w-4" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/#features" 
                  className="block px-4 py-2 text-sm font-medium rounded-md hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  to="/#how-it-works" 
                  className="block px-4 py-2 text-sm font-medium rounded-md hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </Link>
                <Link 
                  to="/#testimonials" 
                  className="block px-4 py-2 text-sm font-medium rounded-md hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Testimonials
                </Link>
                <Link 
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
