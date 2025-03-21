
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, PlusCircle, Filter, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Playdates = () => {
  const navigate = useNavigate();
  
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Playdates</h1>
            <p className="text-muted-foreground text-lg">
              Schedule, manage, and find fun playdates for your children
            </p>
          </div>
          <Button className="button-glow bg-primary hover:bg-primary/90 text-white rounded-xl" onClick={() => navigate('/create-playdate')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Playdate
          </Button>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="md:col-span-2 space-y-6">
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">Upcoming Playdates</h2>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Playdate items */}
                <PlaydateItem 
                  title="Park Adventure"
                  date="June 15, 2025"
                  time="3:00 PM - 5:00 PM"
                  location="Prince's Island Park"
                  attendees={3}
                  status="confirmed"
                  onClick={() => navigate('/playdate/1')}
                />
                
                <PlaydateItem 
                  title="STEM Play Session"
                  date="June 18, 2025"
                  time="10:00 AM - 12:00 PM"
                  location="Calgary Science Centre"
                  attendees={5}
                  status="confirmed"
                  onClick={() => navigate('/playdate/2')}
                />
                
                <PlaydateItem 
                  title="Nature Scavenger Hunt"
                  date="June 21, 2025"
                  time="2:00 PM - 4:00 PM"
                  location="Fish Creek Provincial Park"
                  attendees={4}
                  status="pending"
                  onClick={() => navigate('/playdate/3')}
                />
              </div>
              
              <div className="mt-6">
                <Button variant="ghost" className="text-muted-foreground w-full">
                  View All Playdates
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </section>
            
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">My Scheduled Playdates</h2>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              
              <div className="space-y-4">
                <PlaydateItem 
                  title="Soccer in the Park"
                  date="June 17, 2025"
                  time="4:00 PM - 6:00 PM"
                  location="Edworthy Park"
                  attendees={6}
                  status="confirmed"
                  onClick={() => navigate('/playdate/6')}
                />
                
                <PlaydateItem 
                  title="Art Class Meetup"
                  date="June 19, 2025"
                  time="1:00 PM - 3:00 PM"
                  location="Wildflower Arts Centre"
                  attendees={8}
                  status="confirmed"
                  onClick={() => navigate('/playdate/7')}
                />
              </div>
              
              <div className="mt-6">
                <Button variant="ghost" className="text-muted-foreground w-full">
                  View All My Playdates
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </section>
            
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">Past Playdates</h2>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              
              <div className="space-y-4">
                <PlaydateItem 
                  title="Swimming Playdate"
                  date="June 8, 2025"
                  time="1:00 PM - 3:00 PM"
                  location="Southland Leisure Centre"
                  attendees={3}
                  status="completed"
                  onClick={() => navigate('/playdate/4')}
                />
                
                <PlaydateItem 
                  title="Bike Ride Adventure"
                  date="June 5, 2025"
                  time="4:00 PM - 5:30 PM"
                  location="Bowness Park"
                  attendees={2}
                  status="completed"
                  onClick={() => navigate('/playdate/5')}
                />
              </div>
            </section>
          </div>
          
          {/* Sidebar content */}
          <div className="space-y-6">
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <h2 className="text-lg font-medium mb-4">Suggested Playdates</h2>
              
              <div className="space-y-3">
                <SuggestedPlaydateCard 
                  title="Family Board Game Day"
                  date="June 22, 2025"
                  location="Calgary Central Library"
                  numFamilies={6}
                />
                
                <SuggestedPlaydateCard 
                  title="Community Playground Meet"
                  date="June 25, 2025"
                  location="North Glenmore Park"
                  numFamilies={8}
                />
                
                <SuggestedPlaydateCard 
                  title="Arts & Crafts Session"
                  date="June 29, 2025"
                  location="Wildflower Arts Centre"
                  numFamilies={4}
                />
              </div>
            </section>
            
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <h2 className="text-lg font-medium mb-4">Playdate Groups</h2>
              
              <div className="space-y-3">
                <PlaydateGroupCard 
                  id="1"
                  name="Calgary STEM Parents"
                  members={12}
                  lastActive="2 days ago"
                />
                
                <PlaydateGroupCard 
                  id="2"
                  name="NW Calgary Outdoor Play"
                  members={23}
                  lastActive="5 hours ago"
                />
                
                <PlaydateGroupCard 
                  id="3"
                  name="Indoor Winter Activities"
                  members={18}
                  lastActive="1 day ago"
                />
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  Explore All Groups
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

interface PlaydateItemProps {
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  status: 'pending' | 'confirmed' | 'completed';
  onClick: () => void;
}

const PlaydateItem = ({ title, date, time, location, attendees, status, onClick }: PlaydateItemProps) => {
  const statusColors = {
    pending: 'text-muted-foreground',
    confirmed: 'text-primary',
    completed: 'text-secondary'
  };
  
  const statusLabels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed'
  };
  
  return (
    <div 
      className="flex items-start p-4 rounded-lg border border-muted bg-muted/10 hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary">
        <Calendar className="h-6 w-6" />
      </div>
      <div className="ml-4 flex-grow">
        <div className="flex justify-between">
          <h3 className="font-medium">{title}</h3>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full bg-${statusColors[status]}`}></div>
            <span className={`text-xs capitalize ${statusColors[status]}`}>{statusLabels[status]}</span>
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

interface SuggestedPlaydateCardProps {
  title: string;
  date: string;
  location: string;
  numFamilies: number;
}

const SuggestedPlaydateCard = ({ title, date, location, numFamilies }: SuggestedPlaydateCardProps) => {
  return (
    <div className="p-3 rounded-lg border border-muted hover:border-primary/20 transition-colors">
      <h4 className="font-medium text-sm">{title}</h4>
      <div className="flex items-center text-xs text-muted-foreground mt-1">
        <Calendar className="h-3 w-3 mr-1" /> 
        <span>{date}</span>
      </div>
      <div className="flex items-center text-xs text-muted-foreground mt-1">
        <MapPin className="h-3 w-3 mr-1" /> 
        <span>{location}</span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-muted-foreground">
          <Users className="h-3 w-3 inline mr-1" />
          {numFamilies} families interested
        </span>
        <Button variant="outline" size="sm" className="h-7 text-xs">
          Join
        </Button>
      </div>
    </div>
  );
};

interface PlaydateGroupCardProps {
  id: string;
  name: string;
  members: number;
  lastActive: string;
}

const PlaydateGroupCard = ({ id, name, members, lastActive }: PlaydateGroupCardProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="p-3 rounded-lg border border-muted hover:border-primary/20 transition-colors">
      <h4 className="font-medium text-sm">{name}</h4>
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-muted-foreground">
          <Users className="h-3 w-3 inline mr-1" />
          {members} members
        </span>
        <span className="text-xs text-muted-foreground">
          Active {lastActive}
        </span>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full mt-2 h-7 text-xs"
        onClick={() => navigate(`/group/${id}`)}
      >
        View Group
      </Button>
    </div>
  );
};

export default Playdates;
