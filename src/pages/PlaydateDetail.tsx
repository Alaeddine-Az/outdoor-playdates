
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  MessageCircle, 
  Share2, 
  Check,
  X,
  Info,
  Star,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PlaydateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // This would normally come from an API call using the ID
  const playdateData = {
    id: id,
    title: "Park Adventure & Nature Scavenger Hunt",
    date: "June 15, 2025",
    time: "3:00 PM - 5:00 PM",
    location: "Prince's Island Park",
    address: "698 Eau Claire Ave SW, Calgary, AB",
    description: "Join us for a fun afternoon at Prince's Island Park! We'll start with free play at the playground, followed by a guided nature scavenger hunt. Perfect for kids ages 4-8 who love being outdoors and exploring nature. Please bring water bottles and snacks. We'll meet by the main playground entrance.",
    host: {
      id: "host1",
      name: "Sarah Johnson",
      children: [
        { name: "Ethan", age: 7 },
        { name: "Noah", age: 5 }
      ]
    },
    attendees: [
      {
        id: "parent1",
        name: "Michael Brown",
        children: [
          { name: "Isabella", age: 6 }
        ]
      },
      {
        id: "parent2",
        name: "Jennifer Davis",
        children: [
          { name: "Mason", age: 7 },
          { name: "Olivia", age: 4 }
        ]
      }
    ],
    pendingAttendees: [
      {
        id: "parent3",
        name: "Robert Wilson",
        children: [
          { name: "Sophia", age: 5 }
        ]
      }
    ],
    status: "confirmed",
    ageRange: "4-8 years",
    maxAttendees: 5,
    tags: ["Outdoor", "Nature", "Physical Activity"]
  };
  
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-start mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Playdates
          </button>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary">
                  <span className="text-sm font-medium">JUN</span>
                  <span className="font-bold">15</span>
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <h1 className="text-2xl font-bold">{playdateData.title}</h1>
                    <Badge variant="outline" className="ml-2 bg-primary/5 border-primary/20 text-primary">
                      {playdateData.status === "confirmed" ? "Confirmed" : "Pending"}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>{playdateData.date}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>{playdateData.time}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{playdateData.location}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-5 w-5 mr-2" />
                      <span>{playdateData.attendees.length + 1} families attending</span>
                    </div>
                  </div>
                  
                  <div className="mt-5 pt-5 border-t border-muted">
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{playdateData.description}</p>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {playdateData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="rounded-full">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-muted flex flex-col sm:flex-row gap-3">
                <Button className="button-glow bg-primary hover:bg-primary/90 text-white rounded-xl w-full sm:w-auto">
                  <Check className="h-4 w-4 mr-2" /> RSVP as Attending
                </Button>
                <Button variant="outline" className="rounded-xl w-full sm:w-auto">
                  <X className="h-4 w-4 mr-2" /> Decline
                </Button>
                <Button variant="ghost" className="text-muted-foreground w-full sm:w-auto">
                  <Calendar className="h-4 w-4 mr-2" /> Add to Calendar
                </Button>
              </div>
            </section>
            
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <h2 className="text-xl font-medium mb-4">Location</h2>
              <div className="rounded-lg border border-muted overflow-hidden aspect-[16/9] bg-muted/30 flex items-center justify-center mb-4">
                <div className="text-center p-6">
                  <MapPin className="h-10 w-10 text-primary/50 mx-auto mb-2" />
                  <p className="text-muted-foreground">Interactive map would display here</p>
                  <p className="text-sm text-muted-foreground mt-1">{playdateData.address}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium">{playdateData.location}</h4>
                  <p className="text-sm text-muted-foreground">{playdateData.address}</p>
                </div>
                <Button variant="outline" size="sm">
                  Get Directions
                </Button>
              </div>
            </section>
            
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <h2 className="text-xl font-medium mb-4">Attendees</h2>
              
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">HOST</h3>
                  <AttendeeItem 
                    id={playdateData.host.id}
                    name={playdateData.host.name}
                    children={playdateData.host.children}
                    isHost={true}
                  />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">ATTENDING ({playdateData.attendees.length})</h3>
                  <div className="space-y-3">
                    {playdateData.attendees.map((attendee) => (
                      <AttendeeItem 
                        key={attendee.id}
                        id={attendee.id}
                        name={attendee.name}
                        children={attendee.children}
                        isHost={false}
                      />
                    ))}
                  </div>
                </div>
                
                {playdateData.pendingAttendees.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">PENDING ({playdateData.pendingAttendees.length})</h3>
                    <div className="space-y-3">
                      {playdateData.pendingAttendees.map((attendee) => (
                        <AttendeeItem 
                          key={attendee.id}
                          id={attendee.id}
                          name={attendee.name}
                          children={attendee.children}
                          isHost={false}
                          isPending={true}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
            
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium">Discussion</h2>
              </div>
              
              <div className="p-4 rounded-lg border border-muted bg-muted/10 text-center">
                <MessageCircle className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-muted-foreground">Join the playdate to participate in the discussion</p>
                <Button className="mt-3">
                  RSVP to Comment
                </Button>
              </div>
            </section>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <h2 className="text-lg font-medium mb-4">Playdate Details</h2>
              <div className="space-y-4">
                <DetailItem 
                  icon={<Users className="h-5 w-5 text-primary" />}
                  label="Age Range"
                  value={playdateData.ageRange}
                />
                <DetailItem 
                  icon={<Info className="h-5 w-5 text-primary" />}
                  label="Max Attendees"
                  value={`${playdateData.attendees.length + 1} of ${playdateData.maxAttendees}`}
                />
                <DetailItem 
                  icon={<Star className="h-5 w-5 text-primary" />}
                  label="Activity Type"
                  value="Outdoor Play"
                />
              </div>
            </section>
            
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <h2 className="text-lg font-medium mb-4">Similar Playdates</h2>
              <div className="space-y-3">
                <SimilarPlaydateItem 
                  title="Nature Walk & Bird Watching"
                  date="June 22, 2025"
                  location="Inglewood Bird Sanctuary"
                  onClick={() => navigate('/playdate/10')}
                />
                <SimilarPlaydateItem 
                  title="Community Park Meetup"
                  date="June 18, 2025"
                  location="North Glenmore Park"
                  onClick={() => navigate('/playdate/11')}
                />
              </div>
              <Button variant="ghost" className="w-full mt-3 text-muted-foreground">
                View More Similar Playdates
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

interface AttendeeItemProps {
  id: string;
  name: string;
  children: { name: string; age: number }[];
  isHost?: boolean;
  isPending?: boolean;
}

const AttendeeItem = ({ id, name, children, isHost = false, isPending = false }: AttendeeItemProps) => {
  const navigate = useNavigate();
  const initials = name.split(' ').map(n => n[0]).join('');
  
  return (
    <div 
      className="flex items-center p-3 rounded-lg border border-muted hover:bg-muted/10 transition-colors cursor-pointer"
      onClick={() => navigate(`/parent/${id}`)}
    >
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
        {initials}
      </div>
      <div className="ml-3 flex-grow">
        <div className="flex items-center">
          <h4 className="font-medium">{name}</h4>
          {isHost && (
            <Badge variant="outline" className="ml-2 text-xs">Host</Badge>
          )}
          {isPending && (
            <Badge variant="outline" className="ml-2 text-xs text-muted-foreground">Pending</Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {children.map((child, index) => (
            <span key={index}>
              {child.name} ({child.age})
              {index < children.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      </div>
      <Button variant="ghost" size="sm" className="ml-2" onClick={(e) => { e.stopPropagation(); }}>
        <MessageCircle className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const DetailItem = ({ icon, label, value }: DetailItemProps) => (
  <div className="flex items-center">
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
      {icon}
    </div>
    <div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  </div>
);

interface SimilarPlaydateItemProps {
  title: string;
  date: string;
  location: string;
  onClick: () => void;
}

const SimilarPlaydateItem = ({ title, date, location, onClick }: SimilarPlaydateItemProps) => (
  <div 
    className="p-3 rounded-lg border border-muted hover:bg-muted/10 transition-colors cursor-pointer"
    onClick={onClick}
  >
    <h4 className="font-medium">{title}</h4>
    <div className="flex flex-col text-sm text-muted-foreground mt-1">
      <div className="flex items-center">
        <Calendar className="h-3 w-3 mr-1" />
        <span>{date}</span>
      </div>
      <div className="flex items-center mt-1">
        <MapPin className="h-3 w-3 mr-1" />
        <span>{location}</span>
      </div>
    </div>
  </div>
);

export default PlaydateDetail;
