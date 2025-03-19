
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Trophy, Star, PlusCircle, Clock, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, Jane!</h1>
          <p className="text-muted-foreground text-lg">
            Here's what's happening with your playdates and connections.
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="md:col-span-2 space-y-6">
            {/* Upcoming playdates */}
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium">Upcoming Playdates</h2>
                <Button variant="outline" size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Playdate
                </Button>
              </div>
              
              <div className="space-y-4">
                <PlaydateCard 
                  title="Park Playdate with Oliver & Sophia"
                  date="Today"
                  time="3:00 PM - 5:00 PM"
                  location="Central Park Playground"
                  attendees={2}
                  status="upcoming"
                />
                
                <PlaydateCard 
                  title="Swimming Lessons Group"
                  date="Tomorrow"
                  time="10:00 AM - 11:30 AM"
                  location="Community Pool"
                  attendees={4}
                  status="upcoming"
                />
                
                <PlaydateCard 
                  title="STEM Museum Field Trip"
                  date="Jun 18"
                  time="1:00 PM - 4:00 PM"
                  location="Science Discovery Museum"
                  attendees={3}
                  status="pending"
                />
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="ghost" className="text-muted-foreground">
                  View All Playdates
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </section>
            
            {/* Active challenges */}
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium">Active Challenges</h2>
                <div className="flex items-center text-muted-foreground">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="text-sm font-medium">450 points</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <ChallengeCard 
                  title="Nature Scavenger Hunt"
                  description="Find 10 different leaves, a pinecone, and spot 3 different birds"
                  progress={40}
                  points={100}
                  daysLeft={2}
                />
                
                <ChallengeCard 
                  title="Outdoor Sports Week"
                  description="Try a different outdoor sport each day this week"
                  progress={60}
                  points={150}
                  daysLeft={4}
                />
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="ghost" className="text-muted-foreground">
                  View All Challenges
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </section>
          </div>
          
          {/* Sidebar content */}
          <div className="space-y-6">
            {/* Profile summary */}
            <section className="bg-white rounded-xl shadow-soft border border-muted overflow-hidden">
              <div className="bg-primary h-20 relative">
                <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-full bg-white border-4 border-white flex items-center justify-center text-primary font-bold text-xl">
                  JP
                </div>
              </div>
              <div className="pt-10 px-6 pb-6">
                <h3 className="font-medium text-lg">Jane Parent</h3>
                <p className="text-muted-foreground text-sm mb-4">Parent of Emma (5)</p>
                
                <div className="flex space-x-2 mb-4">
                  <span className="inline-block px-2 py-1 bg-muted text-xs rounded-full">
                    Arts & Crafts
                  </span>
                  <span className="inline-block px-2 py-1 bg-muted text-xs rounded-full">
                    Nature
                  </span>
                  <span className="inline-block px-2 py-1 bg-muted text-xs rounded-full">
                    STEM
                  </span>
                </div>
                
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </div>
            </section>
            
            {/* Suggested connections */}
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <h2 className="text-lg font-medium mb-4">Suggested Connections</h2>
              
              <div className="space-y-4">
                <ConnectionCard 
                  name="Michael P."
                  childName="Oliver (6)"
                  interests={["Sports", "STEM"]}
                  distance="0.5 miles"
                />
                
                <ConnectionCard 
                  name="Sarah T."
                  childName="Liam (5)"
                  interests={["Arts", "Nature"]}
                  distance="0.8 miles"
                />
                
                <ConnectionCard 
                  name="David R."
                  childName="Sophia (6)"
                  interests={["STEM", "Reading"]}
                  distance="1.2 miles"
                />
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="ghost" className="text-sm text-muted-foreground">
                  View More
                </Button>
              </div>
            </section>
            
            {/* Upcoming events nearby */}
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <h2 className="text-lg font-medium mb-4">Nearby Events</h2>
              
              <div className="space-y-3">
                <EventCard 
                  title="Community Playground Day"
                  date="Jun 17"
                  location="City Central Park"
                />
                
                <EventCard 
                  title="Kids' Science Fair"
                  date="Jun 24"
                  location="Public Library"
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

interface PlaydateCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  status: 'upcoming' | 'pending' | 'completed';
}

const PlaydateCard = ({ title, date, time, location, attendees, status }: PlaydateCardProps) => {
  const statusColors = {
    upcoming: 'bg-secondary text-secondary',
    pending: 'bg-muted-foreground text-muted-foreground',
    completed: 'bg-primary text-primary'
  };
  
  return (
    <div className="flex items-start p-4 rounded-lg border border-muted bg-muted/10 hover:bg-muted/30 transition-colors">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary">
        <Calendar className="h-6 w-6" />
      </div>
      <div className="ml-4 flex-grow">
        <div className="flex justify-between">
          <h3 className="font-medium">{title}</h3>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${statusColors[status]}`}></div>
            <span className={`text-xs capitalize ${statusColors[status]}`}>{status}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" /> 
            {date}, {time}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" /> 
            {location}
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" /> 
            {attendees} families
          </div>
        </div>
      </div>
    </div>
  );
};

interface ChallengeCardProps {
  title: string;
  description: string;
  progress: number;
  points: number;
  daysLeft: number;
}

const ChallengeCard = ({ title, description, progress, points, daysLeft }: ChallengeCardProps) => {
  return (
    <div className="p-4 rounded-lg border border-muted bg-muted/10 hover:bg-muted/30 transition-colors">
      <div className="flex justify-between mb-2">
        <div className="flex items-center">
          <Trophy className="h-5 w-5 text-play-orange mr-2" />
          <h3 className="font-medium">{title}</h3>
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          +{points} pts
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-play-orange rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className="text-xs text-muted-foreground text-right">
        {daysLeft} days left
      </div>
    </div>
  );
};

interface ConnectionCardProps {
  name: string;
  childName: string;
  interests: string[];
  distance: string;
}

const ConnectionCard = ({ name, childName, interests, distance }: ConnectionCardProps) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-muted hover:border-primary/20 transition-colors">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
          {name.charAt(0)}
        </div>
        <div className="ml-3">
          <h4 className="font-medium text-sm">{name}</h4>
          <div className="flex items-center text-xs text-muted-foreground">
            <Users className="h-3 w-3 mr-1" /> 
            <span>{childName}</span>
            <span className="mx-1">•</span>
            <MapPin className="h-3 w-3 mr-1" /> 
            <span>{distance}</span>
          </div>
          <div className="flex mt-1 gap-1">
            {interests.map((interest, index) => (
              <span key={index} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
      <Button variant="outline" size="sm" className="h-8">
        Connect
      </Button>
    </div>
  );
};

interface EventCardProps {
  title: string;
  date: string;
  location: string;
}

const EventCard = ({ title, date, location }: EventCardProps) => {
  return (
    <div className="p-3 rounded-lg border border-muted hover:border-primary/20 transition-colors">
      <h4 className="font-medium text-sm">{title}</h4>
      <div className="flex items-center text-xs text-muted-foreground mt-1">
        <Calendar className="h-3 w-3 mr-1" /> 
        <span>{date}</span>
        <span className="mx-1">•</span>
        <MapPin className="h-3 w-3 mr-1" /> 
        <span>{location}</span>
      </div>
    </div>
  );
};

export default Dashboard;
