
import React from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { MapPin, Calendar, Laugh, Shield } from 'lucide-react';

const HowItWorks = () => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section 
      ref={ref as React.RefObject<HTMLDivElement>}
      className="py-24 px-6 relative overflow-hidden bg-muted/20"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[30%] right-[10%] w-[25%] h-[25%] rounded-full bg-primary/5 filter blur-3xl"></div>
        <div className="absolute bottom-[20%] left-[5%] w-[20%] h-[20%] rounded-full bg-secondary/5 filter blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-bold text-3xl sm:text-4xl tracking-tight mb-4">
            How <span className="text-primary">GoPlayNow</span> Works
          </h2>
          <p className="text-xl text-muted-foreground">
            Our platform connects parents, helping them organize safe outdoor playdates and activities for their children.
          </p>
        </div>

        <div className={cn(
          "grid md:grid-cols-3 gap-8 mt-16",
          isIntersecting ? "animate-fade-in" : "opacity-0"
        )}>
          <StepCard 
            number="1️⃣"
            icon={<MapPin className="h-8 w-8 text-blue-500" />}
            title="Find Nearby Playdates"
            description="See outdoor meetups and events happening near you."
            iconBgColor="bg-blue-100"
          />
          
          <StepCard 
            number="2️⃣"
            icon={<Calendar className="h-8 w-8 text-green-500" />}
            title="Join or Create One"
            description="RSVP to existing playdates or organize your own in just a few taps."
            iconBgColor="bg-green-100"
          />
          
          <StepCard 
            number="3️⃣"
            icon={<Laugh className="h-8 w-8 text-orange-500" />}
            title="Play, Laugh, Connect"
            description="Let your kids explore and socialize while you connect with other parents."
            iconBgColor="bg-orange-100"
          />
        </div>
        
        <div className="mt-16 flex justify-center">
          <div className={cn(
            "max-w-4xl w-full overflow-hidden rounded-2xl shadow-soft",
            isIntersecting ? "animate-scale-up" : "opacity-0"
          )}>
            <img 
              src="https://images.unsplash.com/photo-1540479859555-17af45c78602?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
              alt="Children playing together outdoors" 
              className="w-full h-auto object-cover aspect-[16/9]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

interface StepCardProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBgColor: string;
}

const StepCard = ({ number, icon, title, description, iconBgColor }: StepCardProps) => (
  <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-soft border border-muted/60">
    <div className={`w-16 h-16 ${iconBgColor} rounded-full flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <div className="text-2xl font-bold mb-2">{title}</div>
    <div className="text-lg text-muted-foreground">{description}</div>
  </div>
);

export default HowItWorks;
