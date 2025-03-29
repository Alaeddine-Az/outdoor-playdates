
import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles } from 'lucide-react';
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
  title: "Sandy Hands & Big Plans",
  location: "Shouldice Athletic Park",
  time: "Sunday, 3PM",
  image: "https://plus.unsplash.com/premium_photo-1661567408466-27899e8a4a2f?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  parent: {
    name: "David Wilson",
    avatar: "https://i.pravatar.cc/150?img=51"
  },
  children: "Lucas (8) and Mia (7)"
}, {
  title: "Dig, Build, and Dream",
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
  title: "Creative Art Class",
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
      {/* Background Elements - Updated with more playful, vibrant gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-pink-50 via-blue-50 to-white my-0 py-0"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/15 filter blur-3xl animate-pulse"></div>
        <div className="absolute top-[20%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary/15 filter blur-3xl animate-pulse"></div>
        <div className="absolute top-[60%] right-[20%] w-[25%] h-[25%] rounded-full bg-accent/15 filter blur-3xl animate-pulse"></div>
        
        {/* Decorative floating shapes for playful aesthetic */}
        <div className="absolute top-[15%] right-[15%] w-12 h-12 bg-yellow-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-[25%] left-[10%] w-6 h-6 bg-green-300 rounded-full opacity-30 animate-ping" style={{animationDuration: '3s'}}></div>
        <div className="absolute top-[40%] right-[30%] w-8 h-8 bg-purple-300 rounded-full opacity-20 animate-ping" style={{animationDuration: '4s'}}></div>
      </div>

      <div className="container mx-auto relative z-10 -mt-12 my-0">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 py-[13px]">
          <div className="">
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-pink-100 mb-6 px-[14px] py-[8px] shadow-sm">
              <span className="text-sm font-medium text-foreground/90 text-center flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                Safe, Fun Outdoor Playdates for Kids
              </span>
            </div>
            
            <h1 className="font-bold tracking-tight mb-8 text-4xl sm:text-5xl md:text-6xl">
              <span className="block mb-2">Connect with</span>
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Friendly Families.</span>
              <span className="block mt-2">Enjoy Outdoor Fun!</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-xl">
              GoPlayNow makes it easy to find trusted playmates, schedule outdoor adventures, and create wonderful memories together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="button-glow bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-md text-white rounded-xl transform transition-all duration-300 hover:scale-105" 
                onClick={scrollToOnboarding}
              >
                Get Invited - It's Free! <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-xl hover:bg-white hover:text-primary border-2 border-primary/30 shadow-sm transition-all duration-300 hover:scale-105 hover:border-primary" 
                onClick={scrollToFeatures}
              >
                Learn More
              </Button>
            </div>
            
            {/* Feature bubbles */}
            <div className="flex flex-wrap mt-10 gap-2">
              {['Fun Adventures', 'Safe Environment', 'Make Friends', 'Great Memories'].map((feature, i) => (
                <div key={i} className="flex items-center bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm shadow-sm">
                  <Check className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className={cn("relative w-full max-w-lg", isIntersecting ? "animate-scale-up" : "opacity-0")}>
            <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] p-6 border border-muted/50 py-[24px] transform transition-all duration-500 hover:scale-[1.02]">
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-inner">
                <img src={playdate.image} alt="Playdate activity" className="w-full h-full object-cover transition-all duration-500 hover:scale-105" key={playdateIndex} />
              </div>
              
              <div className="mt-5 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{playdate.title}</h3>
                    <p className="text-sm text-muted-foreground">{playdate.location}</p>
                  </div>
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-medium px-3 py-1.5 rounded-full text-sm">
                    {playdate.time}
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-xl p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex space-x-3">
                    <Avatar className="h-10 w-10 ring-2 ring-white">
                      <AvatarImage src={playdate.parent.avatar} alt={playdate.parent.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-secondary-foreground">
                        {playdate.parent.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="block text-sm font-semibold">{playdate.parent.name}</span>
                      <span className="block text-xs text-muted-foreground">with {playdate.children}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-[-5%] right-[-5%] h-40 w-40 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full filter blur-xl animate-pulse"></div>
            <div className="absolute bottom-[-5%] left-[-5%] h-24 w-24 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full filter blur-xl animate-pulse"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
        <button onClick={scrollToFeatures} aria-label="Scroll to features" className="animate-bounce flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg transition-transform duration-300 hover:scale-110 my-0 py-0">
          <ArrowRight className="h-5 w-5 text-primary transform rotate-90" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
