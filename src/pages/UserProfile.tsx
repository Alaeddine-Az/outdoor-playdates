
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
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
  const { profile, children, loading, isCurrentUser } = useProfile(id);
  const [activeTab, setActiveTab] = useState('children');
  
  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Skeleton className="h-[250px] w-full rounded-xl" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </AppLayout>
    );
  }

  if (!profile) {
    return (
      <AppLayout>
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground">
            The requested profile could not be found.
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
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
    </AppLayout>
  );
};

export default UserProfile;
