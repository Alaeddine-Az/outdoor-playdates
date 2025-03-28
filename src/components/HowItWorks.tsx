import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { MapPin, ArrowRight, Calendar, Users } from 'lucide-react';

// Define the image URLs array
const heroImages = [
  "https://plus.unsplash.com/premium_photo-1686920244658-f3db03fe22e3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1686920245950-58617c8a602e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1661567408466-27899e8a4a2f?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1599376672737-bd66af54c8f5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1661695729294-fa0dc94f2a09?q=80&w=2982&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1686920246064-f0b125432fbe?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

interface HowItWorksProps {
  id?: string;
}

const HowItWorks = ({ id }: HowItWorksProps) => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  const [randomImage, setRandomImage] = useState<string>("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * heroImages.length);
    setRandomImage(heroImages[randomIndex]);
  }, []);

  return (
    <section 
      id={id}
      ref={ref as React.RefObject<HTMLDivElement>}
      className="py-24 px-6 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img 
            src={randomImage || heroImages[0]} 
            alt="Children playing background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-primary/5 filter blur-3xl"></div>
        <div className="absolute bottom-[20%] left-[5%] w-[20%] h-[20%] rounded-full bg-secondary/5 filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block rounded-full bg-muted px-4 py-1.5 mb-4">
            <span className="text-sm font-medium text-foreground/80">
              Simple Process
            </span>
          </div>
          <h2 className="font-bold tracking-tight mb-4">
            <span className="text-primary">How It Works</span> - Get Started in Minutes
          </h2>
          <p className="text-xl text-muted-foreground">
            GoPlayNow makes finding and organizing playdates simple and fun for parents and children alike.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          <div className="w-full md:w-1/2">
            <div className="mb-8 overflow-hidden rounded-2xl border border-muted shadow-soft">
              <img 
                src={randomImage || heroImages[0]} 
                alt="Children playing outdoors" 
                className="w-full h-auto object-cover aspect-[16/9]"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="space-y-10 fade-up-stagger">
              <StepItem 
                number="1"
                icon={<MapPin className="h-6 w-6 text-primary" />}
                title="Discover Local Playdates"
                description="Find outdoor fun near you."
              />

              <StepItem 
                number="2"
                icon={<Calendar className="h-6 w-6 text-primary" />}
                title="Join or Host"
                description="RSVP or set one up in seconds."
              />

              <StepItem 
                number="3"
                icon={<Users className="h-6 w-6 text-primary" />}
                title="Play, Laugh, Connect"
                description="Kids play. Parents connect."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface StepItemProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const StepItem = ({ number, icon, title, description }: StepItemProps) => {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center relative">
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-[10px] text-white font-bold flex items-center justify-center">
          {number}
        </span>
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-medium mb-1">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default HowItWorks;
