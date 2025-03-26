
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
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Find the right playmates",
      description: "Match with nearby families who share your values and your child's interests."
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Plan playdates with ease",
      description: "Schedule in seconds with smart suggestions and calendar sync."
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: "Make outdoor play exciting",
      description: "Kids earn badges and rewards for fun daily challenges."
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-primary" />,
      title: "Feel confident every step",
      description: "All parents are verified. Chats are private and secure."
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-primary" />,
      title: "Get personalized ideas",
      description: "Discover the best matches, times, and local spots for your family."
    },
    {
      icon: <Heart className="h-10 w-10 text-primary" />,
      title: "Join a real community",
      description: "Connect with other parents in private, interest-based groups."
    }
  ];

  return (
    <section 
      id={id}
      ref={ref as React.RefObject<HTMLDivElement>}
      className="py-16 px-6 relative overflow-hidden"
    >
      <div className="container mx-auto relative z-10 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Why Parents Love <span className="text-primary">GoPlayNow</span>
          </h2>
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
                "bg-white rounded-xl p-6 border border-muted shadow-soft flex flex-col",
                isIntersecting ? `animate-slide-up delay-${(index % 3) * 100}` : "opacity-0"
              )}
            >
              <div className="mb-4 inline-block p-3 rounded-lg bg-primary/10">
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
