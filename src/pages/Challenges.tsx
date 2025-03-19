
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Star, 
  Flag, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  BarChart3, 
  Filter,
  PlusCircle
} from 'lucide-react';

const Challenges = () => {
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Outdoor Challenges</h1>
            <p className="text-muted-foreground text-lg">
              Gamified activities to keep your kids active and engaged outdoors
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2 bg-muted/50 px-4 py-2 rounded-lg">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="font-medium">450 points</span>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Challenge
            </Button>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="md:col-span-2 space-y-6">
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">Active Challenges</h2>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              
              <div className="space-y-5">
                <ChallengeCard 
                  title="Nature Scavenger Hunt"
                  description="Find 10 different leaves, a pinecone, and spot 3 different birds in your neighborhood."
                  progress={40}
                  points={100}
                  daysLeft={2}
                  category="Nature"
                />
                
                <ChallengeCard 
                  title="Outdoor Sports Week"
                  description="Try a different outdoor sport each day this week - soccer, basketball, frisbee, etc."
                  progress={60}
                  points={150}
                  daysLeft={4}
                  category="Sports"
                />
                
                <ChallengeCard 
                  title="Neighborhood Explorer"
                  description="Map out your neighborhood by visiting 5 new parks or playgrounds."
                  progress={20}
                  points={75}
                  daysLeft={6}
                  category="Exploration"
                />
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="ghost" className="text-muted-foreground">
                  View All Active Challenges
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </section>
            
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">Completed Challenges</h2>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              
              <div className="space-y-5">
                <CompletedChallengeCard 
                  title="Bike Adventure"
                  description="Ride bikes for at least 30 minutes in a local park or trail."
                  completedDate="Completed on June 10"
                  points={80}
                  category="Sports"
                />
                
                <CompletedChallengeCard 
                  title="Backyard Camping"
                  description="Set up a tent in your backyard and identify 3 constellations."
                  completedDate="Completed on June 5"
                  points={120}
                  category="Nature"
                />
              </div>
            </section>
          </div>
          
          {/* Sidebar content */}
          <div className="space-y-6">
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <h2 className="text-lg font-medium mb-4">Challenge Stats</h2>
              
              <div className="space-y-4">
                <StatCard 
                  title="Weekly Progress"
                  value="3/5"
                  subtext="challenges completed"
                  icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
                />
                
                <StatCard 
                  title="Active Streak"
                  value="15"
                  subtext="days of activity"
                  icon={<BarChart3 className="h-5 w-5 text-primary" />}
                />
                
                <StatCard 
                  title="Total Points"
                  value="450"
                  subtext="lifetime points"
                  icon={<Star className="h-5 w-5 text-yellow-400" />}
                />
              </div>
            </section>
            
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <h2 className="text-lg font-medium mb-4">Suggested Challenges</h2>
              
              <div className="space-y-3">
                <SuggestedChallengeCard 
                  title="Calgary Parks Tour"
                  description="Visit 3 different Calgary parks in one week."
                  points={100}
                  category="Exploration"
                />
                
                <SuggestedChallengeCard 
                  title="STEM Outdoor Lab"
                  description="Complete 3 science experiments using materials found in nature."
                  points={125}
                  category="STEM"
                />
                
                <SuggestedChallengeCard 
                  title="Sports Sampler"
                  description="Try 4 different sports activities at your local recreation center."
                  points={90}
                  category="Sports"
                />
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  Find More Challenges
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

interface ChallengeCardProps {
  title: string;
  description: string;
  progress: number;
  points: number;
  daysLeft: number;
  category: string;
}

const ChallengeCard = ({ title, description, progress, points, daysLeft, category }: ChallengeCardProps) => {
  return (
    <div className="p-5 rounded-lg border border-muted bg-muted/10 hover:bg-muted/30 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mr-3">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-lg">{title}</h3>
            <span className="inline-block px-2 py-0.5 bg-muted text-xs rounded-full mt-1">{category}</span>
          </div>
        </div>
        <div className="text-sm font-medium">
          +{points} pts
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4 mt-2">{description}</p>
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-xs text-muted-foreground flex items-center">
          <Clock className="h-3.5 w-3.5 mr-1" />
          {daysLeft} days left
        </div>
        <Button size="sm">Continue Challenge</Button>
      </div>
    </div>
  );
};

interface CompletedChallengeCardProps {
  title: string;
  description: string;
  completedDate: string;
  points: number;
  category: string;
}

const CompletedChallengeCard = ({ title, description, completedDate, points, category }: CompletedChallengeCardProps) => {
  return (
    <div className="p-5 rounded-lg border border-muted bg-muted/10 hover:bg-muted/30 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600 mr-3">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-lg">{title}</h3>
            <span className="inline-block px-2 py-0.5 bg-muted text-xs rounded-full mt-1">{category}</span>
          </div>
        </div>
        <div className="text-sm font-medium text-green-600">
          +{points} pts
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4 mt-2">{description}</p>
      <div className="flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          {completedDate}
        </div>
        <Button variant="outline" size="sm">View Details</Button>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, subtext, icon }: StatCardProps) => {
  return (
    <div className="p-4 bg-muted/30 rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">{title}</h3>
        {icon}
      </div>
      <div className="mt-2">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-xs text-muted-foreground ml-2">{subtext}</span>
      </div>
    </div>
  );
};

interface SuggestedChallengeCardProps {
  title: string;
  description: string;
  points: number;
  category: string;
}

const SuggestedChallengeCard = ({ title, description, points, category }: SuggestedChallengeCardProps) => {
  return (
    <div className="p-3 rounded-lg border border-muted hover:border-primary/20 transition-colors">
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-sm">{title}</h4>
        <span className="text-xs font-medium">+{points} pts</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1 mb-2 line-clamp-2">{description}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{category}</span>
        <Button variant="outline" size="sm" className="h-7 text-xs">
          Start
        </Button>
      </div>
    </div>
  );
};

export default Challenges;
