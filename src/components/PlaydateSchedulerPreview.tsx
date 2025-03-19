
import React from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { Calendar, Clock, MapPin, Users, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PlaydateSchedulerPreview = () => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section 
      ref={ref as React.RefObject<HTMLDivElement>}
      className="py-24 px-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[30%] left-[10%] w-[25%] h-[25%] rounded-full bg-secondary/5 filter blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[15%] w-[20%] h-[20%] rounded-full bg-primary/5 filter blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          <div className={cn(
            "max-w-xl",
            isIntersecting ? "animate-fade-in" : "opacity-0"
          )}>
            <div className="inline-block rounded-full bg-secondary/10 px-4 py-1.5 mb-4">
              <span className="text-sm font-medium text-secondary">
                Easy Scheduling
              </span>
            </div>
            <h2 className="font-bold tracking-tight mb-6">
              Organize Playdates <br />Without the Hassle
            </h2>
            <div className="space-y-6">
              <FeaturePoint 
                icon={<Calendar className="h-5 w-5 text-secondary" />}
                title="Seamless Calendar Integration"
                description="Sync with Google Calendar or Outlook to keep all your playdates organized in one place."
              />
              <FeaturePoint 
                icon={<MapPin className="h-5 w-5 text-secondary" />}
                title="AI Location Suggestions"
                description="Get recommendations for safe, kid-friendly locations based on your preferences and past activities."
              />
              <FeaturePoint 
                icon={<Users className="h-5 w-5 text-secondary" />}
                title="Simple RSVP System"
                description="Send invitations and track responses with our streamlined RSVP system via email or SMS."
              />
            </div>
            <div className="mt-8">
              <Button 
                size="lg" 
                className="button-glow bg-secondary hover:bg-secondary/90 text-white rounded-xl"
                onClick={() => document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Scheduling
              </Button>
            </div>
          </div>
          
          <div className={cn(
            "w-full max-w-xl",
            isIntersecting ? "animate-slide-in-left" : "opacity-0"
          )}>
            <div className="bg-white rounded-2xl shadow-soft border border-muted p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium">Schedule a Playdate</h3>
                <Button variant="ghost" size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" /> 
                  New
                </Button>
              </div>
              
              <div className="space-y-5">
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary">
                      <span className="text-sm font-medium">JUN</span>
                      <span className="font-bold">15</span>
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className="font-medium">Riverside Park Playdate</h4>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" /> 
                          3:00 PM - 5:00 PM
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" /> 
                          Riverside Park
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" /> 
                          3 families
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-secondary"></div>
                      <span className="text-xs font-medium text-secondary">Upcoming</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary">
                      <span className="text-sm font-medium">JUN</span>
                      <span className="font-bold">18</span>
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className="font-medium">Community Center Art Class</h4>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" /> 
                          10:00 AM - 12:00 PM
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" /> 
                          Downtown Community Center
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" /> 
                          4 families
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-secondary"></div>
                      <span className="text-xs font-medium text-secondary">Upcoming</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary">
                      <span className="text-sm font-medium">JUN</span>
                      <span className="font-bold">21</span>
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className="font-medium">Science Museum Trip</h4>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" /> 
                          1:00 PM - 4:00 PM
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" /> 
                          City Science Museum
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" /> 
                          5 families
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                      <span className="text-xs font-medium text-muted-foreground">Pending</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline" className="text-muted-foreground">View All Playdates</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface FeaturePointProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeaturePoint = ({ icon, title, description }: FeaturePointProps) => (
  <div className="flex">
    <div className="mr-4 mt-1 flex-shrink-0 h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h4 className="text-lg font-medium mb-1">{title}</h4>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default PlaydateSchedulerPreview;
