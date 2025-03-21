
import React from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { Search, Calendar, Trophy, Shield, Bell } from 'lucide-react';

interface FeatureSectionProps {
  id?: string;
}

const FeatureSection = ({ id }: FeatureSectionProps) => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

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
            src="https://images.unsplash.com/photo-1472162072942-cd5147eb3902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80" 
            alt="Children playing background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-primary/5 filter blur-3xl"></div>
        <div className="absolute bottom-[20%] left-[5%] w-[20%] h-[20%] rounded-full bg-secondary/5 filter blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block rounded-full bg-muted px-4 py-1.5 mb-4">
            <span className="text-sm font-medium text-foreground/80">
              Key Features
            </span>
          </div>
          <h2 className="font-bold tracking-tight mb-4">
            Everything You Need for <span className="text-primary">Safe Playdates</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Our platform offers powerful tools to connect with other families, organize playdates, and make outdoor play more engaging for kids.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 fade-up-stagger">
          <FeatureCard 
            icon={<Search className="h-10 w-10 text-primary" />}
            title="Playmate Finder"
            description="Connect with verified parents and find perfect playmates based on location, interests, and age compatibility."
          />
          <FeatureCard 
            icon={<Calendar className="h-10 w-10 text-secondary" />}
            title="Playdate Scheduler"
            description="Easily create, manage and schedule playdates with calendar integration and AI-powered location suggestions."
          />
          <FeatureCard 
            icon={<Trophy className="h-10 w-10 text-play-orange" />}
            title="Gamified Challenges"
            description="Engage kids with fun outdoor challenges that reward participation with points, badges, and leaderboard status."
          />
          <FeatureCard 
            icon={<Shield className="h-10 w-10 text-play-green" />}
            title="Safety Features"
            description="Rest easy with our robust verification process, parent badges, and secure messaging between connected families."
          />
          <FeatureCard 
            icon={<Bell className="h-10 w-10 text-play-purple" />}
            title="Personalized Suggestions"
            description="Receive AI-powered recommendations for potential playmates, optimal playtimes, and engaging outdoor activities."
          />
          <FeatureCard 
            className="md:col-span-2 lg:col-span-1"
            icon={<div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">P</div>}
            title="Private Community"
            description="Join interest-based playdate groups that foster connection and community among like-minded families."
          />
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard = ({ icon, title, description, className }: FeatureCardProps) => {
  return (
    <div className={cn("glass-card p-6", className)}>
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureSection;
