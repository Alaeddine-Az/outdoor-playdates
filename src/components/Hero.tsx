
import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define sample playdate data
const samplePlaydates = [{
  title: "Nature Discovery Walk",
  location: "Nose Hill Park",
  time: "Today, 2PM",
  image: "https://plus.unsplash.com/premium_photo-1686920244658-f3db03fe22e3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  parent: {
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?img=36"
  },
  children: "Liam (6) and Emma (5)"
}, {
  title: "Water Play Fun Day",
  location: "Bowness Park",
  time: "Tomorrow, 10AM",
  image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D",
  parent: {
    name: "Michael Thompson",
    avatar: "https://i.pravatar.cc/150?img=12"
  },
  children: "Olivia (7) and Noah (4)"
}, {
  title: "Kids Gardening Workshop",
  location: "Reader Rock Garden",
  time: "Saturday, 1PM",
  image: "https://plus.unsplash.com/premium_photo-1686920245950-58617c8a602e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  parent: {
    name: "Jessica Parker",
    avatar: "https://i.pravatar.cc/150?img=25"
  },
  children: "Sophia (5) and Jackson (6)"
}, {
  title: "Kids Soccer Meetup",
  location: "Shouldice Athletic Park",
  time: "Sunday, 3PM",
  image: "https://plus.unsplash.com/premium_photo-1661567408466-27899e8a4a2f?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  parent: {
    name: "David Wilson",
    avatar: "https://i.pravatar.cc/150?img=51"
  },
  children: "Lucas (8) and Mia (7)"
}, {
  title: "Creative Art Class",
  location: "Fish Creek Provincial Park",
  time: "Monday, 4PM",
  image: "https://images.unsplash.com/photo-1599376672737-bd66af54c8f5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  parent: {
    name: "Emily Roberts",
    avatar: "https://i.pravatar.cc/150?img=44"
  },
  children: "Ethan (4) and Ava (6)"
}, {
  title: "Animal Spotting Adventure",
  location: "Edworthy Park",
  time: "Tuesday, 1PM",
  image: "https://plus.unsplash.com/premium_photo-1661695729294-fa0dc94f2a09?q=80&w=2982&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  parent: {
    name: "Amanda Lee",
    avatar: "https://i.pravatar.cc/150?img=32"
  },
  children: "Harper (5) and Mason (7)"
}, {
  title: "Story Time in the Park",
  location: "Riley Park",
  time: "Wednesday, 3PM",
  image: "https://plus.unsplash.com/premium_photo-1686920246064-f0b125432fbe?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  parent: {
    name: "Jennifer Brown",
    avatar: "https://i.pravatar.cc/150?img=16"
  },
  children: "Charlotte (6) and Benjamin (8)"
}];

const Hero = () => {
  const [playdateIndex, setPlaydateIndex] = useState(0);
  const [playdate, setPlaydate] = useState(samplePlaydates[0]);

  // Cycle through playdates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaydateIndex(prevIndex => {
        const newIndex = (prevIndex + 1) % samplePlaydates.length;
        setPlaydate(samplePlaydates[newIndex]);
        return newIndex;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  // Scroll functions
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const scrollToOnboarding = () => {
    document.getElementById('onboarding')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <section ref={ref as React.RefObject<HTMLDivElement>} className="relative min-h-screen flex items-center px-6 pt-16 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-primary/5 to-transparent my-0 py-0"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 filter blur-3xl"></div>
        <div className="absolute top-[20%] left-[-5%] w-[30%] h-[30%] rounded-full bg-primary/10 filter blur-3xl"></div>
        <div className="absolute top-[60%] right-[20%] w-[15%] h-[15%] rounded-full bg-accent/10 filter blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10 -mt-12 my-0">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 py-[13px]">
          <div className="">
            <div className="inline-block rounded-full bg-muted mb-4 px-[12px] mx-0 py-[6px]">
              <span className="text-sm font-medium text-foreground/80 text-center">
                Safe, Fun Outdoor Playdates for Kids
              </span>
            </div>
            
            <h1 className="font-bold tracking-tight mb-6">
              <span className="block">
            </span>
              <span className="block text-primary">Connect with Families.</span>
              <span className="block">Spark Outdoor Adventures.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground">
              GoPlayNow makes it easy to find trusted playmates, schedule outdoor fun, and keep kids engaged with exciting challenges.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="button-glow bg-primary hover:bg-primary/90 text-white rounded-xl" 
                onClick={scrollToOnboarding}
              >
                Get Started - It's Free! <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-xl" 
                onClick={scrollToFeatures}
              >
                Learn More
              </Button>
            </div>
          </div>
          
          <div className={cn("relative w-full max-w-lg", isIntersecting ? "animate-scale-up" : "opacity-0")}>
            <div className="relative z-10 bg-white rounded-2xl shadow-soft p-6 backdrop-blur-sm border border-muted py-[24px]">
              <div className="aspect-video w-full rounded-xl overflow-hidden">
                <img src={playdate.image} alt="Playdate activity" className="w-full h-full object-cover transition-opacity duration-500" key={playdateIndex} />
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{playdate.title}</h3>
                    <p className="text-sm text-muted-foreground">{playdate.location}</p>
                  </div>
                  <div className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full text-sm">
                    {playdate.time}
                  </div>
                </div>
                
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={playdate.parent.avatar} alt={playdate.parent.name} />
                      <AvatarFallback className="bg-secondary/20 text-secondary">
                        {playdate.parent.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="block text-sm font-medium">{playdate.parent.name}</span>
                      <span className="block text-xs text-muted-foreground">with {playdate.children}</span>
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
      </div>
      
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <button onClick={scrollToFeatures} aria-label="Scroll to features" className="animate-bounce flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-soft my-0 py-0">
          <ArrowRight className="h-5 w-5 text-primary transform rotate-90" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
