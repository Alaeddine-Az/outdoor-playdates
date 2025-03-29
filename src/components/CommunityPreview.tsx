import React from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { Users, Shield, MessageSquare, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
const CommunityPreview = () => {
  const {
    ref,
    isIntersecting
  } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });
  return <section ref={ref as React.RefObject<HTMLDivElement>} className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] right-[20%] w-[30%] h-[30%] rounded-full bg-play-purple/5 filter blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[25%] h-[25%] rounded-full bg-primary/5 filter blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text on the left */}
          <div className={cn("max-w-xl", isIntersecting ? "animate-slide-in-left" : "opacity-0")}>
            <div className="inline-block rounded-full bg-play-purple/10 px-4 py-1.5 mb-4">
              <span className="text-sm font-medium text-play-purple">
                Private Parent Community
              </span>
            </div>
            <h2 className="font-bold tracking-tight mb-6">
              Connect in Safe, <br />Interest-Based Groups
            </h2>
            <div className="space-y-6">
              <FeaturePoint icon={<Users className="h-5 w-5 text-play-purple" />} title="Interest-Based Groups" description="Join communities based on your child's interests, like STEM Kids, Nature Explorers, or Arts & Sports Families." />
              <FeaturePoint icon={<Shield className="h-5 w-5 text-play-purple" />} title="Trust & Safety Features" description="Our verification system, reporting tools, and community guidelines ensure a safe environment for all families." />
              <FeaturePoint icon={<MessageSquare className="h-5 w-5 text-play-purple" />} title="Private Messaging" description="Only mutually connected parents can exchange messages, maintaining privacy and security." />
            </div>
            <div className="mt-8">
              <Button size="lg" className="button-glow bg-play-purple hover:bg-play-purple/90 text-white rounded-xl" onClick={() => document.getElementById('onboarding')?.scrollIntoView({
              behavior: 'smooth'
            })}>
                Join Our Community
              </Button>
            </div>
          </div>

          {/* Box on the right */}
          <div className={cn("w-full max-w-xl", isIntersecting ? "animate-slide-in-right" : "opacity-0")}>
            <div className="bg-white rounded-2xl shadow-soft border border-muted p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium">Parent Communities</h3>
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" /> 
                  Join Group
                </Button>
              </div>
              
              <div className="space-y-4">
                <CommunityCard name="STEM Explorers" members={42} description="Connect with parents who encourage scientific discovery and learning through play." active={true} />
                <CommunityCard name="Nature Adventurers" members={37} description="For families who love hiking, exploring parks, and outdoor nature activities." active={false} />
                <CommunityCard name="Creative Arts Club" members={28} description="Share ideas for art projects, music activities, and creative expression." active={false} />
              </div>
              
              <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-muted">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Lock className="h-5 w-5 text-play-purple" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-sm text-left">Privacy Guaranteed</h4>
                    <p className="text-sm text-muted-foreground mt-1 text-left">
                      All community groups are private. Only verified parents can join, and your information is never shared outside the platform.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="ghost" className="text-muted-foreground">
                  View All Communities
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
interface FeaturePointProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}
const FeaturePoint = ({
  icon,
  title,
  description
}: FeaturePointProps) => <div className="flex">
    <div className="mr-4 mt-1 flex-shrink-0 h-10 w-10 rounded-full bg-play-purple/10 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h4 className="text-lg font-medium mb-1 text-left">{title}</h4>
      <p className="text-muted-foreground text-left">{description}</p>
    </div>
  </div>;
interface CommunityCardProps {
  name: string;
  members: number;
  description: string;
  active: boolean;
}
const CommunityCard = ({
  name,
  members,
  description,
  active
}: CommunityCardProps) => <div className={cn("rounded-xl p-4 transition-colors border", active ? "bg-play-purple/5 border-play-purple/20" : "bg-muted/50 border-muted hover:border-play-purple/20 hover:bg-play-purple/5")}>
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-medium text-left">{name}</h4>
        <p className="text-sm text-muted-foreground mt-1 text-left">{description}</p>
        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-1" /> 
          <span>{members} members</span>
        </div>
      </div>
      <Button size="sm" variant={active ? "default" : "outline"} className={active ? "bg-play-purple hover:bg-play-purple/90 text-white" : ""}>
        {active ? "View" : "Join"}
      </Button>
    </div>
  </div>;
export default CommunityPreview;