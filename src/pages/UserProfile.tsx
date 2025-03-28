
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import ProfileHeader from '@/components/ProfileHeader';
import ChildrenList from '@/components/ChildrenList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { profile, children, loading, error, isCurrentUser } = useProfile(id);
  const [activeTab, setActiveTab] = useState('children');
  
  if (loading) {
    return (
      <AppLayoutWrapper>
        <div className="space-y-6">
          <Skeleton className="h-[250px] w-full rounded-xl" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </AppLayoutWrapper>
    );
  }

  if (error || !profile) {
    return (
      <AppLayoutWrapper>
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground">
            {error || "The requested profile could not be found."}
          </p>
        </div>
      </AppLayoutWrapper>
    );
  }

  return (
    <AppLayoutWrapper>
      <div className="animate-fade-in space-y-6">
        <ProfileHeader 
          profile={profile} 
          isCurrentUser={isCurrentUser} 
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted">
            <TabsTrigger value="children">Children</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="children" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>{isCurrentUser ? 'Your Children' : `${profile.parent_name}'s Children`}</CardTitle>
              </CardHeader>
              <CardContent>
                <ChildrenList 
                  children={children}
                  parentId={profile.id}
                  isCurrentUser={isCurrentUser}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>{isCurrentUser ? 'Your Events' : `${profile.parent_name}'s Events`}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-6 text-center text-muted-foreground">
                  No events yet.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayoutWrapper>
  );
};

export default UserProfile;
