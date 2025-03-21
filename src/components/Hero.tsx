
import React from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const Hero = () => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section 
      ref={ref as React.RefObject<HTMLDivElement>}
      className="relative min-h-screen flex items-center px-6 py-32 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-primary/5 to-transparent"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 filter blur-3xl"></div>
        <div className="absolute top-[20%] left-[-5%] w-[30%] h-[30%] rounded-full bg-primary/10 filter blur-3xl"></div>
        <div className="absolute top-[60%] right-[20%] w-[15%] h-[15%] rounded-full bg-accent/10 filter blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div 
            className={cn(
              "max-w-2xl space-y-6 text-center lg:text-left",
              isIntersecting ? "animate-fade-up" : "opacity-0"
            )}
          >
            <div className="inline-block rounded-full bg-muted px-4 py-1.5 mb-4">
              <span className="text-sm font-medium text-foreground/80">
                Connecting families for safe outdoor play
              </span>
            </div>
            
            <h1 className="font-bold tracking-tight">
              <span className="block">Schedule Safe and Fun</span>
              <span className="block text-primary">Outdoor Playdates</span>
              <span className="block">For Your Kids</span>
            </h1>
            
            <p className="text-xl text-muted-foreground">
              GoPlayNow helps parents organize safe, structured outdoor playdates, find playmates with similar interests, and make outdoor play more engaging through gamified challenges.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="button-glow bg-primary hover:bg-primary/90 text-white rounded-xl"
                onClick={() => document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-xl"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </div>
          </div>
          
          <div 
            className={cn(
              "relative w-full max-w-lg",
              isIntersecting ? "animate-scale-up" : "opacity-0"
            )}
          >
            <div className="relative z-10 bg-white rounded-2xl shadow-soft p-6 backdrop-blur-sm border border-muted">
              <div className="aspect-video w-full rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1540479859555-17af45c78602?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
                  alt="Children playing outdoors in a park" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Upcoming Playdate</h3>
                    <p className="text-sm text-muted-foreground">Central Park Playground</p>
                  </div>
                  <div className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full text-sm">
                    Today, 2PM
                  </div>
                </div>
                
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                      L
                    </div>
                    <div>
                      <span className="block text-sm font-medium">Liam (6) and Emma (5)</span>
                      <span className="block text-xs text-muted-foreground">3 blocks away • Nature Explorers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-[-10%] right-[-10%] h-40 w-40 bg-primary/10 rounded-full filter blur-xl"></div>
            <div className="absolute bottom-[-5%] left-[-5%] h-24 w-24 bg-secondary/10 rounded-full filter blur-xl"></div>
          </div>
        </div>
        
        <div className="mt-24 flex justify-center">
          <div 
            className={cn(
              "flex flex-wrap justify-center gap-12 items-center py-8 px-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-muted/60 shadow-soft",
              isIntersecting ? "animate-fade-in" : "opacity-0"
            )}
            style={{ animationDelay: "0.4s" }}
          >
            <TrustBadge label="Verified Parents" value="1,000+" />
            <TrustBadge label="Playdates Organized" value="10,000+" />
            <TrustBadge label="Unique Locations" value="500+" />
            <TrustBadge label="Outdoor Challenges" value="250+" />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <button 
          className="animate-bounce flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-soft"
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll to features"
        >
          <ArrowRight className="h-5 w-5 text-primary transform rotate-90" />
        </button>
      </div>
    </section>
  );
};

interface TrustBadgeProps {
  label: string;
  value: string;
}

const TrustBadge = ({ label, value }: TrustBadgeProps) => (
  <div className="text-center px-2">
    <div className="text-3xl font-bold text-foreground">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

export default Hero;
