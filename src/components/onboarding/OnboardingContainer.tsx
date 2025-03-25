
import React from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';

interface OnboardingContainerProps {
  id?: string;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const OnboardingContainer: React.FC<OnboardingContainerProps> = ({
  id,
  children,
  title = "Join GoPlayNow in Under 2 Minutes",
  subtitle = "Create your profile, connect with trusted families, and start scheduling safe, fun playdates for your kids."
}) => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });
  
  return (
    <section 
      id={id}
      ref={ref as React.RefObject<HTMLDivElement>}
      className="py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden bg-muted/30"
    >
      <div className="container mx-auto relative z-10 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 mb-4">
            <span className="text-sm font-medium text-primary">
              Quick & Easy Setup
            </span>
          </div>
          <h2 className="font-bold tracking-tight mb-4 text-2xl sm:text-3xl">
            <span className="text-primary">{title}</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground">
            {subtitle}
          </p>
        </div>
        
        <div className={cn(
          "max-w-4xl mx-auto bg-white rounded-2xl shadow-soft border border-muted overflow-hidden",
          isIntersecting ? "animate-scale-up" : "opacity-0"
        )}>
          {children}
          
          <div className="p-4 bg-muted/30 border-t border-muted flex items-center justify-center">
            <Users className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm text-muted-foreground">
              Join other parents using GoPlayNow for safe outdoor activities
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnboardingContainer;
