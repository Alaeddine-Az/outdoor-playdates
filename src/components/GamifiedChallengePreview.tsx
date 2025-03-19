
import React from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { Trophy, Star, Award, BarChart3, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GamifiedChallengePreview = () => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section 
      ref={ref as React.RefObject<HTMLDivElement>}
      className="py-24 px-6 relative overflow-hidden bg-muted/30"
    >
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className={cn(
            "max-w-xl",
            isIntersecting ? "animate-fade-in" : "opacity-0"
          )}>
            <div className="inline-block rounded-full bg-play-orange/10 px-4 py-1.5 mb-4">
              <span className="text-sm font-medium text-play-orange">
                Fun Outdoor Challenges
              </span>
            </div>
            <h2 className="font-bold tracking-tight mb-6">
              Motivate Kids with <br />Gamified Outdoor Play
            </h2>
            <div className="space-y-6">
              <FeaturePoint 
                icon={<ListTodo className="h-5 w-5 text-play-orange" />}
                title="Daily & Weekly Challenges"
                description="Kids can choose from a variety of age-appropriate outdoor activities and challenges."
              />
              <FeaturePoint 
                icon={<Trophy className="h-5 w-5 text-play-orange" />}
                title="Rewards & Achievements"
                description="Earn points, badges, and rewards for completing challenges and maintaining activity streaks."
              />
              <FeaturePoint 
                icon={<BarChart3 className="h-5 w-5 text-play-orange" />}
                title="Parent Dashboard"
                description="Track progress, view completed challenges, and monitor outdoor activity patterns."
              />
            </div>
            <div className="mt-8">
              <Button 
                size="lg" 
                className="button-glow bg-play-orange hover:bg-play-orange/90 text-white rounded-xl"
                onClick={() => document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Challenges
              </Button>
            </div>
          </div>
          
          <div className={cn(
            "w-full max-w-xl",
            isIntersecting ? "animate-slide-in-right" : "opacity-0"
          )}>
            <div className="bg-white rounded-2xl shadow-soft border border-muted p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium">Kids' Challenge Dashboard</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-medium">450 points</span>
                </div>
              </div>
              
              <div className="space-y-5">
                <div className="glass-card p-4 border-play-orange/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-lg">Current Challenge</h4>
                    <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-play-orange/10 text-play-orange">
                      2 days left
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-xl bg-play-orange/10 flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-play-orange" />
                    </div>
                    <div className="ml-4">
                      <h5 className="font-medium">Nature Scavenger Hunt</h5>
                      <p className="text-sm text-muted-foreground">Find 10 different leaves, a pinecone, and spot 3 different birds</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>7/15 items</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-play-orange rounded-full" style={{ width: '47%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium">Recent Badges</h5>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Award className="h-5 w-5 text-secondary" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-play-purple/10 flex items-center justify-center">
                        <Award className="h-5 w-5 text-play-purple" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium">Activity Streak</h5>
                    </div>
                    <div className="flex items-end space-x-1 mt-2">
                      {[3, 5, 4, 6, 7, 5, 0].map((value, index) => (
                        <div 
                          key={index} 
                          className={cn(
                            "w-6 rounded-t-sm", 
                            index === 6 ? "bg-muted" : "bg-play-orange",
                            index === 6 ? "border border-dashed border-play-orange/30" : ""
                          )}
                          style={{ height: `${value * 6}px` }}
                        ></div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>M</span>
                      <span>T</span>
                      <span>W</span>
                      <span>T</span>
                      <span>F</span>
                      <span>S</span>
                      <span>S</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-xl p-4">
                  <h5 className="font-medium mb-3">Upcoming Challenges</h5>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-play-green/10 flex items-center justify-center">
                          <ListTodo className="h-4 w-4 text-play-green" />
                        </div>
                        <span className="ml-2 text-sm">Bike Adventure</span>
                      </div>
                      <span className="text-xs text-muted-foreground">+100 pts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-play-purple/10 flex items-center justify-center">
                          <ListTodo className="h-4 w-4 text-play-purple" />
                        </div>
                        <span className="ml-2 text-sm">Team Sports Day</span>
                      </div>
                      <span className="text-xs text-muted-foreground">+75 pts</span>
                    </div>
                  </div>
                </div>
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
    <div className="mr-4 mt-1 flex-shrink-0 h-10 w-10 rounded-full bg-play-orange/10 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h4 className="text-lg font-medium mb-1">{title}</h4>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default GamifiedChallengePreview;
