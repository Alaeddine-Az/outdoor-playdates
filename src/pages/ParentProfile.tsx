
import React, { useState } from 'react';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Users, 
  MessageCircle, 
  UserPlus, 
  Plus
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import ProfileHeader from '@/components/ProfileHeader';
import ChildrenList from '@/components/ChildrenList';
import { useConnections } from '@/hooks/useConnections';

const ParentProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const profileId = id && id !== 'me' ? id : user?.id;
  const { profile, children, loading, error, isCurrentUser } = useProfile(profileId);
  
  if (loading) {
    return (
      <AppLayoutWrapper>
        <div className="p-6 max-w-5xl mx-auto space-y-6">
          <div className="h-10 w-40 bg-muted rounded animate-pulse mb-4"></div>
          <div className="h-64 bg-muted rounded animate-pulse"></div>
          <div className="h-32 bg-muted rounded animate-pulse"></div>
        </div>
      </AppLayoutWrapper>
    );
  }

  if (error || !profile) {
    return (
      <AppLayoutWrapper>
        <div className="p-6 max-w-5xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || "There was an error loading this profile."}
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </AppLayoutWrapper>
    );
  }

  return (
    <AppLayoutWrapper>
      <div className="p-6 max-w-5xl mx-auto animate-fade-in">
        <div className="flex justify-between items-start mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </button>
        </div>
        
        <div className="space-y-6">
          <ProfileHeader 
            profile={profile} 
            isCurrentUser={isCurrentUser} 
          />
          
          <div className="bg-white rounded-xl shadow-soft border border-muted p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Children</h2>
              {isCurrentUser && (
                <Button asChild size="sm" className="gap-1">
                  <Link to="/add-child">
                    <Plus className="h-4 w-4" /> Add Child
                  </Link>
                </Button>
              )}
            </div>
            
            <ChildrenList 
              children={children} 
              parentId={profile.id} 
              isCurrentUser={isCurrentUser}
            />
          </div>
        </div>
      </div>
    </AppLayoutWrapper>
  );
};

export default ParentProfile;
