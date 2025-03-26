
import React from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { 
  Users, 
  Calendar, 
  Award, 
  ShieldCheck, 
  Lightbulb, 
  Heart 
} from 'lucide-react';

const FeatureSection = ({ id }: { id?: string }) => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  const features = [
    {
      icon: <Users className="h-10 w-10 text-play-blue" />,
      title: "Find the right playmates",
      description: "Match with nearby families who share your values and your child's interests.",
      color: "bg-play-blue/10"
    },
    {
      icon: <Calendar className="h-10 w-10 text-play-green" />,
      title: "Plan playdates with ease",
      description: "Schedule in seconds with smart suggestions and calendar sync.",
      color: "bg-play-green/10"
    },
    {
      icon: <Award className="h-10 w-10 text-play-orange" />,
      title: "Make outdoor play exciting",
      description: "Kids earn badges and rewards for fun daily challenges.",
      color: "bg-play-orange/10"
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-play-purple" />,
      title: "Feel confident every step",
      description: "All parents are verified. Chats are private and secure.",
      color: "bg-play-purple/10"
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-play-green" />,
      title: "Get personalized ideas",
      description: "Discover the best matches, times, and local spots for your family.",
      color: "bg-play-green/10"
    },
    {
      icon: <Heart className="h-10 w-10 text-play-red" />,
      title: "Join a real community",
      description: "Connect with other parents in private, interest-based groups.",
      color: "bg-play-red/10"
    }
  ];

  return (
    <section 
      id={id}
      ref={ref as React.RefObject<HTMLDivElement>}
      className="py-12 px-6 relative overflow-hidden"
    >
      {/* Playful background elements */}
      <div className="absolute w-40 h-40 bg-play-blue/5 rounded-full top-20 left-10 blur-3xl"></div>
      <div className="absolute w-60 h-60 bg-play-green/5 rounded-full bottom-20 right-10 blur-3xl"></div>
      <div className="absolute w-32 h-32 bg-play-orange/5 rounded-full top-1/2 right-1/3 blur-3xl"></div>
      
      <div className="container mx-auto relative z-10 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="relative inline-block">
            <h2 className="text-3xl font-bold tracking-tight mb-4 relative z-10">
              Why Parents Love <span className="text-primary relative">
                GoPlayNow
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 100 15" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0,5 Q25,0 50,5 T100,5" fill="none" stroke="hsl(var(--secondary))" strokeWidth="2" 
                    strokeLinecap="round" />
                </svg>
              </span>
            </h2>
          </div>
          <p className="text-xl text-muted-foreground">
            Because happy, safe kids matter most
          </p>
          <p className="mt-4 text-muted-foreground">
            We know you want your kids to grow up curious, confident, and connected. 
            GoPlayNow makes it easier to give them more time outside and more meaningful friendships.
          </p>
        </div>
        
        <div className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          isIntersecting ? "animate-fade-in" : "opacity-0"
        )}>
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={cn(
                "bg-white rounded-xl p-6 border border-muted shadow-soft hover:-translate-y-1 transition-all duration-300",
                isIntersecting ? `animate-fade-up delay-${(index % 3) * 100}` : "opacity-0"
              )}
            >
              <div className={cn("mb-4 inline-block p-3 rounded-lg", feature.color)}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
