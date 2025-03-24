
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  MapPin, 
  MessageCircle, 
  Shield, 
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';

const Connections = () => {
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Connections</h1>
            <p className="text-muted-foreground text-lg">
              Connect with verified parents and families in Calgary
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input 
              type="search"
              placeholder="Search connections..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-input focus:border-primary focus:ring-1 focus:ring-primary/30 focus:outline-none"
            />
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="md:col-span-2 space-y-6">
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">Your Connections</h2>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              
              <div className="space-y-4">
                <ConnectionCard 
                  name="Sarah Thompson"
                  childInfo="Oliver (6) & Sophia (4)"
                  location="Signal Hill, Calgary"
                  distance="0.5 mi"
                  interests={["Nature", "STEM", "Arts & Crafts"]}
                  lastPlaydate="June 8, 2025"
                  status="active"
                />
                
                <ConnectionCard 
                  name="Michael Rogers"
                  childInfo="Emma (5)"
                  location="Bowness, Calgary"
                  distance="1.2 mi"
                  interests={["Sports", "Outdoor Play"]}
                  lastPlaydate="June 3, 2025"
                  status="active"
                />
                
                <ConnectionCard 
                  name="Jennifer Wilson"
                  childInfo="Liam (7) & Noah (5)"
                  location="Kensington, Calgary"
                  distance="2.3 mi"
                  interests={["STEM", "Reading", "Music"]}
                  lastPlaydate="May 28, 2025"
                  status="active"
                />
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="ghost" className="text-muted-foreground">
                  View All Connections
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </section>
            
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">Connection Requests</h2>
                <span className="px-2 py-0.5 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                  2 new
                </span>
              </div>
              
              <div className="space-y-4">
                <ConnectionRequestCard 
                  name="David Miller"
                  childInfo="Ava (6)"
                  location="Beltline, Calgary"
                  distance="1.8 mi"
                  interests={["Sports", "Arts & Crafts"]}
                  mutualConnections={2}
                />
                
                <ConnectionRequestCard 
                  name="Amanda Chen"
                  childInfo="Ethan (5) & Mia (3)"
                  location="Bridgeland, Calgary"
                  distance="2.1 mi"
                  interests={["Nature", "Reading"]}
                  mutualConnections={1}
                />
              </div>
            </section>
          </div>
          
          {/* Sidebar content */}
          <div className="space-y-6">
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <h2 className="text-lg font-medium mb-4">Suggested Connections</h2>
              
              <div className="space-y-3">
                <SuggestedConnectionCard 
                  name="Robert Carter"
                  childInfo="Mason (6)"
                  location="Inglewood, Calgary"
                  distance="1.5 mi"
                  interests={["STEM", "Sports"]}
                  compatibility={92}
                />
                
                <SuggestedConnectionCard 
                  name="Lisa Morgan"
                  childInfo="Charlotte (5)"
                  location="Sunnyside, Calgary"
                  distance="0.9 mi"
                  interests={["Arts & Crafts", "Nature"]}
                  compatibility={87}
                />
                
                <SuggestedConnectionCard 
                  name="Daniel Wilson"
                  childInfo="Lucas (7) & Lily (4)"
                  location="Mission, Calgary"
                  distance="1.2 mi"
                  interests={["Sports", "Music"]}
                  compatibility={84}
                />
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  Explore More
                </Button>
              </div>
            </section>
            
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <h2 className="text-lg font-medium mb-4">Connection Groups</h2>
              
              <div className="space-y-3">
                <ConnectionGroupCard 
                  name="Calgary STEM Parents"
                  members={14}
                  description="For parents interested in STEM activities for their kids."
                />
                
                <ConnectionGroupCard 
                  name="NW Calgary Outdoor Play"
                  members={23}
                  description="Families looking for outdoor play in NW Calgary."
                />
                
                <ConnectionGroupCard 
                  name="Calgary Arts & Crafts"
                  members={18}
                  description="Creative activities and projects for Calgary kids."
                />
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  View All Groups
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

interface ConnectionCardProps {
  name: string;
  childInfo: string;
  location: string;
  distance: string;
  interests: string[];
  lastPlaydate: string;
  status: 'active' | 'pending';
}

const ConnectionCard = ({ name, childInfo, location, distance, interests, lastPlaydate, status }: ConnectionCardProps) => {
  return (
    <div className="p-4 rounded-lg border border-muted bg-muted/10 hover:bg-muted/30 transition-colors">
      <div className="flex items-start">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-lg">
          {name.charAt(0)}
        </div>
        <div className="ml-4 flex-grow">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium flex items-center">
                {name}
                <Shield className="h-3.5 w-3.5 ml-2 text-primary" />
              </h3>
              <div className="text-sm text-muted-foreground mt-0.5">
                <span>{childInfo}</span>
              </div>
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span>{location} ({distance})</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="h-8">
                <MessageCircle className="h-3.5 w-3.5 mr-1" />
                Message
              </Button>
              <Button size="sm" className="h-8">Schedule</Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {interests.map((interest, index) => (
              <span 
                key={index} 
                className="inline-block px-2 py-0.5 bg-muted text-xs rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Last playdate: {lastPlaydate}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ConnectionRequestCardProps {
  name: string;
  childInfo: string;
  location: string;
  distance: string;
  interests: string[];
  mutualConnections: number;
}

const ConnectionRequestCard = ({ name, childInfo, location, distance, interests, mutualConnections }: ConnectionRequestCardProps) => {
  return (
    <div className="p-4 rounded-lg border border-muted bg-muted/10 hover:bg-muted/30 transition-colors">
      <div className="flex items-start">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-medium text-lg">
          {name.charAt(0)}
        </div>
        <div className="ml-4 flex-grow">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium flex items-center">
                {name}
                <Shield className="h-3.5 w-3.5 ml-2 text-primary" />
              </h3>
              <div className="text-sm text-muted-foreground mt-0.5">
                <span>{childInfo}</span>
              </div>
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span>{location} ({distance})</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="h-8">Decline</Button>
              <Button size="sm" className="h-8">Accept</Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {interests.map((interest, index) => (
              <span 
                key={index} 
                className="inline-block px-2 py-0.5 bg-muted text-xs rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            <UserCheck className="h-3.5 w-3.5 inline mr-1" />
            {mutualConnections} mutual connection{mutualConnections !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

interface SuggestedConnectionCardProps {
  name: string;
  childInfo: string;
  location: string;
  distance: string;
  interests: string[];
  compatibility: number;
}

const SuggestedConnectionCard = ({ name, childInfo, location, distance, interests, compatibility }: SuggestedConnectionCardProps) => {
  return (
    <div className="p-3 rounded-lg border border-muted hover:border-primary/20 transition-colors">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium">
          {name.charAt(0)}
        </div>
        <div className="ml-2.5">
          <h4 className="font-medium text-sm">{name}</h4>
          <div className="flex items-center text-xs text-muted-foreground">
            <Users className="h-3 w-3 mr-0.5" />
            <span>{childInfo}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center text-xs text-muted-foreground mt-2">
        <MapPin className="h-3 w-3 mr-0.5" />
        <span>{location} ({distance})</span>
      </div>
      <div className="flex mt-2 gap-1">
        {interests.map((interest, index) => (
          <span 
            key={index} 
            className="text-xs bg-muted px-1.5 py-0.5 rounded"
          >
            {interest}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center mt-3">
        <span className="text-xs text-primary font-medium">{compatibility}% Match</span>
        <Button variant="outline" size="sm" className="h-7 text-xs">
          <UserPlus className="h-3 w-3 mr-1" />
          Connect
        </Button>
      </div>
    </div>
  );
};

interface ConnectionGroupCardProps {
  name: string;
  members: number;
  description: string;
}

const ConnectionGroupCard = ({ name, members, description }: ConnectionGroupCardProps) => {
  return (
    <div className="p-3 rounded-lg border border-muted hover:border-primary/20 transition-colors">
      <h4 className="font-medium text-sm">{name}</h4>
      <div className="flex items-center text-xs text-muted-foreground mt-1">
        <Users className="h-3 w-3 mr-1" />
        <span>{members} members</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
      <Button variant="outline" size="sm" className="w-full mt-2 h-7 text-xs">
        Join Group
      </Button>
    </div>
  );
};

export default Connections;
