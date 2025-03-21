
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Users, 
  MessageCircle, 
  Trophy, 
  Star,
  CheckCircle2
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ParentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isCurrentUser = id === 'current';
  
  // This would normally come from an API call using the ID
  const parentData = {
    name: "Sarah Johnson",
    location: "Calgary, AB",
    joinDate: "March 2025",
    bio: "Mom of two energetic boys who love outdoor adventures and STEM activities. Looking for regular playdate opportunities in NW Calgary.",
    interests: ["Outdoor Play", "STEM Activities", "Arts & Crafts", "Sports"],
    children: [
      { name: "Ethan", age: 7, interests: ["Soccer", "Science", "Dinosaurs"] },
      { name: "Noah", age: 5, interests: ["Drawing", "Swimming", "Superheros"] }
    ],
    verified: true,
    connections: 14,
    playdatesAttended: 8,
    playdatesHosted: 3,
    achievements: 12
  };
  
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-start mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </button>
          
          {isCurrentUser && (
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main profile info */}
          <div className="md:col-span-2 space-y-6">
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="w-28 h-28 rounded-full bg-primary/10 flex flex-col items-center justify-center text-primary font-bold text-4xl">
                  {parentData.name.split(' ').map(n => n[0]).join('')}
                </div>
                
                <div className="flex-grow text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold">{parentData.name}</h1>
                    {parentData.verified && (
                      <Badge variant="outline" className="inline-flex items-center gap-1 border-primary/30 text-primary">
                        <CheckCircle2 className="h-3 w-3" /> Verified Parent
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 text-muted-foreground text-sm mb-4">
                    <div className="flex items-center justify-center md:justify-start">
                      <MapPin className="h-4 w-4 mr-1" /> {parentData.location}
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                      <Calendar className="h-4 w-4 mr-1" /> Joined {parentData.joinDate}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground">{parentData.bio}</p>
                  
                  {!isCurrentUser && (
                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                      <Button className="button-glow bg-primary hover:bg-primary/90 text-white rounded-xl">
                        <Users className="h-4 w-4 mr-2" /> Connect
                      </Button>
                      <Button variant="outline" className="rounded-xl">
                        <MessageCircle className="h-4 w-4 mr-2" /> Message
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-muted">
                <h3 className="font-medium mb-3">Family Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {parentData.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="rounded-full py-1 px-3">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </section>
            
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <h2 className="text-xl font-medium mb-4">Children</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parentData.children.map((child, index) => (
                  <div key={index} className="p-4 rounded-lg border border-muted">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-medium">
                        {child.name[0]}
                      </div>
                      <div>
                        <h4 className="font-medium">{child.name}</h4>
                        <p className="text-sm text-muted-foreground">{child.age} years old</p>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-1">Interests</h5>
                      <div className="flex flex-wrap gap-1">
                        {child.interests.map((interest, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <h2 className="text-xl font-medium mb-4">Recent Playdates</h2>
              <div className="space-y-3">
                <PlaydateHistoryItem 
                  title="Nature Scavenger Hunt"
                  date="June 5, 2025"
                  location="Fish Creek Park"
                  role="Host"
                  onClick={() => navigate('/playdate/3')}
                />
                <PlaydateHistoryItem 
                  title="STEM Play Session"
                  date="May 28, 2025"
                  location="Science Centre"
                  role="Attendee"
                  onClick={() => navigate('/playdate/2')}
                />
                <PlaydateHistoryItem 
                  title="Playground Meetup"
                  date="May 21, 2025"
                  location="North Glenmore Park"
                  role="Attendee"
                  onClick={() => navigate('/playdate/8')}
                />
              </div>
            </section>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <h2 className="text-lg font-medium mb-4">Profile Stats</h2>
              <div className="space-y-4">
                <StatItem 
                  icon={<Users className="h-5 w-5 text-primary" />}
                  label="Connections"
                  value={parentData.connections}
                />
                <StatItem 
                  icon={<Calendar className="h-5 w-5 text-primary" />}
                  label="Playdates Attended"
                  value={parentData.playdatesAttended}
                />
                <StatItem 
                  icon={<Star className="h-5 w-5 text-primary" />}
                  label="Playdates Hosted"
                  value={parentData.playdatesHosted}
                />
                <StatItem 
                  icon={<Trophy className="h-5 w-5 text-primary" />}
                  label="Achievements"
                  value={parentData.achievements}
                />
              </div>
            </section>
            
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <h2 className="text-lg font-medium mb-4">Parent Groups</h2>
              <div className="space-y-3">
                <GroupItem 
                  name="Calgary STEM Parents"
                  members={12}
                  onClick={() => navigate('/group/1')}
                />
                <GroupItem 
                  name="NW Calgary Outdoor Play"
                  members={23}
                  onClick={() => navigate('/group/2')}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

interface PlaydateHistoryItemProps {
  title: string;
  date: string;
  location: string;
  role: 'Host' | 'Attendee';
  onClick: () => void;
}

const PlaydateHistoryItem = ({ title, date, location, role, onClick }: PlaydateHistoryItemProps) => (
  <div className="flex items-center p-3 rounded-lg border border-muted hover:bg-muted/10 transition-colors cursor-pointer" onClick={onClick}>
    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
      <Calendar className="h-5 w-5" />
    </div>
    <div className="ml-3 flex-grow">
      <h4 className="font-medium">{title}</h4>
      <div className="flex gap-3 text-xs text-muted-foreground">
        <span>{date}</span>
        <span>{location}</span>
      </div>
    </div>
    <Badge variant={role === 'Host' ? 'secondary' : 'outline'} className="ml-2">
      {role}
    </Badge>
  </div>
);

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

const StatItem = ({ icon, label, value }: StatItemProps) => (
  <div className="flex items-center">
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
      {icon}
    </div>
    <div>
      <div className="font-medium">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  </div>
);

interface GroupItemProps {
  name: string;
  members: number;
  onClick: () => void;
}

const GroupItem = ({ name, members, onClick }: GroupItemProps) => (
  <div 
    className="p-3 rounded-lg border border-muted hover:bg-muted/10 transition-colors cursor-pointer"
    onClick={onClick}
  >
    <h4 className="font-medium">{name}</h4>
    <div className="flex items-center text-sm text-muted-foreground mt-1">
      <Users className="h-4 w-4 mr-1" />
      <span>{members} members</span>
    </div>
  </div>
);

export default ParentProfile;
