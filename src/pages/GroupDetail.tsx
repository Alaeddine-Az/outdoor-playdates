import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  MessageCircle, 
  Info, 
  Shield, 
  Globe, 
  Settings,
  Bell,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // This would normally come from an API call using the ID
  const groupData = {
    id,
    name: id === "1" ? "Calgary STEM Parents" : "NW Calgary Outdoor Play",
    description: id === "1" 
      ? "A community for parents in Calgary who are interested in STEM (Science, Technology, Engineering, Math) activities for their children. We organize regular playdates focused on hands-on learning, experiments, and educational fun."
      : "For families in Northwest Calgary looking for outdoor play opportunities. We organize regular meetups at local parks, nature reserves, and playgrounds to encourage active outdoor play.",
    memberCount: id === "1" ? 12 : 23,
    created: "January 2025",
    location: "Calgary, AB",
    type: "Private",
    upcoming: id === "1" ? 2 : 3,
    pastEvents: id === "1" ? 8 : 12,
    admin: {
      id: "admin1",
      name: "Sarah Johnson"
    },
    moderators: [
      {
        id: "mod1",
        name: "Michael Brown"
      }
    ],
    upcomingPlaydates: [
      {
        id: "play1",
        title: id === "1" ? "Science Centre Visit" : "Forest Exploration Day",
        date: "June 22, 2025",
        location: id === "1" ? "Calgary Science Centre" : "Nose Hill Park",
        attendees: 5
      },
      {
        id: "play2",
        title: id === "1" ? "Robot Building Workshop" : "Nature Scavenger Hunt",
        date: "June 29, 2025",
        location: id === "1" ? "Central Library" : "Bowness Park",
        attendees: 4
      }
    ],
    members: [
      {
        id: "member1",
        name: "Sarah Johnson",
        role: "Admin"
      },
      {
        id: "member2",
        name: "Michael Brown",
        role: "Moderator"
      },
      {
        id: "member3",
        name: "Jennifer Davis",
        role: "Member"
      },
      {
        id: "member4",
        name: "Robert Wilson",
        role: "Member"
      },
      {
        id: "member5",
        name: "Emily Thompson",
        role: "Member"
      }
    ]
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
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" /> Manage
            </Button>
          </div>
        </div>
        
        <section className="bg-white rounded-xl shadow-soft border border-muted p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Users className="h-8 w-8" />
            </div>
            
            <div className="flex-grow">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <h1 className="text-2xl font-bold">{groupData.name}</h1>
                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">
                  {groupData.type} Group
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{groupData.members.length} members</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Globe className="h-5 w-5 mr-2" />
                  <span>{groupData.location}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>Created {groupData.created}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Info className="h-5 w-5 mr-2" />
                  <span>{groupData.upcoming} upcoming playdates</span>
                </div>
              </div>
              
              <div className="mt-5 pt-5 border-t border-muted">
                <h3 className="font-medium mb-2">About This Group</h3>
                <p className="text-muted-foreground">{groupData.description}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-muted flex flex-col sm:flex-row gap-3">
            <Button className="button-glow bg-primary hover:bg-primary/90 text-white rounded-xl w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" /> Join Group
            </Button>
            <Button variant="outline" className="rounded-xl w-full sm:w-auto">
              <MessageCircle className="h-4 w-4 mr-2" /> Message Admin
            </Button>
            <Button variant="ghost" className="text-muted-foreground w-full sm:w-auto">
              <Bell className="h-4 w-4 mr-2" /> Get Notifications
            </Button>
          </div>
        </section>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <h2 className="text-xl font-medium mb-4">Upcoming Playdates</h2>
              <div className="space-y-3">
                {groupData.upcomingPlaydates.map(playdate => (
                  <div 
                    key={playdate.id}
                    className="p-4 rounded-lg border border-muted hover:bg-muted/10 transition-colors cursor-pointer"
                    onClick={() => navigate(`/playdate/${playdate.id}`)}
                  >
                    <h3 className="font-medium">{playdate.title}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{playdate.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{playdate.attendees} families attending</span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                      <Globe className="h-4 w-4 mr-1" />
                      <span>{playdate.location}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" className="w-full">
                  View All Group Playdates
                </Button>
              </div>
            </section>
            
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium">Group Discussion</h2>
              </div>
              
              <div className="p-4 rounded-lg border border-muted bg-muted/10 text-center">
                <MessageCircle className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-muted-foreground">Join the group to participate in the discussion</p>
                <Button className="mt-3">
                  Join to Comment
                </Button>
              </div>
            </section>
          </div>
          
          <div className="space-y-6">
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <h2 className="text-lg font-medium mb-4">Group Admins & Moderators</h2>
              <div className="space-y-3">
                <MemberItem 
                  id={groupData.admin.id}
                  name={groupData.admin.name}
                  role="Admin"
                />
                {groupData.moderators.map(mod => (
                  <MemberItem 
                    key={mod.id}
                    id={mod.id}
                    name={mod.name}
                    role="Moderator"
                  />
                ))}
              </div>
            </section>
            
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Members</h2>
                <span className="text-sm text-muted-foreground">{groupData.members.length} total</span>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {groupData.members.map((member, index) => (
                  <MemberItem 
                    key={index}
                    id={member.id}
                    name={member.name}
                    role={member.role as "Admin" | "Moderator" | "Member"}
                  />
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-3 text-muted-foreground">
                See All Members
              </Button>
            </section>
            
            <section className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <h2 className="text-lg font-medium mb-4">Group Guidelines</h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Safety First</h4>
                    <p className="text-sm text-muted-foreground">All members must follow our safety guidelines for playdates</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Verified Profiles</h4>
                    <p className="text-sm text-muted-foreground">Only verified parents can participate in playdates</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Respectful Communication</h4>
                    <p className="text-sm text-muted-foreground">Maintain respectful, positive discussions</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

interface MemberItemProps {
  id: string;
  name: string;
  role: "Admin" | "Moderator" | "Member";
}

const MemberItem = ({ id, name, role }: MemberItemProps) => {
  const navigate = useNavigate();
  const initials = name.split(' ').map(n => n[0]).join('');
  
  const roleBadgeStyles = {
    "Admin": "bg-primary/10 text-primary",
    "Moderator": "bg-secondary/10 text-secondary",
    "Member": "bg-muted text-muted-foreground"
  };
  
  return (
    <div 
      className="flex items-center p-2 rounded-lg hover:bg-muted/10 transition-colors cursor-pointer"
      onClick={() => navigate(`/parent/${id}`)}
    >
      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
        {initials}
      </div>
      <div className="ml-3 flex-grow">
        <h4 className="font-medium">{name}</h4>
      </div>
      {role && (
        <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadgeStyles[role]}`}>
          {role}
        </span>
      )}
    </div>
  );
};

export default GroupDetail;
