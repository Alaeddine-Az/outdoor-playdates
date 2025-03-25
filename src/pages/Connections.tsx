
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useConnections } from '@/hooks/useConnections';
import ConnectionsList from '@/components/ConnectionsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ConnectionsPage = () => {
  const [activeTab, setActiveTab] = useState('accepted');
  const { 
    loading, 
    pendingRequests, 
    sentRequests, 
    connections, 
    connectionProfiles,
    respondToRequest 
  } = useConnections();
  
  const handleRespond = async (connectionId: string, accept: boolean) => {
    await respondToRequest(connectionId, accept);
  };
  
  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-60" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">Your Connections</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted">
            <TabsTrigger value="accepted">
              Connected
              {connections.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-primary text-white">
                  {connections.length}
                </span>
              )}
            </TabsTrigger>
            
            <TabsTrigger value="pending">
              Pending Requests
              {pendingRequests.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-primary text-white">
                  {pendingRequests.length}
                </span>
              )}
            </TabsTrigger>
            
            <TabsTrigger value="sent">
              Sent Requests
              {sentRequests.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-primary text-white">
                  {sentRequests.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="accepted" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <ConnectionsList 
                  connections={connections}
                  profiles={connectionProfiles}
                  type="accepted"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pending" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Connection Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <ConnectionsList 
                  connections={pendingRequests}
                  profiles={connectionProfiles}
                  onRespond={handleRespond}
                  type="pending"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sent" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Sent Connection Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <ConnectionsList 
                  connections={sentRequests}
                  profiles={connectionProfiles}
                  type="sent"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ConnectionsPage;
