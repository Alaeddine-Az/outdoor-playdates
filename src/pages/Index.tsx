
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeatureSection from '@/components/FeatureSection';
import HowItWorks from '@/components/HowItWorks';
import PlaymateFinderPreview from '@/components/PlaymateFinderPreview';
import PlaydateSchedulerPreview from '@/components/PlaydateSchedulerPreview';
//import GamifiedChallengePreview from '@/components/GamifiedChallengePreview';
import CommunityPreview from '@/components/CommunityPreview';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import OnboardingFlow from '@/components/OnboardingFlow';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const Index = () => {
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <HowItWorks id="how-it-works" />
      <div className="space-y-12 md:space-y-16">
        <PlaymateFinderPreview />
        <PlaydateSchedulerPreview />
        <CommunityPreview />
        <TestimonialsCarousel />
        <FeatureSection id="features" />
        <OnboardingFlow id="onboarding" />
      </div>

      {/* Footer */}
      <footer className="bg-muted/30 py-12 border-t border-muted">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="max-w-xs">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GP</span>
                </div>
                <span className="font-bold text-lg">GoPlayNow</span>
              </div>
              <p className="text-muted-foreground">
                Connecting families for safe and fun outdoor playdates. Join our community today!
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h4 className="font-medium mb-3">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a></li>
                  <li><a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How It Works</a></li>
                  <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-3">Company</h4>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
                  <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-3">Legal</h4>
                <ul className="space-y-2">
                  <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-muted flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} GoPlayNow. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Twitter
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Facebook
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <button
        className={cn(
          "fixed bottom-6 right-6 w-10 h-10 z-[9999] rounded-full bg-primary text-white shadow-button flex items-center justify-center transition-all duration-300 transform",
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Index;
